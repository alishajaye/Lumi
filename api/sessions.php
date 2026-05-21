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
    // Sie identifiziert das Kind rein über die übermittelte nfc_id.
    if ($method === 'POST') {
        $data = getJsonInput();
        
        $action = trim($data['action'] ?? ''); // 'start' oder 'end'
        $nfcId  = trim($data['nfc_id'] ?? '');

        if (!$nfcId || !in_array($action, ['start', 'end'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Ungültige Parameter."]);
            exit;
        }

        // 1. Finde heraus, welches Kind zu dieser NFC-ID gehört 
        // ERWEITERT: Holt direkt den Namen, das Elternteil und das Tageslimit mit ab
        $stmt = $pdo->prepare("SELECT id, name, parent_id, daily_limit FROM child WHERE nfc_id = :nfc_id");
        $stmt->execute([':nfc_id' => $nfcId]);
        $child = $stmt->fetch();

        if (!$child) {
            http_response_code(444); // Eigener Statuscode: Karte unbekannt
            echo json_encode(["status" => "error", "message" => "NFC-Karte nicht registriert."]);
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
            // Prüfen, ob für dieses Kind noch eine offene Session existiert (Sicherheitscheck)
            $checkSession = $pdo->prepare("SELECT id FROM session WHERE child_id = :child_id AND end_time IS NULL");
            $checkSession->execute([':child_id' => $childId]);
            
            if ($checkSession->fetch()) {
                echo json_encode(["status" => "success", "message" => "Session läuft bereits."]);
                exit;
            }

            // Neue Session eintragen. start_time wird automatisch über current_timestamp() befüllt!
            $stmt = $pdo->prepare("INSERT INTO session (child_id, start_time, end_time, duration) VALUES (:child_id, CURRENT_TIMESTAMP, NULL, NULL)");
            $stmt->execute([':child_id' => $childId]);

            // AUTOMATISCHER EINTRAG 1: Mitteilung über das Entnehmen aus der Box
            $notifStmt = $pdo->prepare("
                INSERT INTO notifications (parent_id, child_id, message, created_at) 
                VALUES (:parent_id, :child_id, :message, CURRENT_TIMESTAMP)
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

            // Berechne die Spieldauer in Minuten
            $interval = $startTime->diff($endTime);
            $durationInMinutes = ($interval->days * 24 * 60) + ($interval->h * 60) + $interval->i;
            
            // Falls es weniger als eine Minute war, runden wir für den Testlauf auf mindestens 1 Minute auf
            if ($durationInMinutes === 0) {
                $durationInMinutes = 1;
            }

            // 1. Update der Session-Tabelle (Endzeit & Dauer setzen)
            $updateSession = $pdo->prepare("UPDATE session SET end_time = CURRENT_TIMESTAMP, duration = :duration WHERE id = :id");
            $updateSession->execute([
                ':duration' => $durationInMinutes,
                ':id'       => $sessionId
            ]);

            // 2. Buchung im Zeit-Sparbuch (time_accounts) eintragen
            // Wir buchen die verbrauchte Zeit als negativen Betrag ab ('type' = 'abzug')
            $insertAccount = $pdo->prepare("
                INSERT INTO time_accounts (child_id, amount, type, session_id, timestamp) 
                VALUES (:child_id, :amount, 'abzug', :session_id, CURRENT_TIMESTAMP)
            ");
            $insertAccount->execute([
                ':child_id'   => $childId,
                ':amount'     => -$durationInMinutes, // Negativer Wert, da Zeit verbraucht wurde
                ':session_id' => $sessionId
            ]);

            // AUTOMATISCHER EINTRAG 2: Mitteilung über das Zurücklegen in die Box
            $notifStmt = $pdo->prepare("
                INSERT INTO notifications (parent_id, child_id, message, created_at) 
                VALUES (:parent_id, :child_id, :message, CURRENT_TIMESTAMP)
            ");
            $notifStmt->execute([
                ':parent_id' => $parentId,
                ':child_id'  => $childId,
                ':message'   => $childName . " hat das Gerät wieder zurückgelegt (Dauer: " . $durationInMinutes . " Min.)."
            ]);

            // AUTOMATISCHER EINTRAG 3: Limit-Check für den heutigen Tag
            // Berechnet die absolute Summe aller verbrauchten Zeiten ('abzug') am heutigen Kalendertag
            $timeCheckStmt = $pdo->prepare("
                SELECT SUM(ABS(amount)) as total_used 
                FROM time_accounts 
                WHERE child_id = :child_id 
                  AND type = 'abzug' 
                  AND DATE(timestamp) = CURRENT_DATE
            ");
            $timeCheckStmt->execute([':child_id' => $childId]);
            $timeResult = $timeCheckStmt->fetch();
            $totalUsedToday = intval($timeResult['total_used'] ?? 0);

            // Prüfen, ob die verbrauchte Zeit das eingestellte Limit übersteigt
            if ($totalUsedToday > $dailyLimit) {
                $limitNotifStmt = $pdo->prepare("
                    INSERT INTO notifications (parent_id, child_id, message, created_at) 
                    VALUES (:parent_id, :child_id, :message, CURRENT_TIMESTAMP)
                ");
                $limitNotifStmt->execute([
                    ':parent_id' => $parentId,
                    ':child_id'  => $childId,
                    // Exakter Textwunsch: "X hat das Tageslimit von Y Minuten überschritten!"
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
