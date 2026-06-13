#include <Wire.h>
#include <Adafruit_PN532.h>
#include <Adafruit_NeoPixel.h>

#include "config.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#include <SPI.h>
#include <MFRC522.h>
#include <ESP32Servo.h>

String aktuellesKindRFID = "";

#define SDA_PIN 6
#define SCL_PIN 7

Adafruit_PN532 nfc(-1, -1);

//RC522
#define SS_PIN 5
#define RST_PIN 22

MFRC522 rfid(SS_PIN, RST_PIN);

// Ziel UID für Person
byte erlaubtePersonUID[] = {0x44, 0x72, 0x3F, 0xEF};
byte erlaubtePersonUIDLength = 4;

//ServoMotor

#define SERVO_PIN 13
#define SERVO_CLOSED 0
#define SERVO_OPEN 90

Servo myServo;
bool servoIstOffen = false;

//LED
#define LED_PIN 2
#define NUMPIXELS 12

Adafruit_NeoPixel ring(NUMPIXELS, LED_PIN, NEO_GRB + NEO_KHZ800);

// UID Tag
uint8_t erlaubteUID[] = {0x04, 0x03, 0xD3, 0x2E, 0x21, 0x02, 0x89};
uint8_t erlaubteUIDLength = 7;

// übrige Zeit
int startZeit = 10;

//Zustände
enum Zustand {
  PRESENT,
  MISSING,
  ALERT
};

Zustand zustand = PRESENT;
int sekundenRest = 0;

//UID überprüfen
bool uidIstErlaubt(uint8_t *uid, uint8_t uidLength) {

  if (uidLength != erlaubteUIDLength) return false;

  for (int i = 0; i < uidLength; i++) {
    if (uid[i] != erlaubteUID[i]) return false;
  }

  return true;
}

bool personIstErlaubt(byte *uid, byte len){
  if (len != erlaubtePersonUIDLength) return false;

  for (byte i = 0; i < len; i++) {
    if (uid[i] != erlaubtePersonUID[i]) return false;
  }
  return true;
}

void servoUmschalten() {

  if (!servoIstOffen) {

    // Serial.println("Servo öffnet...");
    Serial.println("Box offen");

    // myServo.write(SERVO_OPEN);

    servoIstOffen = true;

  } else {

    // Serial.println("Servo schließt...");
    Serial.println("Box geschlossen");

    // myServo.write(SERVO_CLOSED);

    servoIstOffen = false;
  }
}

void setup() {

  Serial.begin(115200);

 

  delay(3000); 
  Serial.println("\n\n--- ESP32-C6 startet ---");

  Wire.begin(SDA_PIN, SCL_PIN);

  WiFi.begin(SECRET_SSID, SECRET_PASS);
  Serial.print("Verbinde mit WLAN");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n Wlan verbunden!");

  nfc.begin();

  uint32_t versiondata = nfc.getFirmwareVersion();

  if (!versiondata) {

    Serial.println("PN532 nicht gefunden!");
    while (1);
  }

  Serial.println("PN532 verbunden!");

  nfc.SAMConfig();

  SPI.begin(18, 19, 23, SS_PIN);
  rfid.PCD_Init();

  Serial.println("RC522 bereit");

  //Servomotor

  // ESP32PWM::allocateTimer(0);
  // myServo.setPeriodHertz(50);
  // myServo.attach(SERVO_PIN, 500, 2400);
  // myServo.write(SERVO_CLOSED);

  ring.begin();
  ring.clear();
  ring.show();

  Serial.println("System gestartet");
}

int meldeServer(String action, String rfid) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(SECRET_URL); // URL aus der secrets.h
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> sendDoc;
    sendDoc["action"] = action;
    sendDoc["rfid_id"] = rfid;
    
    String requestBody;
    serializeJson(sendDoc, requestBody);

    Serial.println("Sende an Server: " + requestBody);
    int httpResponseCode = http.POST(requestBody);
    int antwortWert = 0;

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Antwort vom Server: " + response);

      StaticJsonDocument<512> responseDoc;
      deserializeJson(responseDoc, response);

      if (responseDoc["status"] == "success") {
        if (action == "start") {
          antwortWert = responseDoc["restzeit_sekunden"];
        } else {
          antwortWert = 1;
        }
      } else {
         Serial.println("Server meldet einen Fehler in der Logik.");
      }
    } else {
      Serial.print("Netzwerkfehler beim Senden: ");
      Serial.println(httpResponseCode);
    }
    http.end();
    
    return antwortWert;
  } else {
    Serial.println("Fehler: Kein WLAN verbunden!");
    return 0;
  }
}

void loop() {

  uint8_t uid[10];
  uint8_t uidLength;

  bool success = nfc.readPassiveTargetID(
    PN532_MIFARE_ISO14443A,
    uid,
    &uidLength,
    100 // timeout in ms
  );

  bool erlaubterTag = success && uidIstErlaubt(uid, uidLength);
  bool personGefunden = false;

  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()){
    String rfidString = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
      if(rfid.uid.uidByte[i] < 0x10) rfidString += "0";
      rfidString += String(rfid.uid.uidByte[i], HEX);
    }
    rfidString.toUpperCase();

    aktuellesKindRFID = rfidString; 
    Serial.println("Chip gelesen: " + aktuellesKindRFID);
    Serial.println("Kind erkannt");

    servoUmschalten();
    delay(1000);

    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
  }

  switch (zustand) {
    //PRESENT
    case PRESENT:

    if(!erlaubterTag && aktuellesKindRFID != ""){
      Serial.println("Handy fehlt!");

      int restzeitVomServer = meldeServer("start", aktuellesKindRFID);

      if (restzeitVomServer > 0) {
        sekundenRest = restzeitVomServer;

        startZeit = restzeitVomServer;

        zustand = MISSING;
        Serial.println("Restzeit: " + String(sekundenRest) + " Sekunden");
      } else {
        Serial.println("Zeit abgelaufen!");
        zustand = ALERT;
      }
    }

    break;

    //MISSING
    case MISSING:

      if(erlaubterTag){
        Serial.println("Handy wieder zurück.");

        meldeServer("end", aktuellesKindRFID);

        zustand = PRESENT;
        ring.clear();
        ring.show();
        aktuellesKindRFID = "";
        return;
      }

      {
        int ledsAn = map(sekundenRest, 0, startZeit, 0, NUMPIXELS);
        for (int i = 0; i < NUMPIXELS; i++){
          if (i < ledsAn) {
            ring.setPixelColor(i, ring.Color(0, 255, 0));
          } else {
            ring.setPixelColor(i, ring.Color(0, 0, 0));
          }
        }

        ring.show();
      }

      sekundenRest--;

      if(sekundenRest <= 0){
        Serial.println("ZEIT ABGELAUFEN!!");
        zustand = ALERT;
      }

      delay(1000);
      break;

      //ALERT
      case ALERT:
        if (erlaubterTag) {
          Serial.println("Handy wieder vorhanden");

          meldeServer("end", aktuellesKindRFID);

          zustand = PRESENT;
          ring.clear();
          ring.show();
          aktuellesKindRFID = "";
          return;
        }

        for (int i = 0; i < NUMPIXELS; i++) {
          ring.setPixelColor(i, ring.Color(255, 0, 0));
        }

        ring.show();
        delay(300);

        ring.clear();
        ring.show();
        delay(300);

        break;
  }

  delay(50);
}