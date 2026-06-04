-- =====================================================
-- Migratie: kaartcoördinaten (x/y percentages) toevoegen
-- =====================================================

-- 1. Kolommen toevoegen voor visuele positie op de kaart (percentage van breedte/hoogte)
ALTER TABLE `locations`
  ADD COLUMN `map_x` DECIMAL(6,3) DEFAULT NULL AFTER `lng`,
  ADD COLUMN `map_y` DECIMAL(6,3) DEFAULT NULL AFTER `map_x`;

-- 2. Type uitbreiden zodat faciliteitentypen passen
ALTER TABLE `locations`
  MODIFY COLUMN `type` VARCHAR(30) NOT NULL DEFAULT 'stage';

-- 3. Bestaande podia krijgen hun kaartposities
UPDATE `locations` SET map_x=21.3, map_y=62.8 WHERE type='stage' AND name_nl='Ponton';
UPDATE `locations` SET map_x=53.9, map_y=45.5 WHERE type='stage' AND name_nl='The Lake';
UPDATE `locations` SET map_x=69.3, map_y=39.1 WHERE type='stage' AND name_nl='The Club';
UPDATE `locations` SET map_x=90.2, map_y=17.1 WHERE type='stage' AND name_nl='Hanggar';

-- 4. Faciliteitenmarkers invoegen
INSERT INTO `locations` (name_nl, name_en, type, map_x, map_y, color) VALUES
  -- Toiletten
  ('Toilet 1',      'Toilet 1',       'wc',          93.1, 24.8, '#3B82F6'),
  ('Toilet 2',      'Toilet 2',       'wc',           7.8, 78.6, '#3B82F6'),
  ('Toilet 3',      'Toilet 3',       'wc',          48.9, 28.3, '#3B82F6'),
  -- Bars
  ('Bar 1',         'Bar 1',          'bar',         81.0, 28.0, '#F97316'),
  ('Bar 2',         'Bar 2',          'bar',         72.0, 28.8, '#F97316'),
  ('Bar 3',         'Bar 3',          'bar',         51.4, 40.8, '#F97316'),
  ('Bar 4',         'Bar 4',          'bar',         11.8, 73.7, '#F97316'),
  -- Eten
  ('Eten 1',        'Food 1',         'food',        83.1, 18.0, '#22C55E'),
  ('Eten 2',        'Food 2',         'food',        62.6, 33.1, '#22C55E'),
  ('Eten 3',        'Food 3',         'food',        39.2, 41.9, '#22C55E'),
  ('Eten 4',        'Food 4',         'food',        26.4, 67.1, '#22C55E'),
  -- EHBO
  ('EHBO 1',        'First Aid 1',    'ehbo',        12.1, 62.8, '#EF4444'),
  ('EHBO 2',        'First Aid 2',    'ehbo',        35.3, 44.0, '#EF4444'),
  -- Merchandise
  ('Merchandise 1', 'Merchandise 1',  'merchandise', 17.4, 78.6, '#A855F7'),
  ('Merchandise 2', 'Merchandise 2',  'merchandise', 65.4, 39.6, '#A855F7'),
  ('Merchandise 3', 'Merchandise 3',  'merchandise', 31.7, 39.9, '#A855F7'),
  -- Lockers
  ('Locker 1',      'Locker 1',       'locker',      24.0, 82.8, '#EAB308'),
  ('Locker 2',      'Locker 2',       'locker',      30.4, 81.7, '#EAB308');
