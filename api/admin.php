<?php
require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/database.php';

header('Content-Type: application/json; charset=UTF-8');

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
            handleLocations($method, $id, $input);
            break;
        case 'festival_info':
            handleInfo($method, $id, $input);
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
                SELECT id, name, category, genre, description_nl, description_en, image_url, bio_nl, bio_en, youtube_url
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
                INSERT INTO artists (name, category, genre, description_nl, description_en, image_url, bio_nl, bio_en, youtube_url)
                VALUES (:name, :category, :genre, :desc_nl, :desc_en, :img, :bio_nl, :bio_en, :yt)
            ');
            $stmt->execute([
                'name'     => trim($input['name'] ?? ''),
                'category' => $input['category'] ?? 'headliner',
                'genre'    => trim($input['genre'] ?? ''),
                'desc_nl'  => trim($input['description_nl'] ?? ''),
                'desc_en'  => trim($input['description_en'] ?? ''),
                'img'      => $input['image_url'] ?: null,
                'bio_nl'   => trim($input['bio_nl'] ?? '') ?: null,
                'bio_en'   => trim($input['bio_en'] ?? '') ?: null,
                'yt'       => trim($input['youtube_url'] ?? '') ?: null,
            ]);
            echo json_encode(['ok' => true, 'id' => (int) $db->lastInsertId()]);
            break;

        case 'PUT':
            if (!$id) { http_response_code(400); echo json_encode(['error' => 'Geen id']); return; }
            $stmt = $db->prepare('
                UPDATE artists
                SET name=:name, category=:category, genre=:genre,
                    description_nl=:desc_nl, description_en=:desc_en, image_url=:img,
                    bio_nl=:bio_nl, bio_en=:bio_en, youtube_url=:yt
                WHERE id=:id
            ');
            $stmt->execute([
                'name'     => trim($input['name'] ?? ''),
                'category' => $input['category'] ?? 'headliner',
                'genre'    => trim($input['genre'] ?? ''),
                'desc_nl'  => trim($input['description_nl'] ?? ''),
                'desc_en'  => trim($input['description_en'] ?? ''),
                'img'      => $input['image_url'] ?: null,
                'bio_nl'   => trim($input['bio_nl'] ?? '') ?: null,
                'bio_en'   => trim($input['bio_en'] ?? '') ?: null,
                'yt'       => trim($input['youtube_url'] ?? '') ?: null,
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
// Festival info teksten
// -------------------------------------------------------
function handleInfo(string $method, int $id, array $input): void
{
    $db = getDb();
    switch ($method) {
        case 'GET':
            $stmt = $db->query('
                SELECT id, `key`, title_nl, title_en, content_nl, content_en, sort_order
                FROM festival_info
                ORDER BY sort_order ASC
            ');
            $rows = $stmt->fetchAll();
            foreach ($rows as &$r) {
                $r['id']         = (int) $r['id'];
                $r['sort_order'] = (int) $r['sort_order'];
            }
            echo json_encode($rows, JSON_UNESCAPED_UNICODE);
            break;

        case 'PUT':
            if (!$id) { http_response_code(400); echo json_encode(['error' => 'Geen id']); return; }
            $stmt = $db->prepare('
                UPDATE festival_info
                SET title_nl=:tnl, title_en=:ten, content_nl=:cnl, content_en=:cen
                WHERE id=:id
            ');
            $stmt->execute([
                'tnl' => trim($input['title_nl']   ?? ''),
                'ten' => trim($input['title_en']   ?? ''),
                'cnl' => trim($input['content_nl'] ?? ''),
                'cen' => trim($input['content_en'] ?? ''),
                'id'  => $id,
            ]);
            echo json_encode(['ok' => true]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Methode niet toegestaan']);
    }
}

// -------------------------------------------------------
// Locaties (podia en faciliteiten, volledig CRUD)
// -------------------------------------------------------
function handleLocations(string $method, int $id, array $input): void
{
    $db = getDb();

    switch ($method) {
        case 'GET':
            $typeFilter = $_GET['type'] ?? null;
            if ($typeFilter === 'stage') {
                // Backward-compat: alleen podia voor programma-tab
                $stmt = $db->query("
                    SELECT id, name_nl, name_en, type, map_x, map_y, color
                    FROM locations
                    WHERE type = 'stage'
                    ORDER BY name_nl ASC
                ");
            } else {
                $stmt = $db->query("
                    SELECT id, name_nl, name_en, type, map_x, map_y, color
                    FROM locations
                    ORDER BY type ASC, name_nl ASC
                ");
            }
            $rows = $stmt->fetchAll();
            foreach ($rows as &$r) {
                $r['id']    = (int) $r['id'];
                $r['map_x'] = $r['map_x'] !== null ? (float) $r['map_x'] : null;
                $r['map_y'] = $r['map_y'] !== null ? (float) $r['map_y'] : null;
            }
            echo json_encode($rows, JSON_UNESCAPED_UNICODE);
            break;

        case 'POST':
            $stmt = $db->prepare('
                INSERT INTO locations (name_nl, name_en, type, map_x, map_y, color)
                VALUES (:name_nl, :name_en, :type, :map_x, :map_y, :color)
            ');
            $stmt->execute([
                'name_nl' => trim($input['name_nl'] ?? ''),
                'name_en' => trim($input['name_en'] ?? ''),
                'type'    => $input['type'] ?? 'wc',
                'map_x'   => isset($input['map_x']) ? (float) $input['map_x'] : null,
                'map_y'   => isset($input['map_y']) ? (float) $input['map_y'] : null,
                'color'   => $input['color'] ?? '#3B82F6',
            ]);
            echo json_encode(['ok' => true, 'id' => (int) $db->lastInsertId()]);
            break;

        case 'PUT':
            if (!$id) { http_response_code(400); echo json_encode(['error' => 'Geen id']); return; }
            $stmt = $db->prepare('
                UPDATE locations
                SET name_nl=:name_nl, name_en=:name_en, type=:type,
                    map_x=:map_x, map_y=:map_y, color=:color
                WHERE id=:id
            ');
            $stmt->execute([
                'name_nl' => trim($input['name_nl'] ?? ''),
                'name_en' => trim($input['name_en'] ?? ''),
                'type'    => $input['type'] ?? 'wc',
                'map_x'   => isset($input['map_x']) ? (float) $input['map_x'] : null,
                'map_y'   => isset($input['map_y']) ? (float) $input['map_y'] : null,
                'color'   => $input['color'] ?? '#3B82F6',
                'id'      => $id,
            ]);
            echo json_encode(['ok' => true]);
            break;

        case 'DELETE':
            if (!$id) { http_response_code(400); echo json_encode(['error' => 'Geen id']); return; }
            // Podia mogen niet verwijderd worden als ze in het programma zitten
            $check = $db->prepare('SELECT COUNT(*) FROM schedule WHERE stage_id=?');
            $check->execute([$id]);
            if ((int) $check->fetchColumn() > 0) {
                http_response_code(409);
                echo json_encode(['error' => 'Podium heeft nog programmaslots']);
                return;
            }
            $db->prepare('DELETE FROM locations WHERE id=?')->execute([$id]);
            echo json_encode(['ok' => true]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Methode niet toegestaan']);
    }
}
