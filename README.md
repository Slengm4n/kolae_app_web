
## Exemplo
```php
public static function countAll(): int
    {
        $pdo = Database::getConnection();
        $query = "SELECT COUNT(id) FROM users WHERE status = 'active'";
        $stmt = $pdo->prepare($query);
        $stmt->execute();
        return (int) $stmt->fetchColumn();
    }
```
Aqui uma função que irá fazer uma consulta de todos os usuários da tabela "users" que estão com os status ativo.


## Controllers
Outra parte importante do projeto e da arquitetura "MVC" (Model, View, Controller) são justamente os controllers, onde eles são requisitados nas rotas do sistema, assim decidindo o que ira ser feito e executado, e qual página será renderizada ao usuário.

## Router
Outra etapa essencial para um projeto "MVC" são as rotas e um Router, onde ele irá capturar a rota via URL e irá dizer para o Controller o que fazer, que consecutivamente ira utilizar um Model que tem as funções e querys (Toda a conexão com Banco de Dados). Um efeito em cadeia.

## Exemplo:

- Supondo que a rota escolhida pelo usuário seja:

 http://localhost/site/login

 O Router irá capturar "/login", que irá ficar assim:

 - $router->get('/login', [AuthController::class, 'index']);

Essa rota utliza o AuthController que é responsável por todo o acesso do site, onde utiliza a classe 'index', geralmente utilizada para páginas iniciais.

 ```php
public function index()
    {
        ViewHelper::render('auth/login');
    }
```



