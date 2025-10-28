
<?php

// --- Importação dos Controllers ---
use App\Core\Router;
use App\Controllers\AuthContoller;
use App\Controllers\HomeController;

// Inicia a sessão para toda a aplicação.
session_start();

// --- Constantes Globais ---
define('BASE_PATH', __DIR__);

/* --- Definição Dinâmica da BASE_URL --- */

// Detecta o protocolo (http ou https)
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https" : "http";

// Detecta o host (o domínio, ex: "localhost" ou "colae.42web.io")
$host = $_SERVER['HTTP_HOST'];

if ($host == 'localhost') {
    // --- AMBIENTE LOCAL (SEU PC) ---
    define('BASE_URL', 'http://localhost/kolae');
    define('BASE_DIR_URL', '/kolae'); // <-- A NOVA CONSTANTE PARA O ROUTER

} else {
    // --- AMBIENTE DE PRODUÇÃO (InfinityFree) ---
    define('BASE_URL', $protocol . '://' . $host);
    define('BASE_DIR_URL', ''); // <-- A NOVA CONSTANTE PARA O ROUTER (vazio)
}
