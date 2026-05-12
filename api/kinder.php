<?php
session_start();
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
            SELECT 
                id,
                parent_id,
                name,
                age,
                daily_limit,
                used_today,
                streak,
                color,
                time_saved,
                device_id
            FROM child
            WHERE parent_id = :parent_id
            ORDER BY id DESC
        ");

        $stmt->execute([
            ':parent_id' => $userId
        ]);

        echo json_encode([
            "status" => "success",
            "children" => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ]);
        exit;
    }

    if ($method === 'POST') {
        $data = getJsonInput();

        $name = trim($data['name'] ?? '');
        $age = intval($data['age'] ?? 0);
        $dailyLimit = intval($data['daily_limit'] ?? 0);
        $color = trim($data['color'] ?? '#F19DAE');

        if (!$name || $age < 0 || $dailyLimit < 0) {
            echo json_encode([
                "status" => "error",
                "message" => "Bitte alle Felder korrekt ausfüllen."
            ]);
            exit;
        }

        $stmt = $pdo->prepare("
            INSERT INTO child 
            (parent_id, name, age, daily_limit, used_today, streak, color, time_saved, device_id)
            VALUES 
            (:parent_id, :name, :age, :daily_limit, 0, 0, :color, 0, NULL)
        ");

        $stmt->execute([
            ':parent_id' => $userId,
            ':name' => $name,
            ':age' => $age,
            ':daily_limit' => $dailyLimit,
            ':color' => $color
        ]);

        echo json_encode([
            "status" => "success",
            "message" => "Kind wurde hinzugefügt."
        ]);
        exit;
    }

    if ($method === 'PUT') {
        $data = getJsonInput();

        $id = intval($data['id'] ?? 0);
        $name = trim($data['name'] ?? '');
        $age = intval($data['age'] ?? 0);
        $dailyLimit = intval($data['daily_limit'] ?? 0);
        $color = trim($data['color'] ?? '#F19DAE');

        if (!$id || !$name || $age < 0 || $dailyLimit < 0) {
            echo json_encode([
                "status" => "error",
                "message" => "Ungültige Daten."
            ]);
            exit;
        }

        $stmt = $pdo->prepare("
            UPDATE child
            SET 
                name = :name,
                age = :age,
                daily_limit = :daily_limit,
                color = :color
            WHERE id = :id AND parent_id = :parent_id
        ");

        $stmt->execute([
            ':name' => $name,
            ':age' => $age,
            ':daily_limit' => $dailyLimit,
            ':color' => $color,
            ':id' => $id,
            ':parent_id' => $userId
        ]);

        echo json_encode([
            "status" => "success",
            "message" => "Kind wurde aktualisiert."
        ]);
        exit;
    }

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
            ':id' => $id,
            ':parent_id' => $userId
        ]);

        echo json_encode([
            "status" => "success",
            "message" => "Kind wurde gelöscht."
        ]);
        exit;
    }

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
?>
