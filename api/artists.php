<?php
require_once __DIR__ . '/config/database.php';

header('Content-Type: application/json; charset=UTF-8');

// Haal alle artiesten op, optioneel gefilterd op dag
try {
    $db = getDb();

    $day = isset($_GET['day']) ? (int) $_GET['day'] : null;

    if ($day !== null) {
        $stmt = $db->prepare('
            SELECT a.id, a.name, a.genre, a.description_nl, a.description_en, a.image_url, a.bio_nl, a.bio_en, a.youtube_url
            FROM artists a
            INNER JOIN schedule s ON s.artist_id = a.id
            WHERE s.day = ?
            GROUP BY a.id
            ORDER BY a.name ASC
        ');
        $stmt->execute([$day]);
    } else {
        $stmt = $db->query('SELECT id, name, genre, description_nl, description_en, image_url, bio_nl, bio_en, youtube_url FROM artists ORDER BY name ASC');
    }

    $artists = $stmt->fetchAll();

    echo json_encode($artists, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
