-- =====================================================
-- HartjeU Festival — MySQL database schema
-- Versie: 1.0 | Aangemaakt: april 2026
-- =====================================================

CREATE DATABASE IF NOT EXISTS `hartjeu_festival`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `hartjeu_festival`;

-- -----------------------------------------------------
-- Artiesten
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `artists` (
  `id`             INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `name`           VARCHAR(150)    NOT NULL,
  `category`       ENUM('headliner','talent','dj','activity') NOT NULL DEFAULT 'headliner',
  `genre`          VARCHAR(80)     NOT NULL DEFAULT '',
  `description_nl` TEXT,
  `description_en` TEXT,
  `image_url`      VARCHAR(300)    DEFAULT NULL,
  `bio_nl`         TEXT            DEFAULT NULL,
  `bio_en`         TEXT            DEFAULT NULL,
  `youtube_url`    VARCHAR(300)    DEFAULT NULL,
  `created_at`     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_artists_name` (`name`),
  KEY `idx_artists_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Locaties (podia, ingangen, faciliteiten)
-- type: stage | entrance | toilet | bar | food | medical | info
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `locations` (
  `id`       INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `name_nl`  VARCHAR(150)  NOT NULL,
  `name_en`  VARCHAR(150)  NOT NULL,
  `type`     ENUM('stage','entrance','toilet','bar','food','medical','info') NOT NULL DEFAULT 'stage',
  `lat`      DECIMAL(10,7) DEFAULT NULL,
  `lng`      DECIMAL(10,7) DEFAULT NULL,
  `color`    VARCHAR(7)    DEFAULT '#E85D4A',  -- hex kleurcode voor kaart/schema
  PRIMARY KEY (`id`),
  KEY `idx_locations_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Programma (koppelt artiest aan podium + tijdslot)
-- day: 1 = 15 aug 2026 | 2 = 16 aug 2026
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schedule` (
  `id`         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `artist_id`  INT UNSIGNED  NOT NULL,
  `stage_id`   INT UNSIGNED  NOT NULL,
  `day`        TINYINT(1)    NOT NULL DEFAULT 1,
  `start_time` TIME          NOT NULL,
  `end_time`   TIME          NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_schedule_day`      (`day`),
  KEY `idx_schedule_stage`    (`stage_id`),
  KEY `idx_schedule_artist`   (`artist_id`),
  CONSTRAINT `fk_schedule_artist`  FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`)  ON DELETE CASCADE,
  CONSTRAINT `fk_schedule_stage`   FOREIGN KEY (`stage_id`)  REFERENCES `locations`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Artiesten bio's en YouTube links (headliners)
-- -----------------------------------------------------
UPDATE `artists` SET
  `bio_nl`      = 'Vijfvoudig "World\'s No. 1 DJ" en trance-icoon. Armin levert euforische, energieke sets die headliner zijn geweest op Tomorrowland en Ultra. Zijn opzwepende melodieën en onberispelijke mixing houden het publiek urenlang aan het dansen.',
  `bio_en`      = 'Five-time "World\'s No. 1 DJ" and trance icon, Armin delivers euphoric, high-energy sets that have headlined festivals from Tomorrowland to Ultra. His uplifting melodies and impeccable mixing keep crowds dancing for hours.',
  `youtube_url` = 'https://www.youtube.com/embed/TxvpctgU_s8'
WHERE `name` = 'Armin van Buuren';

UPDATE `artists` SET
  `bio_nl`      = 'Als tiener brak hij door met "Animals". Martin Garrix is een van de grootste namen in de EDM-wereld. Zijn anthemische big-room tracks en stadiongrote drops maken hem een festivalfavoriet door heel Europa.',
  `bio_en`      = 'Broke through as a teenager with "Animals," Martin Garrix has become one of the biggest names in EDM. His anthemic big-room tracks and stadium-sized drops make him a festival favorite across Europe.',
  `youtube_url` = 'https://www.youtube.com/embed/Zv1QV6lrc_Y'
WHERE `name` = 'Martin Garrix';

UPDATE `artists` SET
  `bio_nl`      = 'Rotterdamse indie-rockband bekend om stijgende refreinen en gedreven gitaarriffs. Hits als "Streets" en "Riddles" tonen hun talent voor arena-klare hooks en emotioneel geladen lyriek.',
  `bio_en`      = 'Rotterdam-born indie rock quintet known for soaring choruses and driving guitar riffs. Hits like "Streets" and "Riddles" showcase their knack for arena-ready hooks and emotionally charged lyricism.',
  `youtube_url` = 'https://www.youtube.com/embed/IH77eOyV95o'
WHERE `name` = 'Kensington';

UPDATE `artists` SET
  `bio_nl`      = 'Symfonisch metalpioniers met Sharon den Adel als frontvrouw. Hun cinematische geluid en operatische vocalen (denk aan "Ice Queen" en "Mother Earth") resulteren in dramatische, visueel indrukwekkende festivaloptredens.',
  `bio_en`      = 'Symphonic metal pioneers fronted by Sharon den Adel. Their cinematic soundscapes and operatic vocals (think "Ice Queen," "Mother Earth") translate into dramatic, visually stunning festival performances.',
  `youtube_url` = 'https://www.youtube.com/embed/iQVei5C2N4E'
WHERE `name` = 'Within Temptation';

UPDATE `artists` SET
  `bio_nl`      = 'Experimentele rockband uit Nijmegen die funky grooves combineert met hoekig gitaarwerk en theatrale podiumkunst. Tracks als "Witch Doctor" en "Down Town" laten hun genre-overschrijdende aanpak en aanstekelijke energie zien.',
  `bio_en`      = 'Experimental rock outfit from Nijmegen, blending funky grooves with angular guitar work and theatrical stagecraft. Tracks like "Witch Doctor" and "Down Town" highlight their genre-bending approach and infectious energy.',
  `youtube_url` = 'https://www.youtube.com/embed/0ttGgIQpAUc'
WHERE `name` = 'De Staat';

UPDATE `artists` SET
  `bio_nl`      = 'Een viertal uit Haarlem dat funk, pop, rock en hiphop mixt. Hun energieke, genreloze geluid op nummers als "Amigo" en "In Your Arms" zorgt voor uitbundige, dansbare liveshows.',
  `bio_en`      = 'A four-piece from Haarlem mixing funk, pop, rock and hip-hop. Their upbeat, genre-fluid sound on songs like "Amigo" and "In Your Arms" makes for joyous, dance-floor-friendly live shows.',
  `youtube_url` = 'https://www.youtube.com/embed/l3jRIr44lss'
WHERE `name` = 'Chef\'Special';

UPDATE `artists` SET
  `bio_nl`      = 'Hard rockend viertal uit Utrecht met riff-gedreven anthems en dynamische vocalen. Met een liverepututie voor rauwe intensiteit zijn ze geknipt voor late-night mainstages.',
  `bio_en`      = 'Utrecht\'s hard-hitting rock four-piece, delivering riff-driven anthems and dynamic vocals. With a live reputation for raw intensity, they\'re tailor-made for late-night main stages.',
  `youtube_url` = 'https://www.youtube.com/embed/EvLpaCSnc4k'
WHERE `name` = 'Navarone';

UPDATE `artists` SET
  `bio_nl`      = 'Folk-pop singer-songwriter wiens intieme stem en akoestische arrangementen (met name op "Home") hem platina-verkopen en uitverkochte shows hebben opgeleverd. Zijn oprechte storytelling raakt diep op akoestische festivalpodia.',
  `bio_en`      = 'Folk-pop singer-songwriter whose intimate voice and acoustic arrangements (notably on "Home") have earned him platinum sales and sell-out shows. His heartfelt storytelling connects deeply on festival acoustic stages.',
  `youtube_url` = 'https://www.youtube.com/embed/FZEuqzW16Nw'
WHERE `name` = 'Dotan';

UPDATE `artists` SET
  `bio_nl`      = 'Indie-popartieste die atmosferische, elektronisch getinte songs maakt. Haar hypnotische vocalen en weelderige productie (te horen op "Ongeveer") creëren een dromerige sfeer, perfect voor schemersessies op festivals.',
  `bio_en`      = 'Indie-pop artist crafting atmospheric, electronic-tinged songs. Her hypnotic vocals and lush production (as heard on "Ongeveer") create a dreamlike vibe perfect for twilight festival slots.',
  `youtube_url` = 'https://www.youtube.com/embed/6IlLJNmLDMg'
WHERE `name` = 'Eefje de Visser';

UPDATE `artists` SET
  `bio_nl`      = 'Debuterend poptalent Froukje Veenstra combineert oprechte teksten met aanstekelijke, synth-gedreven hooks. Sinds haar debuut in 2021 is ze uitgegroeid tot stem van haar generatie — ideaal voor mid-day festivalpodia.',
  `bio_en`      = 'Breakthrough pop singer Froukje Veenstra combines candid lyrics with catchy, synth-driven hooks. Since her 2021 debut, she\'s become a voice of her generation — ideal for mid-day festival stages.',
  `youtube_url` = 'https://www.youtube.com/embed/g4PlReX9e-E'
WHERE `name` = 'Froukje';

UPDATE `artists` SET
  `bio_nl`      = 'Erik de Jong treedt op onder de naam Spinvis en maakt poëtische, collage-achtige songs die gesproken woord, lo-fi elektronica en weemoedige pop combineren. Sinds zijn debuutalbum uit 2002 — opgenomen op zijn zolder — is hij een vaste waarde in de Nederlandse indie, geroemd om verhalen die tegelijk intiem en surreëel aanvoelen.',
  `bio_en`      = 'Erik de Jong performs under the moniker Spinvis, crafting poetic, collage-like songs that blend spoken-word snippets, lo-fi electronics and wistful pop. Since his debut album in 2002—recorded in his attic—he\'s become a fixture of Dutch indie, renowned for narratives that feel both intimate and surreal.',
  `youtube_url` = 'https://www.youtube.com/embed/F3ZTrGWSLf4'
WHERE `name` = 'Spinvis';

-- -----------------------------------------------------
-- Festivalinfoteksten (beheerbaar via CMS/admin later)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `festival_info` (
  `id`          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `key`         VARCHAR(60)   NOT NULL,       -- machine-leesbare naam, bv. 'about'
  `title_nl`    VARCHAR(200)  NOT NULL,
  `title_en`    VARCHAR(200)  NOT NULL,
  `content_nl`  TEXT          NOT NULL,
  `content_en`  TEXT          NOT NULL,
  `sort_order`  SMALLINT      NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_info_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- FESTIVAL DATA — LoveU Festival 2026
-- Bron: blokkenschema vastgesteld mei 2026
-- day: 1 = zaterdag 15 aug 2026 | 2 = zondag 16 aug 2026
-- =====================================================

-- -----------------------------------------------------
-- Podia / locaties
-- -----------------------------------------------------
INSERT INTO `locations` (`name_nl`, `name_en`, `type`, `lat`, `lng`, `color`) VALUES
  ('Ponton',       'Ponton',        'stage',    52.0672, 5.0832, '#E85D4A'),
  ('The Lake',    'The Lake',     'stage',    52.0668, 5.0835, '#2E7D8B'),
  ('The Club',    'The Club',     'stage',    52.0665, 5.0828, '#7B2D8B'),
  ('Hanggar',     'Hanggar',      'stage',    52.0670, 5.0826, '#2E7D52'),
  ('Hoofdingang', 'Main Entrance','entrance', 52.0660, 5.0831, '#F5A623'),
  ('EHBO',        'First Aid',    'medical',  52.0674, 5.0825, '#CC0000');

-- -----------------------------------------------------
-- Artiesten — Ponton (headliners)
-- -----------------------------------------------------
INSERT INTO `artists` (`name`, `category`, `genre`, `description_nl`, `description_en`) VALUES
  -- Zaterdag
  ('Armin van Buuren', 'headliner', 'Trance / Dance',      'Wereldberoemde Nederlandse DJ en producer.',       'World-famous Dutch DJ and producer.'),
  ('Kensington',       'headliner', 'Rock / Pop',          'Nederlandse rockband uit Utrecht.',                 'Dutch rock band from Utrecht.'),
  ('De Staat',         'headliner', 'Rock / Funk',         'Invloedrijke Nederlandse rockband.',                'Influential Dutch rock band.'),
  ('Navarone',         'headliner', 'Rock',                'Harde Nederlandse rockband.',                       'Heavy Dutch rock band.'),
  ('Dotan',            'headliner', 'Pop / Folk',          'Nederlandse singer-songwriter.',                    'Dutch singer-songwriter.'),
  ('Froukje',          'headliner', 'Indie Pop',           'Nederlandse indie-popzangeres.',                    'Dutch indie pop artist.'),
  -- Zondag
  ('Martin Garrix',    'headliner', 'EDM / Dance',         'Nederlandse DJ en producer, wereldtop.',            'Dutch DJ and producer, world-class.'),
  ('Within Temptation','headliner', 'Symphonic Metal',     'Bekende Nederlandse metalband.',                    'Renowned Dutch metal band.'),
  ('Chef\'Special',    'headliner', 'Pop / Funk',          'Nederlandse pop-funkband.',                         'Dutch pop-funk band.'),
  ('Eefje de Visser',  'headliner', 'Indie Pop',           'Nederlandse indie-popzangeres en tekstdichter.',    'Dutch indie pop artist and lyricist.'),
  ('Spinvis',          'headliner', 'Indie / Elektronisch','Invloedrijke Nederlandse indie-artiest.',           'Influential Dutch indie artist.');

-- -----------------------------------------------------
-- Artiesten — The Lake (talent sets, nader te bepalen)
-- -----------------------------------------------------
INSERT INTO `artists` (`name`, `category`, `genre`, `description_nl`, `description_en`) VALUES
  ('Talent set ZA 1', 'talent', 'Nader te bepalen', 'Talentvolle act – zaterdag slot 1.', 'Talent act – Saturday slot 1.'),
  ('Talent set ZA 2', 'talent', 'Nader te bepalen', 'Talentvolle act – zaterdag slot 2.', 'Talent act – Saturday slot 2.'),
  ('Talent set ZA 3', 'talent', 'Nader te bepalen', 'Talentvolle act – zaterdag slot 3.', 'Talent act – Saturday slot 3.'),
  ('Talent set ZA 4', 'talent', 'Nader te bepalen', 'Talentvolle act – zaterdag slot 4.', 'Talent act – Saturday slot 4.'),
  ('Talent set ZA 5', 'talent', 'Nader te bepalen', 'Talentvolle act – zaterdag slot 5.', 'Talent act – Saturday slot 5.'),
  ('Talent set ZA 6', 'talent', 'Nader te bepalen', 'Talentvolle act – zaterdag slot 6.', 'Talent act – Saturday slot 6.'),
  ('Talent set ZA 7', 'talent', 'Nader te bepalen', 'Talentvolle act – zaterdag slot 7.', 'Talent act – Saturday slot 7.'),
  ('Talent set ZO 1', 'talent', 'Nader te bepalen', 'Talentvolle act – zondag slot 1.',   'Talent act – Sunday slot 1.'),
  ('Talent set ZO 2', 'talent', 'Nader te bepalen', 'Talentvolle act – zondag slot 2.',   'Talent act – Sunday slot 2.'),
  ('Talent set ZO 3', 'talent', 'Nader te bepalen', 'Talentvolle act – zondag slot 3.',   'Talent act – Sunday slot 3.'),
  ('Talent set ZO 4', 'talent', 'Nader te bepalen', 'Talentvolle act – zondag slot 4.',   'Talent act – Sunday slot 4.'),
  ('Talent set ZO 5', 'talent', 'Nader te bepalen', 'Talentvolle act – zondag slot 5.',   'Talent act – Sunday slot 5.'),
  ('Talent set ZO 6', 'talent', 'Nader te bepalen', 'Talentvolle act – zondag slot 6.',   'Talent act – Sunday slot 6.');

-- -----------------------------------------------------
-- Artiesten — The Club (activiteiten)
-- -----------------------------------------------------
INSERT INTO `artists` (`name`, `category`, `genre`, `description_nl`, `description_en`) VALUES
  ('Comedy',       'activity', 'Comedy',    'Comedyshow.',           'Comedy show.'),
  ('Lecture',      'activity', 'Lecture',   'Lezing / talk.',        'Lecture / talk.'),
  ('Theater',      'activity', 'Theater',   'Theatervoorstelling.',  'Theater performance.'),
  ('Movie',        'activity', 'Film',      'Filmvertoning.',        'Movie screening.'),
  ('Performance',  'activity', 'Kunst',     'Kunstperformance.',     'Art performance.'),
  ('Illusioinist', 'activity', 'Magie',     'Illusionistenshow.',    'Illusionist show.'),
  ('Magic Show',   'activity', 'Magie',     'Magische show.',        'Magic show.');

-- -----------------------------------------------------
-- Artiesten — Hanggar (DJ sets, nader te bepalen)
-- -----------------------------------------------------
INSERT INTO `artists` (`name`, `category`, `genre`, `description_nl`, `description_en`) VALUES
  ('DJ set ZA 1', 'dj', 'Nader te bepalen', 'DJ set – zaterdag slot 1.', 'DJ set – Saturday slot 1.'),
  ('DJ set ZA 2', 'dj', 'Nader te bepalen', 'DJ set – zaterdag slot 2.', 'DJ set – Saturday slot 2.'),
  ('DJ set ZA 3', 'dj', 'Nader te bepalen', 'DJ set – zaterdag slot 3.', 'DJ set – Saturday slot 3.'),
  ('DJ set ZA 4', 'dj', 'Nader te bepalen', 'DJ set – zaterdag slot 4.', 'DJ set – Saturday slot 4.'),
  ('DJ set ZA 5', 'dj', 'Nader te bepalen', 'DJ set – zaterdag slot 5.', 'DJ set – Saturday slot 5.'),
  ('DJ set ZA 6', 'dj', 'Nader te bepalen', 'DJ set – zaterdag slot 6.', 'DJ set – Saturday slot 6.'),
  ('DJ set ZA 7', 'dj', 'Nader te bepalen', 'DJ set – zaterdag slot 7.', 'DJ set – Saturday slot 7.'),
  ('DJ set ZA 8', 'dj', 'Nader te bepalen', 'DJ set – zaterdag slot 8.', 'DJ set – Saturday slot 8.'),
  ('DJ set ZO 1', 'dj', 'Nader te bepalen', 'DJ set – zondag slot 1.',   'DJ set – Sunday slot 1.'),
  ('DJ set ZO 2', 'dj', 'Nader te bepalen', 'DJ set – zondag slot 2.',   'DJ set – Sunday slot 2.'),
  ('DJ set ZO 3', 'dj', 'Nader te bepalen', 'DJ set – zondag slot 3.',   'DJ set – Sunday slot 3.'),
  ('DJ set ZO 4', 'dj', 'Nader te bepalen', 'DJ set – zondag slot 4.',   'DJ set – Sunday slot 4.'),
  ('DJ set ZO 5', 'dj', 'Nader te bepalen', 'DJ set – zondag slot 5.',   'DJ set – Sunday slot 5.'),
  ('DJ set ZO 6', 'dj', 'Nader te bepalen', 'DJ set – zondag slot 6.',   'DJ set – Sunday slot 6.'),
  ('DJ set ZO 7', 'dj', 'Nader te bepalen', 'DJ set – zondag slot 7.',   'DJ set – Sunday slot 7.'),
  ('DJ set ZO 8', 'dj', 'Nader te bepalen', 'DJ set – zondag slot 8.',   'DJ set – Sunday slot 8.');

-- -----------------------------------------------------
-- Programma — dag 1, zaterdag 15 aug 2026
-- stage_id: 1=Ponton, 2=The Lake, 3=The Club, 4=Hanggar
-- artist_id gebaseerd op volgorde van inserts hierboven:
--   1-11  = headliners (1-6 zaterdag, 7-11 zondag)
--   12-18 = talent ZA 1-7
--   19-24 = talent ZO 1-6
--   25-31 = activiteiten (Comedy, Lecture, Theater, Movie, Performance, Illusioinist, Magic Show)
--   32-39 = DJ ZA 1-8
--   40-47 = DJ ZO 1-8
-- -----------------------------------------------------

-- Ponton – zaterdag
INSERT INTO `schedule` (`artist_id`, `stage_id`, `day`, `start_time`, `end_time`) VALUES
  (1,  1, 1, '10:15', '12:00'),  -- Armin van Buuren
  (2,  1, 1, '12:30', '13:30'),  -- Kensington
  (3,  1, 1, '14:15', '16:00'),  -- De Staat
  (4,  1, 1, '16:45', '18:15'),  -- Navarone
  (5,  1, 1, '19:15', '21:15'),  -- Dotan
  (6,  1, 1, '21:45', '23:30');  -- Froukje

-- The Lake – zaterdag
INSERT INTO `schedule` (`artist_id`, `stage_id`, `day`, `start_time`, `end_time`) VALUES
  (12, 2, 1, '10:00', '10:45'),  -- Talent set ZA 1
  (13, 2, 1, '11:00', '12:30'),  -- Talent set ZA 2
  (14, 2, 1, '13:00', '14:15'),  -- Talent set ZA 3
  (15, 2, 1, '15:00', '16:30'),  -- Talent set ZA 4
  (16, 2, 1, '17:15', '18:45'),  -- Talent set ZA 5
  (17, 2, 1, '19:30', '21:15'),  -- Talent set ZA 6
  (18, 2, 1, '21:30', '23:15');  -- Talent set ZA 7

-- The Club – zaterdag
INSERT INTO `schedule` (`artist_id`, `stage_id`, `day`, `start_time`, `end_time`) VALUES
  (25, 3, 1, '11:45', '13:00'),  -- Comedy
  (26, 3, 1, '13:30', '14:45'),  -- Lecture
  (27, 3, 1, '15:15', '16:45'),  -- Theater
  (28, 3, 1, '17:15', '18:45'),  -- Movie
  (29, 3, 1, '19:30', '21:15'),  -- Performance
  (30, 3, 1, '21:30', '23:15');  -- Illusioinist

-- Hanggar – zaterdag
INSERT INTO `schedule` (`artist_id`, `stage_id`, `day`, `start_time`, `end_time`) VALUES
  (32, 4, 1, '10:00', '11:00'),  -- DJ set ZA 1
  (33, 4, 1, '11:15', '12:15'),  -- DJ set ZA 2
  (34, 4, 1, '12:30', '13:45'),  -- DJ set ZA 3
  (35, 4, 1, '14:00', '15:00'),  -- DJ set ZA 4
  (36, 4, 1, '15:15', '16:45'),  -- DJ set ZA 5
  (37, 4, 1, '17:00', '18:30'),  -- DJ set ZA 6
  (38, 4, 1, '19:00', '21:00'),  -- DJ set ZA 7
  (39, 4, 1, '21:30', '23:30');  -- DJ set ZA 8

-- -----------------------------------------------------
-- Programma — dag 2, zondag 16 aug 2026
-- -----------------------------------------------------

-- Ponton – zondag
INSERT INTO `schedule` (`artist_id`, `stage_id`, `day`, `start_time`, `end_time`) VALUES
  (7,  1, 2, '10:30', '12:15'),  -- Martin Garrix
  (8,  1, 2, '13:00', '15:00'),  -- Within Temptation
  (9,  1, 2, '15:30', '17:15'),  -- Chef'Special
  (10, 1, 2, '18:30', '20:30'),  -- Eefje de Visser
  (11, 1, 2, '21:15', '23:00');  -- Spinvis

-- The Lake – zondag
INSERT INTO `schedule` (`artist_id`, `stage_id`, `day`, `start_time`, `end_time`) VALUES
  (19, 2, 2, '10:00', '10:45'),  -- Talent set ZO 1
  (20, 2, 2, '11:15', '12:30'),  -- Talent set ZO 2
  (21, 2, 2, '13:00', '14:15'),  -- Talent set ZO 3
  (22, 2, 2, '15:00', '16:30'),  -- Talent set ZO 4
  (23, 2, 2, '17:00', '18:30'),  -- Talent set ZO 5
  (24, 2, 2, '19:30', '21:15');  -- Talent set ZO 6

-- The Club – zondag
INSERT INTO `schedule` (`artist_id`, `stage_id`, `day`, `start_time`, `end_time`) VALUES
  (25, 3, 2, '11:30', '12:45'),  -- Comedy
  (26, 3, 2, '13:15', '14:30'),  -- Lecture
  (27, 3, 2, '15:00', '16:30'),  -- Theater
  (28, 3, 2, '17:00', '18:30'),  -- Movie
  (31, 3, 2, '19:30', '21:15');  -- Magic Show

-- Hanggar – zondag
INSERT INTO `schedule` (`artist_id`, `stage_id`, `day`, `start_time`, `end_time`) VALUES
  (40, 4, 2, '10:00', '10:45'),  -- DJ set ZO 1
  (41, 4, 2, '11:00', '12:15'),  -- DJ set ZO 2
  (42, 4, 2, '12:30', '13:45'),  -- DJ set ZO 3
  (43, 4, 2, '14:00', '15:00'),  -- DJ set ZO 4
  (44, 4, 2, '15:15', '16:30'),  -- DJ set ZO 5
  (45, 4, 2, '17:00', '18:15'),  -- DJ set ZO 6
  (46, 4, 2, '18:30', '20:00'),  -- DJ set ZO 7
  (47, 4, 2, '20:30', '22:30');  -- DJ set ZO 8

-- -----------------------------------------------------
-- Festivalinfoteksten
-- -----------------------------------------------------
INSERT INTO `festival_info` (`key`, `title_nl`, `title_en`, `content_nl`, `content_en`, `sort_order`) VALUES
  ('about',      'Over het festival',  'About the festival',
   'HartjeU is een tweedaags muziekfestival voor studenten in de regio Utrecht.',
   'HartjeU is a two-day music festival for students in the Utrecht region.', 1),
  ('access',     'Bereikbaarheid',     'Getting there',
   'Bereikbaar met de bus vanaf Utrecht Centraal. Parkeren op terrein P•••.',
   'Accessible by bus from Utrecht Central Station. Parking at lot P•••.', 2),
  ('tickets',    'Tickets',            'Tickets',
   'Tickets zijn beschikbaar als dag- of weekendticket via de website.',
   'Tickets are available as day or weekend tickets via the website.', 3),
  ('rules',      'Huisregels',         'House rules',
   'Geen eigen drank. Geen glaswerk. Leeftijdsgrens 16 jaar.',
   'No outside drinks. No glassware. Minimum age 16.', 4),
  ('facilities', 'Faciliteiten',       'Facilities',
   'Meerdere bars, foodtrucks, toiletten en een EHBO-post aanwezig.',
   'Multiple bars, food trucks, toilets and a first aid station on site.', 5);
