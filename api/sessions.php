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
        
        $action = trim($data['action'] ?? ''); // 'start' oder 'end'
        // WICHTIG: In unserem ERM heißt das Feld in der Tabelle "child" "rfid_id", nicht "nfc_id"
        $rfidId = trim($data['rfid_id'] ?? '');

        if (!$rfidId || !in_array($action, ['start', 'end'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Ungültige Parameter."]);
            exit;
        }

        // 1. Kind anhand der RFID identifizieren
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
        $dailyLimit = intval($child['daily_limit']);

        // ==========================================
        // SZENARIO A: SITZUNG STARTEN
        // ==========================================
        if ($action === 'start') {
            // NEU: Zuerst berechnen wir die heute bereits verbrauchte Zeit aus der session Tabelle
            $timeCheckStmt = $pdo->prepare("
                SELECT COALESCE(SUM(duration), 0) as total_used 
                FROM session 
                WHERE child_id = :child_id AND DATE(start_time) = CURRENT_DATE AND status = 'completed'
            ");
            $timeCheckStmt->execute([':child_id' => $childId]);
            $totalUsedToday = intval($timeCheckStmt->fetch()['total_used']);
            
            // NEU: Restzeit berechnen
            $restzeit = $dailyLimit - $totalUsedToday;
            if ($restzeit <= 0) {
                echo json_encode(["status" => "error", "message" => "Tageslimit bereits erreicht.", "restzeit" => 0]);
                exit;
            }

            // NEU: Prüfen, ob für dieses Kind noch eine offene Session existiert (über das neue status Feld)
            $checkSession = $pdo->prepare("SELECT id FROM session WHERE child_id = :child_id AND status = 'active'");
            $checkSession->execute([':child_id' => $childId]);
            
            if ($checkSession->fetch()) {
                echo json_encode(["status" => "error", "message" => "Session läuft bereits."]);
                exit;
            }

            // NEU: Neue Session eintragen mit Status 'active' und der berechneten Restzeit
            $stmt = $pdo->prepare("
                INSERT INTO session (child_id, start_time, allocated_time, status) 
                VALUES (:child_id, CURRENT_TIMESTAMP, :allocated_time, 'active')
            ");
            $stmt->execute([
                ':child_id' => $childId,
                ':allocated_time' => $restzeit
            ]);

            // Benachrichtigung an Eltern (wie vom Teammitglied vorgesehen, Tabelle heißt laut ERM "notification", nicht "notifications")
            $notifStmt = $pdo->prepare("
                INSERT INTO notification (parent_id, child_id, message, created_at) 
                VALUES (:parent_id, :child_id, :message, CURRENT_TIMESTAMP)
            ");
            $notifStmt->execute([
                ':parent_id' => $parentId,
                ':child_id'  => $childId,
                ':message'   => $childName . " hat das Gerät aus der Box genommen."
            ]);

            // WICHTIG: Wir geben die Restzeit an den Microcontroller zurück!
            echo json_encode([
                "status" => "success", 
                "message" => "Sitzung erfolgreich gestartet.",
                "restzeit_minuten" => $restzeit
            ]);
            exit;
        }

        // ==========================================
        // SZENARIO B: SITZUNG BEENDEN
        // ==========================================
        if ($action === 'end') {
            // NEU: Finde die aktuell offene Session über den Status
            $sessionStmt = $pdo->prepare("SELECT id, start_time FROM session WHERE child_id = :child_id AND status = 'active' ORDER BY id DESC LIMIT 1");
            $sessionStmt->execute([':child_id' => $childId]);
            $openSession = $sessionStmt->fetch();

            if (!$openSession) {
                echo json_encode(["status" => "error", "message" => "Keine offene Sitzung für dieses Kind gefunden."]);
                exit;
            }

            $sessionId = $openSession['id'];
            $startTime = new DateTime($openSession['start_time']);
            $endTime   = new DateTime(); 

            // Berechne die Spieldauer in Minuten
            $interval = $startTime->diff($endTime);
            $durationInMinutes = ($interval->days * 24 * 60) + ($interval->h * 60) + $interval->i;
            if ($durationInMinutes === 0) $durationInMinutes = 1;

            // NEU: Update der Session-Tabelle (Endzeit, Dauer UND Status auf 'completed' setzen)
            $updateSession = $pdo->prepare("UPDATE session SET end_time = CURRENT_TIMESTAMP, duration = :duration, status = 'completed' WHERE id = :id");
            $updateSession->execute([
                ':duration' => $durationInMinutes,
                ':id'       => $sessionId
            ]);

            // HINWEIS: Der Eintrag in time_accounts wurde komplett gelöscht, da wir die Zeit dynamisch berechnen!

            // AUTOMATISCHER EINTRAG 2: Mitteilung über das Zurücklegen
            $notifStmt = $pdo->prepare("
                INSERT INTO notification (parent_id, child_id, message, created_at) 
                VALUES (:parent_id, :child_id, :message, CURRENT_TIMESTAMP)
            ");
            $notifStmt->execute([
                ':parent_id' => $parentId,
                ':child_id'  => $childId,
                ':message'   => $childName . " hat das Gerät wieder zurückgelegt (Dauer: " . $durationInMinutes . " Min.)."
            ]);

            // NEU: Limit-Check für den heutigen Tag (jetzt direkt aus der session Tabelle)
            $timeCheckStmt = $pdo->prepare("
                SELECT SUM(duration) as total_used 
                FROM session 
                WHERE child_id = :child_id AND DATE(start_time) = CURRENT_DATE AND status = 'completed'
            ");
            $timeCheckStmt->execute([':child_id' => $childId]);
            $totalUsedToday = intval($timeCheckStmt->fetch()['total_used'] ?? 0);

            if ($totalUsedToday > $dailyLimit) {
                $limitNotifStmt = $pdo->prepare("
                    INSERT INTO notification (parent_id, child_id, message, created_at) 
                    VALUES (:parent_id, :child_id, :message, CURRENT_TIMESTAMP)
                ");
                $limitNotifStmt->execute([
                    ':parent_id' => $parentId,
                    ':child_id'  => $childId,
                    ':message'   => $childName . " hat das Tageslimit von " . $dailyLimit . " Minuten überschritten!"
                ]);
            }

            echo json_encode([
                "status" => "success",
                "message" => "Sitzung erfolgreich beendet.",
                "duration_minutes" => $durationInMinutes,
                "total_used_today" => $totalUsedToday
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