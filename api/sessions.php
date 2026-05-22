<?php
// sessions.php
header('Content-Type: application/json');
require_once '../system/config.php';  // Lädt die funktionierende config.php

$method = $_SERVER['REQUEST_METHOD'];

function getJsonInput() {
    return json_decode(file_get_contents("php://input"), true) ?? [];
}

try {
    // Da die Box ein externes Hardware-Gerät ist, nutzt sie keine Browser-Session.
    // Sie identifiziert das Kind rein über die übermittelte rfid_id der Karte.
    if ($method === 'POST') {
        $data = getJsonInput();
        
        $action = trim($data['action'] ?? ''); // 'start' oder 'end'
        $rfidId = trim($data['rfid_id'] ?? ($data['nfc_id'] ?? '')); // fängt beides ab

        if (!$rfidId || !in_array($action, ['start', 'end'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Ungültige Parameter."]);
            exit;
        }

        // 1. Finde heraus, welches Kind zu dieser RFID-ID gehört (Spaltenname auf rfid_id korrigiert)
        $stmt = $pdo->prepare("SELECT id, name, parent_id, daily_limit FROM child WHERE rfid_id = :rfid_id");
        $stmt->execute([':rfid_id' => $rfidId]);
        $child = $stmt->fetch();

        if (!$child) {
            http_response_code(444); // Eigener Statuscode: Karte unbekannt
            echo json_encode(["status" => "error", "message" => "RFID-Karte nicht registriert."]);
            exit;
        }

        $childId    = $child['id'];
        $childName  = $child['name'];
        $parentId   = $child['parent_id'];
        $dailyLimit = intval($child['daily_limit']); // Ist in Sekunden hinterlegt!

        // Finde das zugehörige Gerät des Kindes, um den Status zu ändern und die ID zu loggen
        $deviceStmt = $pdo->prepare("SELECT id FROM device WHERE child_id = :child_id LIMIT 1");
        $deviceStmt->execute([':child_id' => $childId]);
        $device = $deviceStmt->fetch();
        $deviceId = $device ? $device['id'] : null;

        // ==========================================
        // SZENARIO A: SITZUNG STARTEN
        // ==========================================
        if ($action === 'start') {
            // Prüfen, ob für dieses Kind noch eine offene Session existiert (Sicherheitscheck)
            $checkSession = $pdo->prepare("SELECT id FROM session WHERE child_id = :child_id AND end_time IS NULL");
            $checkSession->execute([':child_id' => $childId]);
            
            if ($checkSession->fetch()) {
                echo json_encode(["status" => "success", "message" => "Session läuft bereits."]);
                exit;
            }

            // Neue Session eintragen. Inklusive device_id, allocated_time (Tageslimit) und status (1 = Aktiv)
            $stmt = $pdo->prepare("
                INSERT INTO session (child_id, device_id, start_time, end_time, duration, allocated_time, status) 
                VALUES (:child_id, :device_id, CURRENT_TIMESTAMP, NULL, NULL, :allocated_time, 1)
            ");
            $stmt->execute([
                ':child_id'       => $childId,
                ':device_id'      => $deviceId,
                ':allocated_time' => $dailyLimit
            ]);

            // Hardware-Live-Status ändern: Handy ist NICHT mehr in der Box
            if ($deviceId) {
                $updateDevice = $pdo->prepare("UPDATE device SET is_in_box = 0 WHERE id = :id");
                $updateDevice->execute([':id' => $deviceId]);
            }

            // AUTOMATISCHER EINTRAG 1: Mitteilung über das Entnehmen aus der Box
            $notifStmt = $pdo->prepare("
                INSERT INTO notifications (parent_id, child_id, message, is_read, created_at) 
                VALUES (:parent_id, :child_id, :message, 0, CURRENT_TIMESTAMP)
            ");
            $notifStmt->execute([
                ':parent_id' => $parentId,
                ':child_id'  => $childId,
                ':message'   => $childName . " hat das Gerät aus der Box genommen und eine Sitzung gestartet."
            ]);

            echo json_encode([
                "status" => "success", 
                "message" => "Sitzung erfolgreich gestartet.",
                "child_id" => $childId
            ]);
            exit;
        }

        // ==========================================
        // SZENARIO B: SITZUNG BEENDEN
        // ==========================================
        if ($action === 'end') {
            // Finde die aktuell offene Session des Kindes
            $sessionStmt = $pdo->prepare("SELECT id, start_time FROM session WHERE child_id = :child_id AND end_time IS NULL ORDER BY id DESC LIMIT 1");
            $sessionStmt->execute([':child_id' => $childId]);
            $openSession = $sessionStmt->fetch();

            if (!$openSession) {
                echo json_encode(["status" => "error", "message" => "Keine offene Sitzung für dieses Kind gefunden."]);
                exit;
            }

            $sessionId = $openSession['id'];
            $startTime = new DateTime($openSession['start_time']);
            $endTime   = new DateTime(); // Jetzt

            // Berechne die Spieldauer in SEKUNDEN
            $durationInSeconds = $endTime->getTimestamp() - $startTime->getTimestamp();
            
            // Sicherheits-Fallback: Falls es 0 Sekunden waren, auf mindestens 1 Sekunde setzen
            if ($durationInSeconds <= 0) {
                $durationInSeconds = 1;
            }

            // 1. Update der Session-Tabelle (Endzeit, Dauer setzen und Status auf 2 = sauber beendet)
            $updateSession = $pdo->prepare("
                UPDATE session 
                SET end_time = CURRENT_TIMESTAMP, duration = :duration, status = 2 
                WHERE id = :id
            ");
            $updateSession->execute([
                ':duration' => $durationInSeconds,
                ':id'       => $sessionId
            ]);

            // Hardware-Live-Status ändern: Handy ist WIEDER in der Box
            if ($deviceId) {
                $updateDevice = $pdo->prepare("UPDATE device SET is_in_box = 1 WHERE id = :id");
                $updateDevice->execute([':id' => $deviceId]);
            }

            // Umrechnung für verständliche Textnachrichten an die Eltern (Sekunden -> Minuten)
            $durationInMinutes = round($durationInSeconds / 60);

            // AUTOMATISCHER EINTRAG 2: Mitteilung über das Zurücklegen in die Box
            $notifStmt = $pdo->prepare("
                INSERT INTO notifications (parent_id, child_id, message, is_read, created_at) 
                VALUES (:parent_id, :child_id, :message, 0, CURRENT_TIMESTAMP)
            ");
            $notifStmt->execute([
                ':parent_id' => $parentId,
                ':child_id'  => $childId,
                ':message'   => $childName . " hat das Gerät wieder zurückgelegt (Dauer: " . $durationInMinutes . " Min.)."
            ]);

            // AUTOMATISCHER EINTRAG 3: Limit-Check für den heutigen Tag (rechnet alle 'duration'-Sekunden von heute zusammen)
            $timeCheckStmt = $pdo->prepare("
                SELECT SUM(duration) as total_used 
                FROM session 
                WHERE child_id = :child_id 
                  AND DATE(start_time) = CURRENT_DATE
                  AND duration IS NOT NULL
            ");
            $timeCheckStmt->execute([':child_id' => $childId]);
            $timeResult = $timeCheckStmt->fetch();
            $totalUsedTodaySeconds = intval($timeResult['total_used'] ?? 0);

            // Prüfen, ob die verbrauchte Zeit das eingestellte Limit übersteigt
            if ($totalUsedTodaySeconds > $dailyLimit) {
                $limitMinutes = round($dailyLimit / 60);
                
                // Status der Session auf 3 setzen (Limit überschritten)
                $updateSessionStatus = $pdo->prepare("UPDATE session SET status = 3 WHERE id = :id");
                $updateSessionStatus->execute([':id' => $sessionId]);

                $limitNotifStmt = $pdo->prepare("
                    INSERT INTO notifications (parent_id, child_id, message, is_read, created_at) 
                    VALUES (:parent_id, :child_id, :message, 0, CURRENT_TIMESTAMP)
                ");
                $limitNotifStmt->execute([
                    ':parent_id' => $parentId,
                    ':child_id'  => $childId,
                    ':message'   => $childName . " hat das Tageslimit von " . $limitMinutes . " Minuten überschritten!"
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

    // Falls fälschlicherweise GET o.ä. aufgerufen wurde
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Methode nicht erlaubt."]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Serverfehler bei der Zeiterfassung: " . $e->getMessage()
    ]);
}
?>
