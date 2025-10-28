<?php

class AuthHelper
{
    /**
     * Garante que a sessão PHP seja iniciada.
     */
    public static function start()
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
    }

    /**
     * Verifica se o usuário está logado.
     * Se não estiver, redireciona para a página de login.
     * Também lida com a troca forçada de senha.
     */
    public static function check()
    {
        self::start();
        if (!isset($_SESSION['user_id'])) {
            header('Location: ' . BASE_URL . '/login');
            exit;
        }
    }
}
