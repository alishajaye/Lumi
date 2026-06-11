<?php
header('Content-Type: application/json');

require_once '../system/config.php'; 

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
    if ($method === 'GET') {
        $stmt = $pdo->prepare("
            SELECT d.id, d.child_id, d.name, d.type, d.NFC_id, d.is_in_box, c.name AS child_name
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

    if ($method === 'POST') {
        $data = getJsonInput();

        $childId = intval($data['child_id'] ?? 0);
        $deviceName = trim($data['name'] ?? '');
        $deviceType = trim($data['type'] ?? '');
        $nfcId = trim($data['nfc_id'] ?? ''); 

        if (!$childId || !$deviceName) {
            echo json_encode([
                "status" => "error",
                "message" => "Kind-ID und Gerätename werden benötigt."
            ]);
            exit;
        }

        $check = $pdo->prepare("SELECT id FROM child WHERE id = :id AND parent_id = :parent_id");
        $check->execute([':id' => $childId, ':parent_id' => $userId]);
        if (!$check->fetch()) {
            echo json_encode([
                "status" => "error",
                "message" => "Zugriff verweigert oder Kind nicht gefunden."
            ]);
            exit;
        }

        $stmt = $pdo->prepare("
            INSERT INTO device (child_id, name, type, NFC_id, is_in_box)
            VALUES (:child_id, :name, :type, :nfc_id, 1)
        ");

        $stmt->execute([
            ':child_id' => $childId,
            ':name'     => $deviceName,
            ':type'     => $deviceType ? $deviceType : null,
            ':nfc_id'   => $nfcId ? $nfcId : null
        ]);

        echo json_encode([
            "status" => "success",
            "message" => "Gerät erfolgreich hinzugefügt."
        ]);
        exit;
    }

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

        $stmt = $pdo->prepare("DELETE FROM device WHERE id = :id");
        $stmt->execute([':id' => $deviceId]);

        echo json_encode([
            "status" => "success",
            "message" => "Gerät erfolgreich entfernt."
        ]);
        exit;
    }

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
