<?php

namespace App\Controllers;

use App\Core\ViewHelper;
use App\Models\User;

class AuthController
{
    public function index()
    {
        // Renderiza a view usando a classe auxiliar
        ViewHelper::render('auth/login');
    }

    public function authenticate()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $email = $_POST['email'] ?? '';
            $password = $_POST['password'] ?? '';

            $user = User::findByEmail($email);
        } else {
            // Falha no login
            header('Location: ' . BASE_URL . '/login?error=credentials');
            exit;
        }
    }

    public function logout()
    {
        // A sessão já deve ter sido iniciada no index.php
        session_destroy();
        header('Location: ' . BASE_URL . '/login');
        exit;
    }
}
