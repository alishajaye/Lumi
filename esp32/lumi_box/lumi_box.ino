#include <Wire.h>
#include <Adafruit_PN532.h>
#include <Adafruit_NeoPixel.h>

#include <SPI.h>
#include <MFRC522.h>
#include <ESP32Servo.h>

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

    Serial.println("Servo öffnet...");

    myServo.write(SERVO_OPEN);

    servoIstOffen = true;

  } else {

    Serial.println("Servo schließt...");

    myServo.write(SERVO_CLOSED);

    servoIstOffen = false;
  }
}

void setup() {

  Serial.begin(115200);

  Wire.begin(SDA_PIN, SCL_PIN);

  // Serial.println("Starte PN532...");

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

  ESP32PWM::allocateTimer(0);
  myServo.setPeriodHertz(50);
  myServo.attach(SERVO_PIN, 500, 2400);
  myServo.write(SERVO_CLOSED);

  // Serial.println("Überwachung gestartet...");

  ring.begin();
  ring.clear();
  ring.show();

  Serial.println("System gestartet");
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
    if (personIstErlaubt(rfid.uid.uidByte, rfid.uid.size)) {
      Serial.println("Person erkannt: ERLAUBT");

      personGefunden = true;

      servoUmschalten();
      delay(1000);
    } else {
      Serial.print("Unbekannte Person UID: ");

      for (byte i = 0; i < rfid.uid.size; i++) {
        Serial.print(rfid.uid.uidByte[i], HEX);
        Serial.print(" ");
      }
      Serial.println();
    }

    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
  }

  switch (zustand) {
    //PRESENT
    case PRESENT:

    if(erlaubterTag){
      return;
    }

    if(!erlaubterTag){
      Serial.println("Handy fehlt!");
      zustand = MISSING;
      sekundenRest = startZeit;
    }

    break;

    //MISSING
    case MISSING:

      if(erlaubterTag){
        Serial.println("Handy wieder zurück.");

        zustand = PRESENT;
        ring.clear();
        ring.show();
        return;
      }

      Serial.println("Sekunden übrig: ");
      Serial.println(sekundenRest);

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
          Serial.println("Objekt wieder vorhanden");

          zustand = PRESENT;
          ring.clear();
          ring.show();
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