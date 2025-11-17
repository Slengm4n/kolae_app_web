<?php

/**
 * Arquivo de configuração principal para a aplicação "Kolaê".
 *
 * Este arquivo contém as configurações essenciais como credenciais de banco de dados,
 * caminhos de diretórios, chaves de segurança e outras constantes importantes
 * para o funcionamento do sistema.
 */

// --- CONFIGURAÇÕES DO BANCO DE DADOS --- //
define('DB_HOST', 'localhost');      // Endereço do servidor do banco de dados
define('DB_NAME', 'colae_db');       // Nome do banco de dados
define('DB_USER', 'root');           // Nome de usuário para acesso ao banco
define('DB_PASS', '');               // Senha para acesso ao banco
define('DB_CHARSET', 'utf8mb4');     // Charset da conexão

// --- CONFIGURAÇÕES DA APLICAÇÃO (URL E CAMINHOS) --- //


// URL base da aplicação (ex: http://localhost/colae)
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$host = $_SERVER['HTTP_HOST'];
$scriptName = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
// Define a URL base, removendo /public do final se existir
$baseUrl = rtrim($protocol . $host . $scriptName, '/public');


// --- CONFIGURAÇÕES DE SEGURANÇA (CRIPTOGRAFIA) --- //
/**
 * Chave e Vetor de Inicialização (IV) para criptografia de dados sensíveis (CPF).
 * IMPORTANTE: Devem ser gerados aleatoriamente e mantidos em segredo.
 */
define('ENCRYPTION_KEY', 'Ctc5g67t4MZQyuiKeohU50EJWchUeOAUu4Lsm3x');
define('ENCRYPTION_IV', '8d6b9d7e2f0c1a3b5c8e4f5a2b1c0d9e');


// --- CONFIGURAÇÕES DE APIs EXTERNAS --- //
/**
 * Chave da API do Google Maps para as funcionalidades de geocodificação e mapas.
 */
define('GOOGLE_MAPS_API_KEY', 'AIzaSyBQWIOMMnTnuoKmr9Qkvkfkaif45pzTSoE');


// --- Configurações de E-mail (SMTP) ---
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_USER', 'kolaee.gg@gmail.com');
define('SMTP_PASS', 'dkqz snyi vumd lfcg');
define('SMTP_PORT', 465);
define('SMTP_SECURE', 'ssl'); // ou 'tls' se a porta for 587
define('SMTP_FROM_EMAIL', 'suporte@kolae.com.br');
define('SMTP_FROM_NAME', 'Equipe Kolae');

/**
 * Chave JWT
 */
define('JWT_SECRET', 'etLsey2t/6ca98HzoEBfIy2xkqBrRYX8Shc+6X31x6OKpKKZyMqF7Ek3mCaE90Jy');


// --- CONFIGURAÇÕES REGIONAIS --- //
/**
 * Define o fuso horário padrão para funções de data e hora da aplicação.
 */
date_default_timezone_set('America/Sao_Paulo');