<?php
// devices.php
header('Content-Type: application/json');

// Lädt die Verbindungsdatei (hier korrigiert auf config.php)
require_once '../system/config.php'; 

// Schutzbarriere: Prüfen, ob das Elternteil eingeloggt ist
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

function getJsonInput() {
    return json_decode(file_get_contents("php://input"), true) ?? [];
}

try {
    // 1. GERÄTE AUSLESEN (GET)
    // Holt alle Geräte von Kindern, die dem aktuell eingeloggten User gehören
    if ($method === 'GET') {
        $stmt = $pdo->prepare("
            SELECT d.id, d.child_id, d.name, d.type, c.name AS child_name
            FROM device d
            JOIN child c ON d.child_id = c.id
            WHERE c.parent_id = :parent_id
            ORDER BY d.id DESC
        ");

        $stmt->execute([':parent_id' => $userId]);

        echo json_encode([
            "status" => "success",
            "devices" => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ]);
        exit;
    }

    // 2. GERÄT HINZUFÜGEN (POST)
    if ($method === 'POST') {
        $data = getJsonInput();

        $childId = intval($data['child_id'] ?? 0);
        $deviceName = trim($data['name'] ?? '');
        $deviceType = trim($data['type'] ?? '');

        if (!$childId || !$deviceName) {
            echo json_encode([
                "status" => "error",
                "message" => "Kind-ID und Gerätename werden benötigt."
            ]);
            exit;
        }

        // Sicherheits-Check: Gehört das Kind überhaupt diesem User?
        $check = $pdo->prepare("SELECT id FROM child WHERE id = :id AND parent_id = :parent_id");
        $check->execute([':id' => $childId, ':parent_id' => $userId]);
        if (!$check->fetch()) {
            echo json_encode([
                "status" => "error",
                "message" => "Zugriff verweigert oder Kind nicht gefunden."
            ]);
            exit;
        }

        // In Tabelle 'device' eintragen
        $stmt = $pdo->prepare("
            INSERT INTO device (child_id, name, type)
            VALUES (:child_id, :name, :type)
        ");

        $stmt->execute([
            ':child_id' => $childId,
            ':name'     => $deviceName,
            ':type'     => $deviceType ? $deviceType : null
        ]);

        echo json_encode([
            "status" => "success",
            "message" => "Gerät erfolgreich hinzugefügt."
        ]);
        exit;
    }

    // 3. GERÄT LÖSCHEN (DELETE)
    if ($method === 'DELETE') {
        $data = getJsonInput();
        $deviceId = intval($data['id'] ?? 0);

        if (!$deviceId) {
            echo json_encode([
                "status" => "error",
                "message" => "Keine Geräte-ID erhalten."
            ]);
            exit;
        }

        // Sicherheits-Check: Gehört das Gerät einem Kind dieses Users?
        $check = $pdo->prepare("
            SELECT d.id FROM device d
            JOIN child c ON d.child_id = c.id
            WHERE d.id = :device_id AND c.parent_id = :parent_id
        ");
        $check->execute([':device_id' => $deviceId, ':parent_id' => $userId]);
        if (!$check->fetch()) {
            echo json_encode([
                "status" => "error",
                "message" => "Gerät nicht gefunden oder keine Berechtigung."
            ]);
            exit;
        }

        // Löschen ausführen
        $stmt = $pdo->prepare("DELETE FROM device WHERE id = :id");
        $stmt->execute([':id' => $deviceId]);

        echo json_encode([
            "status" => "success",
            "message" => "Gerät erfolgreich entfernt."
        ]);
        exit;
    }

    // Falls eine andere Methode genutzt wurde
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Methode nicht erlaubt."]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Serverfehler: " . $e->getMessage()
    ]);
}
?>
