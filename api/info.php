<?php
require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/database.php';

header('Content-Type: application/json; charset=UTF-8');

try {
    $db   = getDb();
    $lang = isset($_GET['lang']) && $_GET['lang'] === 'en' ? 'en' : 'nl';

    // Haal alle hoofdsecties op
    $stmt = $db->query("
        SELECT
            id,
            `key`,
            title_{$lang}   AS title,
            content_{$lang} AS body,
            icon,
            accent
        FROM festival_info
        ORDER BY sort_order ASC
    ");
    $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Haal alle subsecties op en koppel ze per section
    $itemStmt = $db->query("
        SELECT
            info_id,
            subtitle_{$lang} AS subtitle,
            body_{$lang}     AS bodyw
        FROM festival_info_items
        ORDER BY info_id ASC, sort_order ASC
    ");
    $allItems = $itemStmt->fetchAll(PDO::FETCH_ASSOC);

    // Groepeer items per info_id
    $itemsBySection = [];
    foreach ($allItems as $item) {
        $itemsBySection[$item['info_id']][] = [
            'subtitle' => $item['subtitle'],
            'body'     => $item['body'],
        ];
    }

    // Bouw eindresultaat op
    $result = [];
    foreach ($sections as $section) {
        $row = [
            'key'    => $section['key'],
            'title'  => $section['title'],
            'icon'   => $section['icon'],
            'accent' => $section['accent'],
        ];
        if (!empty($section['body'])) {
            $row['body'] = $section['body'];
        }
        if (!empty($itemsBySection[$section['id']])) {
            $row['items'] = $itemsBySection[$section['id']];
        }
        $result[] = $row;
    }

    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
