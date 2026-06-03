-- Voer dit uit in phpMyAdmin op de hartjeu_festival database
-- Vult bio_nl, bio_en en youtube_url in voor alle headliner-artiesten

USE `u448324313_festival`;

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
WHERE `name` = 'Chef''Special';

UPDATE `artists` SET
  `bio_nl`      = 'Hard rockend viertal uit Utrecht met riff-gedreven anthems en dynamische vocalen. Met een liverepututie voor rauwe intensiteit zijn ze geknipt voor late-night mainstages.',
  `bio_en`      = 'Utrecht''s hard-hitting rock four-piece, delivering riff-driven anthems and dynamic vocals. With a live reputation for raw intensity, they''re tailor-made for late-night main stages.',
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
  `bio_en`      = 'Breakthrough pop singer Froukje Veenstra combines candid lyrics with catchy, synth-driven hooks. Since her 2021 debut, she''s become a voice of her generation — ideal for mid-day festival stages.',
  `youtube_url` = 'https://www.youtube.com/embed/g4PlReX9e-E'
WHERE `name` = 'Froukje';

UPDATE `artists` SET
  `bio_nl`      = 'Erik de Jong treedt op onder de naam Spinvis en maakt poëtische, collage-achtige songs die gesproken woord, lo-fi elektronica en weemoedige pop combineren. Sinds zijn debuutalbum uit 2002 — opgenomen op zijn zolder — is hij een vaste waarde in de Nederlandse indie, geroemd om verhalen die tegelijk intiem en surreëel aanvoelen.',
  `bio_en`      = 'Erik de Jong performs under the moniker Spinvis, crafting poetic, collage-like songs that blend spoken-word snippets, lo-fi electronics and wistful pop. Since his debut album in 2002—recorded in his attic—he''s become a fixture of Dutch indie, renowned for narratives that feel both intimate and surreal.',
  `youtube_url` = 'https://www.youtube.com/embed/F3ZTrGWSLf4'
WHERE `name` = 'Spinvis';
