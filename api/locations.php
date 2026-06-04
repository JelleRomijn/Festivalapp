<?php
require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/database.php';

header('Content-Type: application/json; charset=UTF-8');

// Haal locaties op voor de kaart, optioneel gefilterd op type
// Types: stage, entrance, toilet, bar, food, medical, info
try {
    $db = getDb();

    $type   = isset($_GET['type']) ? $_GET['type'] : null;
    $params = [];

    $where = '';
    if ($type !== null) {
        $where    = 'WHERE type = ?';
        $params[] = $type;
    }

    $stmt = $db->prepare("
        SELECT id, name_nl, name_en, type, lat, lng, map_x, map_y, color
        FROM locations
        {$where}
        ORDER BY type ASC, name_nl ASC
    ");
    $stmt->execute($params);

    $rows = $stmt->fetchAll();

    foreach ($rows as &$row) {
        $row['id']    = (int) $row['id'];
        $row['lat']   = $row['lat'] !== null ? (float) $row['lat'] : null;
        $row['lng']   = $row['lng'] !== null ? (float) $row['lng'] : null;
        $row['map_x'] = $row['map_x'] !== null ? (float) $row['map_x'] : null;
        $row['map_y'] = $row['map_y'] !== null ? (float) $row['map_y'] : null;
        $row['name'] = [
            'nl' => $row['name_nl'],
            'en' => $row['name_en'],
        ];
        unset($row['name_nl'], $row['name_en']);
    }

    echo json_encode($rows, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
