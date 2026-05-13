<?php
// Databaseconfiguratie — pas aan voor Hostinger
define('DB_HOST', 'mysql_db');       // Docker: service naam; Hostinger: 'localhost'
define('DB_NAME', 'hartjeu_festival');
define('DB_USER', 'root');          // Hostinger: jouw DB-gebruikersnaam
define('DB_PASS', 'root');          // Docker: 'root'; Hostinger: jouw wachtwoord
define('DB_CHARSET', 'utf8mb4');

function getDb(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', DB_HOST, DB_NAME, DB_CHARSET);
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    return $pdo;
}
