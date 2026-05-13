<?php
require_once __DIR__ . '/config/database.php';

header('Content-Type: application/json; charset=UTF-8');

// Haal het programma op, optioneel gefilterd op dag of podium
try {
    $db = getDb();

    $conditions = [];
    $params     = [];

    if (isset($_GET['day'])) {
        $conditions[] = 's.day = ?';
        $params[]     = (int) $_GET['day'];
    }

    if (isset($_GET['stage_id'])) {
        $conditions[] = 's.stage_id = ?';
        $params[]     = (int) $_GET['stage_id'];
    }

    $where = $conditions ? 'WHERE ' . implode(' AND ', $conditions) : '';

    $sql = "
        SELECT
            s.id,
            a.name,
            l.id          AS stage_id,
            s.day,
            TIME_FORMAT(s.start_time, '%H:%i') AS start,
            TIME_FORMAT(s.end_time,   '%H:%i') AS end,
            a.genre
        FROM schedule s
        INNER JOIN artists   a ON a.id = s.artist_id
        INNER JOIN locations l ON l.id = s.stage_id
        {$where}
        ORDER BY s.day ASC, s.start_time ASC
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    $rows = $stmt->fetchAll();

    // Zet day naar int voor JS
    foreach ($rows as &$row) {
        $row['id']       = (int) $row['id'];
        $row['stage_id'] = (int) $row['stage_id'];
        $row['day']      = (int) $row['day'];
    }

    echo json_encode($rows, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
