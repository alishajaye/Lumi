<?php
// notifications.php
header('Content-Type: application/json');

if (file_exists(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
} elseif (file_exists(__DIR__ . '/Config.php')) {
    require_once __DIR__ . '/Config.php';
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Server-Konfiguration (config.php) wurde im api-Ordner nicht gefunden."
    ]);
    exit;
}

// Falls die Session noch nicht aktiv ist, starten
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Nicht eingeloggt"
    ]);
    exit;
}

$userId = $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

try {
    // 1. MITTEILUNGEN ABRUFEN (GET)
    if ($method === 'GET') {
        // SQL erweitert um n.is_read
        $stmt = $pdo->prepare("
            SELECT n.id, n.message, n.is_read, n.created_at, c.name AS child_name, c.color
            FROM notifications n
            JOIN child c ON n.child_id = c.id
            WHERE n.parent_id = :parent_id
            ORDER BY n.created_at DESC
            LIMIT 30
        ");
        $stmt->execute([':parent_id' => $userId]);
        echo json_encode([
            "status" => "success",
            "notifications" => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ]);
        exit;
    }

    // 2. MITTEILUNGEN ALS GELESEN MARKIEREN (PUT) - NEU
    if ($method === 'PUT') {
        // Setzt alle ungelesenen Nachrichten der Eltern auf gelesen (1)
        $stmt = $pdo->prepare("
            UPDATE notifications 
            SET is_read = 1 
            WHERE parent_id = :parent_id AND is_read = 0
        ");
        $stmt->execute([':parent_id' => $userId]);
        
        echo json_encode([
            "status" => "success",
            "message" => "Mitteilungen als gelesen markiert."
        ]);
        exit;
    }

    // 3. ALLE MITTEILUNGEN LÖSCHEN (DELETE)
    if ($method === 'DELETE') {
        $stmt = $pdo->prepare("DELETE FROM notifications WHERE parent_id = :parent_id");
        $stmt->execute([':parent_id' => $userId]);
        echo json_encode([
            "status" => "success",
            "message" => "Alle Mitteilungen erfolgreich gelöscht."
        ]);
        exit;
    }

    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Methode nicht erlaubt."]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Serverfehler beim Verarbeiten der Mitteilungen: " . $e->getMessage()
    ]);
}
?>
