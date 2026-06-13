<?php
// sessions.php
header('Content-Type: application/json');
require_once '../system/config.php';

$method = $_SERVER['REQUEST_METHOD'];

function getJsonInput() {
    return json_decode(file_get_contents("php://input"), true) ?? [];
}

try {
    if ($method === 'POST') {
        $data = getJsonInput();
        
        $action = trim($data['action'] ?? ''); 
        $rfidId = trim($data['rfid_id'] ?? '');

        if (!$rfidId || !in_array($action, ['start', 'end'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Ungültige Parameter."]);
            exit;
        }

        $stmt = $pdo->prepare("SELECT id, name, parent_id, daily_limit FROM child WHERE rfid_id = :rfid_id");
        $stmt->execute([':rfid_id' => $rfidId]);
        $child = $stmt->fetch();

        if (!$child) {
            http_response_code(444); 
            echo json_encode(["status" => "error", "message" => "RFID-Karte nicht registriert."]);
            exit;
        }

        $childId    = $child['id'];
        $childName  = $child['name'];
        $parentId   = $child['parent_id'];
        $dailyLimit = intval($child['daily_limit']); // Limit in Sekunden

        // ==========================================
        // SZENARIO A: SITZUNG STARTEN
        // ==========================================
        if ($action === 'start') {
            $timeCheckStmt = $pdo->prepare("
                SELECT COALESCE(SUM(duration), 0) as total_used 
                FROM session 
                WHERE child_id = :child_id AND DATE(start_time) = CURRENT_DATE AND status = 'completed'
            ");
            $timeCheckStmt->execute([':child_id' => $childId]);
            $totalUsedToday = intval($timeCheckStmt->fetch()['total_used']);
            
            $restzeit = $dailyLimit - $totalUsedToday;
            
            if ($restzeit <= 0) {
                echo json_encode(["status" => "error", "message" => "Tageslimit bereits erreicht.", "restzeit" => 0]);
                exit;
            }

            $checkSession = $pdo->prepare("SELECT id FROM session WHERE child_id = :child_id AND status = 'active'");
            $checkSession->execute([':child_id' => $childId]);
            
            if ($checkSession->fetch()) {
                echo json_encode(["status" => "error", "message" => "Session läuft bereits."]);
                exit;
            }

            $stmt = $pdo->prepare("
                INSERT INTO session (child_id, device_id, start_time, allocated_time, status) 
                VALUES (:child_id, 1, CURRENT_TIMESTAMP, :allocated_time, 'active')
            ");
            $stmt->execute([
                ':child_id' => $childId,
                ':allocated_time' => $restzeit
            ]);

            $notifStmt = $pdo->prepare("
                INSERT INTO notifications (parent_id, child_id, message, created_at) 
                VALUES (:parent_id, :child_id, :message, CURRENT_TIMESTAMP)
            ");
            $notifStmt->execute([
                ':parent_id' => $parentId,
                ':child_id'  => $childId,
                ':message'   => $childName . " hat das Gerät aus der Box genommen."
            ]);

            echo json_encode([
                "status" => "success", 
                "message" => "Sitzung erfolgreich gestartet.",
                "restzeit_sekunden" => $restzeit
            ]);
            exit;
        }

        // ==========================================
        // SZENARIO B: SITZUNG BEENDEN
        // ==========================================
        if ($action === 'end') {
            $sessionStmt = $pdo->prepare("SELECT id, start_time FROM session WHERE child_id = :child_id AND status = 'active' ORDER BY id DESC LIMIT 1");
            $sessionStmt->execute([':child_id' => $childId]);
            $openSession = $sessionStmt->fetch();

            if (!$openSession) {
                echo json_encode(["status" => "error", "message" => "Keine offene Sitzung für dieses Kind gefunden."]);
                exit;
            }

            $sessionId = $openSession['id'];
            $startTime = strtotime($openSession['start_time']);
            $endTime   = time(); 

            // Dauer in Sekunden berechnen
            $durationInSeconds = $endTime - $startTime;
            if ($durationInSeconds <= 0) $durationInSeconds = 1;

            $updateSession = $pdo->prepare("UPDATE session SET end_time = CURRENT_TIMESTAMP, duration = :duration, status = 'completed' WHERE id = :id");
            $updateSession->execute([
                ':duration' => $durationInSeconds,
                ':id'       => $sessionId
            ]);

            // Benachrichtigung in Minuten umrechnen für bessere Lesbarkeit
            $durationReadable = round($durationInSeconds / 60);
            $notifStmt = $pdo->prepare("
                INSERT INTO notifications (parent_id, child_id, message, created_at) 
                VALUES (:parent_id, :child_id, :message, CURRENT_TIMESTAMP)
            ");
            $notifStmt->execute([
                ':parent_id' => $parentId,
                ':child_id'  => $childId,
                ':message'   => $childName . " hat das Gerät wieder zurückgelegt (Dauer: ca. " . $durationReadable . " Min.)."
            ]);

            $timeCheckStmt = $pdo->prepare("
                SELECT SUM(duration) as total_used 
                FROM session 
                WHERE child_id = :child_id AND DATE(start_time) = CURRENT_DATE AND status = 'completed'
            ");
            $timeCheckStmt->execute([':child_id' => $childId]);
            $totalUsedTodaySeconds = intval($timeCheckStmt->fetch()['total_used'] ?? 0);

            if ($totalUsedTodaySeconds > $dailyLimit) {
                $limitReadable = round($dailyLimit / 60);
                $limitNotifStmt = $pdo->prepare("
                    INSERT INTO notifications (parent_id, child_id, message, created_at) 
                    VALUES (:parent_id, :child_id, :message, CURRENT_TIMESTAMP)
                ");
                $limitNotifStmt->execute([
                    ':parent_id' => $parentId,
                    ':child_id'  => $childId,
                    ':message'   => $childName . " hat das Tageslimit von " . $limitReadable . " Minuten überschritten!"
                ]);
            }

            echo json_encode([
                "status" => "success",
                "message" => "Sitzung erfolgreich beendet.",
                "duration_seconds" => $durationInSeconds,
                "total_used_today_seconds" => $totalUsedTodaySeconds
            ]);
            exit;
        }
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