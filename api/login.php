<?php
// login.php
ini_set('session.cookie_httponly', 1);
// ini_set('session.cookie_secure', 1); // Falls du HTTPS nutzt, einkommentieren
header('Content-Type: application/json');

// HIER ANGEPASST: Lädt die config.php aus demselben Ordner (api/)
require_once '../system/config.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $email    = trim($data['email'] ?? '');
    $password = trim($data['password'] ?? '');

    if (!$email || !$password) {
        echo json_encode(["status" => "error", "message" => "E-Mail und Passwort werden benötigt."]);
        exit;
    }

    // Benutzer in der Tabelle 'users' suchen
    $stmt = $pdo->prepare("SELECT id, password FROM users WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Passwort überprüfen (erwartet ein mit password_hash() verschlüsseltes Passwort in der DB)
    if ($user && password_verify($password, $user['password'])) {
        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email']   = $email;

        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Ungültige E-Mail oder Passwort."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Ungültige Anfrage-Methode."]);
}