<?php

namespace App\Core;

use PDO;
use PDOException;

class Database
{
    private static $pdo;
    public static function getConnection()
    {
        if (!isset(self::$pdo)) {
            try {
                // As constantes DB_HOST, DB_NAME, etc., são carregadas no index.php
                self::$pdo = new PDO(
                    "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8",
                    DB_USER,
                    DB_PASS
                );

                // Define os atributos do PDO para um tratamento de erros robusto
                self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                // FETCH_ASSOC é geralmente mais prático que FETCH_OBJ
                self::$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                // Em produção, o ideal seria logar este erro em vez de exibi-lo.
                die("Erro de conexão com o banco de dados: " . $e->getMessage());
            }
        }

        return self::$pdo;
    }
}
