<?php
require_once __DIR__ . '/config/database.php';

header('Content-Type: application/json; charset=UTF-8');

// Haal festivalinfoteksten op, taalfilter via ?lang=nl of ?lang=en
try {
    $db   = getDb();
    $lang = isset($_GET['lang']) && $_GET['lang'] === 'en' ? 'en' : 'nl';

    $stmt = $db->query("
        SELECT
            `key`,
            title_{$lang}   AS title,
            content_{$lang} AS body
        FROM festival_info
        ORDER BY sort_order ASC
    ");

    $rows = $stmt->fetchAll();

    echo json_encode($rows, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
