<?php
// TIJDELIJK migratiescript — verwijder dit bestand na uitvoeren!
require_once __DIR__ . '/config/database.php';

header('Content-Type: text/plain; charset=UTF-8');

try {
    $db = getDb();

    $steps = [];

    // 1. map_x en map_y kolommen toevoegen (indien nog niet aanwezig)
    $cols = $db->query("SHOW COLUMNS FROM locations")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('map_x', $cols)) {
        $db->exec("ALTER TABLE `locations` ADD COLUMN `map_x` DECIMAL(6,3) DEFAULT NULL AFTER `lng`");
        $steps[] = "✓ Kolom map_x toegevoegd";
    } else {
        $steps[] = "- Kolom map_x bestond al";
    }
    if (!in_array('map_y', $cols)) {
        $db->exec("ALTER TABLE `locations` ADD COLUMN `map_y` DECIMAL(6,3) DEFAULT NULL AFTER `map_x`");
        $steps[] = "✓ Kolom map_y toegevoegd";
    } else {
        $steps[] = "- Kolom map_y bestond al";
    }

    // 2. Type-kolom verbreden naar VARCHAR
    $db->exec("ALTER TABLE `locations` MODIFY COLUMN `type` VARCHAR(30) NOT NULL DEFAULT 'stage'");
    $steps[] = "✓ Type-kolom gewijzigd naar VARCHAR(30)";

    // 3. Podia kaartposities
    $stagePositions = [
        'Ponton'   => [21.3, 62.8],
        'The Lake' => [53.9, 45.5],
        'The Club' => [69.3, 39.1],
        'Hanggar'  => [90.2, 17.1],
    ];
    foreach ($stagePositions as $name => [$x, $y]) {
        $stmt = $db->prepare("UPDATE `locations` SET map_x=?, map_y=? WHERE type='stage' AND name_nl=?");
        $stmt->execute([$x, $y, $name]);
        if ($stmt->rowCount() > 0) {
            $steps[] = "✓ Positie podium '$name' bijgewerkt";
        }
    }

    // 4. Faciliteitenmarkers invoegen (alleen als ze nog niet bestaan)
    $facilities = [
        ['Toilet 1',      'Toilet 1',       'wc',          93.1, 24.8, '#3B82F6'],
        ['Toilet 2',      'Toilet 2',       'wc',           7.8, 78.6, '#3B82F6'],
        ['Toilet 3',      'Toilet 3',       'wc',          48.9, 28.3, '#3B82F6'],
        ['Bar 1',         'Bar 1',          'bar',         81.0, 28.0, '#F97316'],
        ['Bar 2',         'Bar 2',          'bar',         72.0, 28.8, '#F97316'],
        ['Bar 3',         'Bar 3',          'bar',         51.4, 40.8, '#F97316'],
        ['Bar 4',         'Bar 4',          'bar',         11.8, 73.7, '#F97316'],
        ['Eten 1',        'Food 1',         'food',        83.1, 18.0, '#22C55E'],
        ['Eten 2',        'Food 2',         'food',        62.6, 33.1, '#22C55E'],
        ['Eten 3',        'Food 3',         'food',        39.2, 41.9, '#22C55E'],
        ['Eten 4',        'Food 4',         'food',        26.4, 67.1, '#22C55E'],
        ['EHBO 1',        'First Aid 1',    'ehbo',        12.1, 62.8, '#EF4444'],
        ['EHBO 2',        'First Aid 2',    'ehbo',        35.3, 44.0, '#EF4444'],
        ['Merchandise 1', 'Merchandise 1',  'merchandise', 17.4, 78.6, '#A855F7'],
        ['Merchandise 2', 'Merchandise 2',  'merchandise', 65.4, 39.6, '#A855F7'],
        ['Merchandise 3', 'Merchandise 3',  'merchandise', 31.7, 39.9, '#A855F7'],
        ['Locker 1',      'Locker 1',       'locker',      24.0, 82.8, '#EAB308'],
        ['Locker 2',      'Locker 2',       'locker',      30.4, 81.7, '#EAB308'],
    ];

    $check = $db->prepare("SELECT COUNT(*) FROM locations WHERE name_nl=? AND type=?");
    $insert = $db->prepare("INSERT INTO locations (name_nl, name_en, type, map_x, map_y, color) VALUES (?,?,?,?,?,?)");

    foreach ($facilities as [$nl, $en, $type, $x, $y, $color]) {
        $check->execute([$nl, $type]);
        if ((int)$check->fetchColumn() === 0) {
            $insert->execute([$nl, $en, $type, $x, $y, $color]);
            $steps[] = "✓ Faciliteit '$nl' ($type) ingevoegd";
        } else {
            $steps[] = "- Faciliteit '$nl' bestond al";
        }
    }

    echo "Migratie voltooid!\n\n";
    echo implode("\n", $steps);
    echo "\n\nVERWIJDER DIT BESTAND: api/migrate_map.php";

} catch (Exception $e) {
    http_response_code(500);
    echo "FOUT: " . $e->getMessage();
}
