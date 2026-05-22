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

// Falls die Session noch nicht gestartet wurde, starten wir sie hier sicherheitshalber
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

function getJsonInput() {
    return json_decode(file_get_contents("php://input"), true) ?? [];
}

try {
    // 1. KINDER LADEN (GET)
    if ($method === 'GET') {
        // Zuerst die Standard-Stammdaten aller Kinder holen (rfid_id und streak angepasst)
        $stmt = $pdo->prepare("
            SELECT id, parent_id, name, age, daily_limit, streak, color, rfid_id
            FROM child
            WHERE parent_id = :parent_id
            ORDER BY id DESC
        ");
        $stmt->execute([':parent_id' => $userId]);
        $children = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Jetzt für jedes Kind die Echtzeit-Statistiken live berechnen
        foreach ($children as &$child) {
            $childId = $child['id'];

            // A) Verbrauch für den HEUTIGEN TAG zusammenrechnen (aus Spalte 'duration')
            $stmtToday = $pdo->prepare("
                SELECT SUM(duration) as used_today 
                FROM session 
                WHERE child_id = :child_id AND DATE(start_time) = CURRENT_DATE
            ");
            $stmtToday->execute([':child_id' => $childId]);
            $todayResult = $stmtToday->fetch(PDO::FETCH_ASSOC);
            $child['used_today'] = intval($todayResult['used_today'] ?? 0);

            // B) Prüfen, ob aktuell eine Live-Session läuft (end_time ist NULL)
            $stmtActive = $pdo->prepare("
                SELECT start_time 
                FROM session
                WHERE child_id = :child_id AND end_time IS NULL 
                LIMIT 1
            ");
            $stmtActive->execute([':child_id' => $childId]);
            $activeSession = $stmtActive->fetch(PDO::FETCH_ASSOC);

            if ($activeSession) {
                $child['is_currently_using'] = true;
                // Wandelt den Timestamp von 'start_time' in ISO-Format für JS um
                $child['current_session_start'] = date('c', strtotime($activeSession['start_time']));
            } else {
                $child['is_currently_using'] = false;
                $child['current_session_start'] = null;
            }

            // C) Verbrauch für die AKTUELLE WOCHE (Montag bis Sonntag) aufschlüsseln
            $child['week_data'] = [0, 0, 0, 0, 0, 0, 0]; // Index 0=Mo, 1=Di, 2=Mi...
            
            // SQL-Abfrage: Holt die Summe der Sekunden pro Wochentag für die aktuelle Kalenderwoche
            $stmtWeek = $pdo->prepare("
                SELECT WEEKDAY(start_time) as wochentag, SUM(duration) as total_seconds
                FROM session
                WHERE child_id = :child_id 
                  AND YEARWEEK(start_time, 1) = YEARWEEK(CURRENT_DATE, 1)
                  AND duration IS NOT NULL
                GROUP BY WEEKDAY(start_time)
            ");
            $stmtWeek->execute([':child_id' => $childId]);
            $weekRows = $stmtWeek->fetchAll(PDO::FETCH_ASSOC);

            // Gefundene Werte in das 7-Tage-Array einsortieren
            foreach ($weekRows as $row) {
                $tagIndex = intval($row['wochentag']); // MySQL WEEKDAY liefert 0 für Mo bis 6 für So
                if ($tagIndex >= 0 && $tagIndex <= 6) {
                    $child['week_data'][$tagIndex] = intval($row['total_seconds'] ?? 0);
                }
            }
        }

        // Saubere Übergabe an dein uebersicht.js Frontend
        echo json_encode([
            "status" => "success",
            "children" => $children
        ]);
        exit;
    }

    // 2. KIND HINZUFÜGEN (POST)
    if ($method === 'POST') {
        $data = getJsonInput();
        $name = trim($data['name'] ?? '');
        $age = intval($data['age'] ?? 0);
        $dailyLimit = intval($data['daily_limit'] ?? 0); // Wird im Frontend bereits als Sekunden geschickt
        $color = trim($data['color'] ?? '#F19DAE');
        $rfidId = trim($data['rfid_id'] ?? ''); // von nfc_id zu rfid_id geändert

        if (!$name || $age < 0 || $dailyLimit < 0) {
            echo json_encode([
                "status" => "error",
                "message" => "Bitte alle Felder korrekt ausfüllen."
            ]);
            exit;
        }

        // SQL an neue Tabellenstruktur angepasst (rfid_id, streak wird per Default 0)
        $stmt = $pdo->prepare("
            INSERT INTO child (parent_id, name, age, daily_limit, streak, color, rfid_id)
            VALUES (:parent_id, :name, :age, :daily_limit, 0, :color, :rfid_id)
        ");
        $stmt->execute([
            ':parent_id' => $userId,
            ':name'      => $name,
            ':age'       => $age,
            ':daily_limit' => $dailyLimit,
            ':color'     => $color,
            ':rfid_id'    => $rfidId ?: null
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
        $rfidId = trim($data['rfid_id'] ?? ''); // von nfc_id zu rfid_id geändert

        if (!$id || !$name || $age < 0 || $dailyLimit < 0) {
            echo json_encode([
                "status" => "error",
                "message" => "Ungültige Daten."
            ]);
            exit;
        }

        // Spaltenname rfid_id angepasst
        $stmt = $pdo->prepare("
            UPDATE child
            SET name = :name, age = :age, daily_limit = :daily_limit,
                color = :color, rfid_id = :rfid_id
            WHERE id = :id AND parent_id = :parent_id
        ");
        $stmt->execute([
            ':name'        => $name,
            ':age'         => $age,
            ':daily_limit' => $dailyLimit,
            ':color'       => $color,
            ':rfid_id'      => $rfidId ?: null,
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
