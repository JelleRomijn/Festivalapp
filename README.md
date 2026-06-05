# HartjeU Festival App

PWA voor het HartjeU festival, Utrecht — 15 & 16 augustus 2026.

Gebouwd met Next.js 14 (App Router), PHP, MySQL en next-pwa.

live link https://festival.jelleromijn.com/

---

## Lokaal draaien — stappenplan

### Vereisten

Zorg dat je het volgende hebt geïnstalleerd:

- [Node.js](https://nodejs.org/) (versie 18 of hoger)
- [PHP](https://www.php.net/) (versie 8.0 of hoger)
- [MySQL](https://www.mysql.com/) (versie 8.0 of hoger) of [XAMPP](https://www.apachefriends.org/) / [Laragon](https://laragon.org/)
- [Git](https://git-scm.com/)

---

### Stap 1 — Repository klonen

```bash
git clone https://github.com/JelleRomijn/Festivalapp.git
cd Festivalapp
```

---

### Stap 2 — Database aanmaken

1. Open phpMyAdmin of een MySQL-client.
2. Maak een nieuwe database aan, bijvoorbeeld `festival_db`.
3. Importeer het schema:

```bash
mysql -u root -p festival_db < database/schema.sql
```

4. Importeer de artiestenbio's (optioneel):

```bash
mysql -u root -p festival_db < database/seed_artist_bios.sql
```

---

### Stap 3 — PHP API configureren

1. Ga naar `api/config/` en open `database.php`.
2. Pas de databasegegevens aan:

```php
$host = 'localhost';
$dbname = 'festival_db';
$username = 'root';
$password = 'jouw_wachtwoord';
```

3. Zorg dat de `api/` map bereikbaar is via je lokale webserver (Apache/XAMPP). De API is dan beschikbaar op:

```
http://localhost/Festival-app/api
```

---

### Stap 4 — Next.js frontend configureren

1. Ga naar de `frontend/` map:

```bash
cd frontend
```

2. Maak een `.env.local` bestand aan op basis van het voorbeeld:

```bash
cp .env.local.example .env.local
```

3. Controleer de inhoud van `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost/Festival-app/api
```

Pas de URL aan als je API op een andere poort of pad draait.

---

### Stap 5 — Dependencies installeren

Installeer de Node.js-packages vanuit de `frontend/` map:

```bash
npm install
```

---

### Stap 6 — Dev-server starten

Start de Next.js ontwikkelserver:

```bash
npm run dev
```

De app is nu bereikbaar op:

```
http://localhost:3000
```

Het CMS/admin-paneel is bereikbaar op:

```
http://localhost:3000/admin
```

---

### Veelvoorkomende problemen

| Probleem | Oplossing |
|---|---|
| Witte pagina of 404 | Controleer of de dev-server draait (`npm run dev`) |
| API laadt niet | Controleer of Apache/PHP actief is en `api/config/database.php` klopt |
| Verouderde data in browser | DevTools → Application → Service Workers → Unregister, daarna herladen |
| Poort 3000 bezet | Next.js start automatisch op poort 3001 — check de terminal output |

---

## Projectstructuur

```
Festival-app/
├── frontend/        # Next.js 14 App Router (JavaScript)
├── api/             # PHP API-endpoints (JSON)
├── database/        # MySQL schema en seed-data
└── logboek.md       # Overzicht van alle ontwikkelprompts
```

---

## Productie deployen (Hostinger)

1. Bouw de statische export:

```bash
cd frontend
npm run build
```

De bestanden worden automatisch gekopieerd naar de repo-root via het `postbuild` script.

2. Upload alle bestanden naar Hostinger via FTP of Git.
3. Zorg dat `.env.production` de juiste productie-API-URL bevat:

```
NEXT_PUBLIC_API_URL=https://api-festival.jelleromijn.com
```
