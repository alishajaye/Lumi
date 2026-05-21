<?php
// register.php
header('Content-Type: application/json');

// HIER ANGEPASST: Lädt die config.php direkt aus dem api/ Ordner
require_once '../system/config.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $firstName = trim($data['firstName'] ?? '');
    $lastName  = trim($data['lastName']  ?? '');
    $email     = trim($data['email']     ?? '');
    $password  = trim($data['password']  ?? '');

    if (!$firstName || !$lastName || !$email || !$password) {
        echo json_encode(["status" => "error", "message" => "Alle Felder müssen ausgefüllt werden."]);
        exit;
    }

    // Prüfen, ob die E-Mail bereits existiert
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute([':email' => $email]);
    if ($stmt->fetch()) {
        echo json_encode(["status" => "error", "message" => "Diese E-Mail-Adresse wird bereits verwendet."]);
        exit;
    }

    // Passwort sicher hashen
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Neuen Benutzer (Elternteil) in die Tabelle 'users' einfügen
    // 'created_at' befüllt sich dank deiner Anpassung in phpMyAdmin ganz von alleine!
    $insert = $pdo->prepare("INSERT INTO users (email, password, vorname, nachname) VALUES (:email, :pass, :firstName, :lastName)");
    $insert->execute([
        ':email'     => $email,
        ':pass'      => $hashedPassword,
        ':firstName' => $firstName,
        ':lastName'  => $lastName
    ]);

    echo json_encode(["status" => "success", "message" => "Registrierung erfolgreich."]);

} else {
    echo json_encode(["status" => "error", "message" => "Ungültige Anfrage-Methode."]);
}
