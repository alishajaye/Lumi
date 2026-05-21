<?php
// kinder.php
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
    // 1. KINDER LADEN (GET)
    if ($method === 'GET') {
        $stmt = $pdo->prepare("
            SELECT id, parent_id, name, age, daily_limit, color, nfc_id
            FROM child
            WHERE parent_id = :parent_id
            ORDER BY id DESC
        ");
        $stmt->execute([':parent_id' => $userId]);
        echo json_encode([
            "status" => "success",
            "children" => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ]);
        exit;
    }

    // 2. KIND HINZUFÜGEN (POST)
    if ($method === 'POST') {
        $data = getJsonInput();
        $name = trim($data['name'] ?? '');
        $age = intval($data['age'] ?? 0);
        $dailyLimit = intval($data['daily_limit'] ?? 0);
        $color = trim($data['color'] ?? '#F19DAE');
        $nfcId = trim($data['nfc_id'] ?? '');

        if (!$name || $age < 0 || $dailyLimit < 0) {
            echo json_encode([
                "status" => "error",
                "message" => "Bitte alle Felder korrekt ausfüllen."
            ]);
            exit;
        }

        $stmt = $pdo->prepare("
            INSERT INTO child (parent_id, name, age, daily_limit, color, nfc_id)
            VALUES (:parent_id, :name, :age, :daily_limit, :color, :nfc_id)
        ");
        $stmt->execute([
            ':parent_id' => $userId,
            ':name'      => $name,
            ':age'       => $age,
            ':daily_limit' => $dailyLimit,
            ':color'     => $color,
            ':nfc_id'    => $nfcId ?: null
        ]);
        echo json_encode([
            "status" => "success",
            "message" => "Kind wurde hinzugefügt."
        ]);
        exit;
    }

    // 3. KIND BEARBEITEN (PUT)
    if ($method === 'PUT') {
        $data = getJsonInput();
        $id = intval($data['id'] ?? 0);
        $name = trim($data['name'] ?? '');
        $age = intval($data['age'] ?? 0);
        $dailyLimit = intval($data['daily_limit'] ?? 0);
        $color = trim($data['color'] ?? '#F19DAE');
        $nfcId = trim($data['nfc_id'] ?? '');

        if (!$id || !$name || $age < 0 || $dailyLimit < 0) {
            echo json_encode([
                "status" => "error",
                "message" => "Ungültige Daten."
            ]);
            exit;
        }

        $stmt = $pdo->prepare("
            UPDATE child
            SET name = :name, age = :age, daily_limit = :daily_limit,
                color = :color, nfc_id = :nfc_id
            WHERE id = :id AND parent_id = :parent_id
        ");
        $stmt->execute([
            ':name'        => $name,
            ':age'         => $age,
            ':daily_limit' => $dailyLimit,
            ':color'       => $color,
            ':nfc_id'      => $nfcId ?: null,
            ':id'          => $id,
            ':parent_id'   => $userId
        ]);
        echo json_encode([
            "status" => "success",
            "message" => "Kind wurde aktualisiert."
        ]);
        exit;
    }

    // 4. KIND LÖSCHEN (DELETE)
    if ($method === 'DELETE') {
        $data = getJsonInput();
        $id = intval($data['id'] ?? 0);

        if (!$id) {
            echo json_encode([
                "status" => "error",
                "message" => "Keine Kinder-ID erhalten."
            ]);
            exit;
        }

        $stmt = $pdo->prepare("
            DELETE FROM child
            WHERE id = :id AND parent_id = :parent_id
        ");
        $stmt->execute([
            ':id'        => $id,
            ':parent_id' => $userId
        ]);
        echo json_encode([
            "status" => "success",
            "message" => "Kind wurde gelöscht."
        ]);
        exit;
    }

    // Methode nicht erlaubt
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Methode nicht erlaubt."
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Serverfehler: " . $e->getMessage()
    ]);
}
