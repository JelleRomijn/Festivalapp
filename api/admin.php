<?php
require_once __DIR__ . '/config/database.php';

header('Content-Type: application/json; charset=UTF-8');

// Verwerk OPTIONS preflight handmatig (voor PUT/DELETE)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method   = $_SERVER['REQUEST_METHOD'];
$resource = $_GET['resource'] ?? '';
$id       = isset($_GET['id']) ? (int) $_GET['id'] : 0;
$input    = json_decode(file_get_contents('php://input'), true) ?? [];

try {
    switch ($resource) {
        case 'artists':
            handleArtists($method, $id, $input);
            break;
        case 'schedule':
            handleSchedule($method, $id, $input);
            break;
        case 'locations':
            handleLocations();
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Onbekende resource']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database fout']);
}

// -------------------------------------------------------
// Artiesten
// -------------------------------------------------------
function handleArtists(string $method, int $id, array $input): void
{
    $db = getDb();

    switch ($method) {
        case 'GET':
            $stmt = $db->query('
                SELECT id, name, category, genre, description_nl, description_en, image_url
                FROM artists
                ORDER BY category ASC, name ASC
            ');
            $rows = $stmt->fetchAll();
            foreach ($rows as &$r) {
                $r['id'] = (int) $r['id'];
            }
            echo json_encode($rows, JSON_UNESCAPED_UNICODE);
            break;

        case 'POST':
            $stmt = $db->prepare('
                INSERT INTO artists (name, category, genre, description_nl, description_en, image_url)
                VALUES (:name, :category, :genre, :desc_nl, :desc_en, :img)
            ');
            $stmt->execute([
                'name'     => trim($input['name'] ?? ''),
                'category' => $input['category'] ?? 'headliner',
                'genre'    => trim($input['genre'] ?? ''),
                'desc_nl'  => trim($input['description_nl'] ?? ''),
                'desc_en'  => trim($input['description_en'] ?? ''),
                'img'      => $input['image_url'] ?: null,
            ]);
            echo json_encode(['ok' => true, 'id' => (int) $db->lastInsertId()]);
            break;

        case 'PUT':
            if (!$id) { http_response_code(400); echo json_encode(['error' => 'Geen id']); return; }
            $stmt = $db->prepare('
                UPDATE artists
                SET name=:name, category=:category, genre=:genre,
                    description_nl=:desc_nl, description_en=:desc_en, image_url=:img
                WHERE id=:id
            ');
            $stmt->execute([
                'name'     => trim($input['name'] ?? ''),
                'category' => $input['category'] ?? 'headliner',
                'genre'    => trim($input['genre'] ?? ''),
                'desc_nl'  => trim($input['description_nl'] ?? ''),
                'desc_en'  => trim($input['description_en'] ?? ''),
                'img'      => $input['image_url'] ?: null,
                'id'       => $id,
            ]);
            echo json_encode(['ok' => true]);
            break;

        case 'DELETE':
            if (!$id) { http_response_code(400); echo json_encode(['error' => 'Geen id']); return; }
            $db->prepare('DELETE FROM artists WHERE id=?')->execute([$id]);
            echo json_encode(['ok' => true]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Methode niet toegestaan']);
    }
}

// -------------------------------------------------------
// Programma
// -------------------------------------------------------
function handleSchedule(string $method, int $id, array $input): void
{
    $db = getDb();

    switch ($method) {
        case 'GET':
            $stmt = $db->query('
                SELECT s.id, s.day, s.artist_id, s.stage_id,
                       TIME_FORMAT(s.start_time, "%H:%i") AS start_time,
                       TIME_FORMAT(s.end_time,   "%H:%i") AS end_time,
                       a.name     AS artist_name,
                       a.category AS artist_category,
                       l.name_nl  AS stage_name
                FROM schedule s
                JOIN artists   a ON a.id = s.artist_id
                JOIN locations l ON l.id = s.stage_id
                ORDER BY s.day ASC, l.name_nl ASC, s.start_time ASC
            ');
            $rows = $stmt->fetchAll();
            foreach ($rows as &$r) {
                $r['id']        = (int) $r['id'];
                $r['day']       = (int) $r['day'];
                $r['artist_id'] = (int) $r['artist_id'];
                $r['stage_id']  = (int) $r['stage_id'];
            }
            echo json_encode($rows, JSON_UNESCAPED_UNICODE);
            break;

        case 'POST':
            $stmt = $db->prepare('
                INSERT INTO schedule (artist_id, stage_id, day, start_time, end_time)
                VALUES (:artist, :stage, :day, :start, :end)
            ');
            $stmt->execute([
                'artist' => (int) ($input['artist_id'] ?? 0),
                'stage'  => (int) ($input['stage_id']  ?? 0),
                'day'    => (int) ($input['day']        ?? 1),
                'start'  => $input['start_time'] ?? '10:00',
                'end'    => $input['end_time']   ?? '11:00',
            ]);
            echo json_encode(['ok' => true, 'id' => (int) $db->lastInsertId()]);
            break;

        case 'PUT':
            if (!$id) { http_response_code(400); echo json_encode(['error' => 'Geen id']); return; }
            $stmt = $db->prepare('
                UPDATE schedule
                SET artist_id=:artist, stage_id=:stage, day=:day,
                    start_time=:start, end_time=:end
                WHERE id=:id
            ');
            $stmt->execute([
                'artist' => (int) ($input['artist_id'] ?? 0),
                'stage'  => (int) ($input['stage_id']  ?? 0),
                'day'    => (int) ($input['day']        ?? 1),
                'start'  => $input['start_time'] ?? '10:00',
                'end'    => $input['end_time']   ?? '11:00',
                'id'     => $id,
            ]);
            echo json_encode(['ok' => true]);
            break;

        case 'DELETE':
            if (!$id) { http_response_code(400); echo json_encode(['error' => 'Geen id']); return; }
            $db->prepare('DELETE FROM schedule WHERE id=?')->execute([$id]);
            echo json_encode(['ok' => true]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Methode niet toegestaan']);
    }
}

// -------------------------------------------------------
// Locaties (alleen podia, read-only voor admin)
// -------------------------------------------------------
function handleLocations(): void
{
    $db = getDb();
    $stmt = $db->query("
        SELECT id, name_nl, name_en, type
        FROM locations
        WHERE type = 'stage'
        ORDER BY name_nl ASC
    ");
    $rows = $stmt->fetchAll();
    foreach ($rows as &$r) {
        $r['id'] = (int) $r['id'];
    }
    echo json_encode($rows, JSON_UNESCAPED_UNICODE);
}
