-- =====================================================
-- HartjeU Festival — Festivalinfo seed
-- Vervangt de oude placeholder-info door de echte content.
-- Uitvoeren als je de DB al hebt aangemaakt via schema.sql.
-- =====================================================

USE `hartjeu_festival`;

-- -----------------------------------------------------
-- 1. Tabeluitbreiding: icon + accent aan festival_info
-- -----------------------------------------------------
ALTER TABLE `festival_info`
  ADD COLUMN IF NOT EXISTS `icon`   VARCHAR(10) DEFAULT NULL AFTER `sort_order`,
  ADD COLUMN IF NOT EXISTS `accent` VARCHAR(30) DEFAULT NULL AFTER `icon`;

-- -----------------------------------------------------
-- 2. Subsectietabel
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `festival_info_items` (
  `id`          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `info_id`     INT UNSIGNED  NOT NULL,
  `sort_order`  SMALLINT      NOT NULL DEFAULT 0,
  `subtitle_nl` VARCHAR(200)  NOT NULL,
  `subtitle_en` VARCHAR(200)  NOT NULL,
  `body_nl`     TEXT          NOT NULL,
  `body_en`     TEXT          NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_items_info` (`info_id`),
  CONSTRAINT `fk_items_info`
    FOREIGN KEY (`info_id`) REFERENCES `festival_info`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- 3. Oude infoteksten verwijderen en opnieuw vullen
-- -----------------------------------------------------
DELETE FROM `festival_info`;

INSERT INTO `festival_info`
  (`key`, `title_nl`, `title_en`, `content_nl`, `content_en`, `sort_order`, `icon`, `accent`)
VALUES
  ('general',
   'Algemeen & contact',
   'General & contact',
   'Het ❤️U Festival is voor (nieuwe) studenten in de regio Utrecht en is een aanvulling op UIT.',
   'The ❤️U Festival is for (new) students in the Utrecht region and complements UIT.',
   1, '📍', NULL),

  ('access',
   'Bereikbaarheid',
   'Getting there',
   NULL,
   NULL,
   2, '🚍', NULL),

  ('lockers',
   'Lockers',
   'Lockers',
   'Op het festivalterrein zijn kluisjes aanwezig waar je je spullen veilig kunt opbergen. Hier passen 3 à 4 jassen in. Je kunt je kluisje gedurende de hele dag openen en sluiten zo vaak je wilt. Het is niet mogelijk om online een kluisje te reserveren.',
   'Lockers are available on the festival grounds where you can safely store your belongings. They fit 3–4 jackets. You can open and close your locker as many times as you want throughout the day. It is not possible to reserve a locker online.',
   3, '🔐', NULL),

  ('faq',
   'Veelgestelde vragen',
   'Frequently asked questions',
   NULL,
   NULL,
   4, '❓', NULL),

  ('golden-glu',
   'Golden-GLU',
   'Golden-GLU',
   'Studenten van het GLU hebben tijdens het festival speciale privileges en zijn herkenbaar aan een gouden armbandje.\n\nMet dit gouden armbandje kunnen ze gebruik maken van de gouden toiletten en met goud gemarkeerde bestelpunten aan de bars — zonder in de rij te hoeven staan.',
   'GLU students have special privileges during the festival and are recognisable by a golden wristband.\n\nWith this golden wristband they can use the golden toilets and gold-marked order points at the bars — without having to queue.',
   5, '⭐', 'gold');

-- -----------------------------------------------------
-- 4. Subsecties vullen (via subquery op key)
-- -----------------------------------------------------

-- Algemeen & contact
INSERT INTO `festival_info_items`
  (`info_id`, `sort_order`, `subtitle_nl`, `subtitle_en`, `body_nl`, `body_en`)
SELECT `id`, 1,
  'Adres', 'Address',
  'Locatie: Strijkviertel, Utrecht\nNavigatieadres: Strijkviertelweg, Utrecht',
  'Location: Strijkviertel, Utrecht\nNavigation address: Strijkviertelweg, Utrecht'
FROM `festival_info` WHERE `key` = 'general';

INSERT INTO `festival_info_items`
  (`info_id`, `sort_order`, `subtitle_nl`, `subtitle_en`, `body_nl`, `body_en`)
SELECT `id`, 2,
  'Datum & Openingstijden', 'Date & Opening hours',
  'Zaterdag 5 september 2026\n12:00 – 23:00 uur',
  'Saturday 5 September 2026\n12:00 – 23:00'
FROM `festival_info` WHERE `key` = 'general';

-- Bereikbaarheid
INSERT INTO `festival_info_items`
  (`info_id`, `sort_order`, `subtitle_nl`, `subtitle_en`, `body_nl`, `body_en`)
SELECT `id`, 1,
  'Fiets', 'Bicycle',
  'Er is een grote gratis fietsenstalling aanwezig waar je jouw fiets de gehele dag kunt stallen.',
  'A large free bike storage is available where you can leave your bike for the entire day.'
FROM `festival_info` WHERE `key` = 'access';

INSERT INTO `festival_info_items`
  (`info_id`, `sort_order`, `subtitle_nl`, `subtitle_en`, `body_nl`, `body_en`)
SELECT `id`, 2,
  'Auto', 'Car',
  'Je kunt een parkingticket aanschaffen. Parkeren kan op P+R Papendorp — volg de borden ''P online ticket''. Geen ticket vooraf gekocht? Dan kun je bij de parkeerwachter op locatie een parkeerticket aanschaffen (PIN ONLY). Let op: VOL=VOL.',
  'You can purchase a parking ticket. Parking is available at P+R Papendorp — follow the signs ''P online ticket''. No ticket bought in advance? You can buy a parking ticket from the parking attendant on site (PIN ONLY). Note: FULL=FULL.'
FROM `festival_info` WHERE `key` = 'access';

INSERT INTO `festival_info_items`
  (`info_id`, `sort_order`, `subtitle_nl`, `subtitle_en`, `body_nl`, `body_en`)
SELECT `id`, 3,
  'Openbaar vervoer', 'Public transport',
  'Kom je met het openbaar vervoer? Plan dan je trip via 9292.nl.',
  'Coming by public transport? Plan your trip via 9292.nl.'
FROM `festival_info` WHERE `key` = 'access';

INSERT INTO `festival_info_items`
  (`info_id`, `sort_order`, `subtitle_nl`, `subtitle_en`, `body_nl`, `body_en`)
SELECT `id`, 4,
  'Shuttlebus', 'Shuttle bus',
  'Vanaf Utrecht Centraal kun je onze gratis shuttlebus richting het festivalterrein pakken. Je vindt deze bus op het centraal station aan de Mineurslaan. Volg de witte bordjes met zwarte pijlen én ''❤️U Festival''.\n\nDe bus rijdt tussen 12:00 en 19:00 uur richting het festival. Vanaf 21:00 uur kun je weer instappen voor het station.',
  'From Utrecht Centraal you can take our free shuttle bus to the festival grounds. You''ll find the bus at the central station on Mineurslaan. Follow the white signs with black arrows and ''❤️U Festival''.\n\nThe bus runs from 12:00 to 19:00 towards the festival. From 21:00 you can board again to return to the station.'
FROM `festival_info` WHERE `key` = 'access';

INSERT INTO `festival_info_items`
  (`info_id`, `sort_order`, `subtitle_nl`, `subtitle_en`, `body_nl`, `body_en`)
SELECT `id`, 5,
  'Taxi & Kiss & Ride', 'Taxi & Kiss & Ride',
  'Navigeer naar Strijkviertel, De Meern (Utrecht). Volg de borden "Kiss & Ride ❤️U Festival" zodra je in de buurt bent van het festivalterrein.',
  'Navigate to Strijkviertel, De Meern (Utrecht). Follow the signs "Kiss & Ride ❤️U Festival" when you are near the festival grounds.'
FROM `festival_info` WHERE `key` = 'access';

-- Veelgestelde vragen
INSERT INTO `festival_info_items`
  (`info_id`, `sort_order`, `subtitle_nl`, `subtitle_en`, `body_nl`, `body_en`)
SELECT `id`, 1,
  'Ik gebruik medicatie. Wat nu?', 'I use medication. What now?',
  'Het is toegestaan om medicijnen mee te nemen in een dosis die je maximaal nodig hebt op 1 dag. Een doktersverklaring of medicatiepaspoort is noodzakelijk.\n\nDe beveiliging zal jouw documentatie beoordelen en de medicijnen controleren. Het kan zijn dat de EHBO jouw medicijnen in bewaring neemt en je deze enkel kunt innemen bij de EHBO.',
  'You are allowed to bring medication in the dose needed for 1 day maximum. A doctor''s note or medication passport is required.\n\nSecurity will assess your documentation and check the medication. The first aid team may hold your medication and you may only take it at the first aid station.'
FROM `festival_info` WHERE `key` = 'faq';

INSERT INTO `festival_info_items`
  (`info_id`, `sort_order`, `subtitle_nl`, `subtitle_en`, `body_nl`, `body_en`)
SELECT `id`, 2,
  'Mag ik het festivalterrein tussentijds verlaten?', 'Can I leave the festival grounds during the day?',
  'Nee, dat is helaas niet mogelijk. Om de veiligheid van alle bezoekers te waarborgen, kunnen we het niet toestaan dat het festivalterrein tussentijds verlaten wordt. Hier kunnen geen uitzonderingen voor gemaakt worden.',
  'No, unfortunately that is not possible. To ensure the safety of all visitors, we cannot allow leaving the festival grounds during the event. No exceptions can be made.'
FROM `festival_info` WHERE `key` = 'faq';

INSERT INTO `festival_info_items`
  (`info_id`, `sort_order`, `subtitle_nl`, `subtitle_en`, `body_nl`, `body_en`)
SELECT `id`, 3,
  'Zijn er lockers?', 'Are there lockers?',
  'Ja! Op het terrein kun je medium & grote lockers huren. Kijk bij het onderdeel Lockers voor meer informatie.',
  'Yes! On the grounds you can rent medium & large lockers. See the Lockers section for more information.'
FROM `festival_info` WHERE `key` = 'faq';
