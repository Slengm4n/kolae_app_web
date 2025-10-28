document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do formulário
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const loginButton = document.getElementById('login-button');

    // URL da API de login do seu projeto Kolae original
    // Ajuste se sua pasta no htdocs não for 'colae'
    const loginApiUrl = 'http://localhost/colae/api/v1/auth/login';

    // Nome da chave para guardar o token no localStorage
    const TOKEN_KEY = 'kolaeAuthToken';

    // Verifica se já existe um token ao carregar a página
    // Se existir, talvez redirecionar direto para o mapa? (Opcional)
    // if (localStorage.getItem(TOKEN_KEY)) {
    //    console.log('Token encontrado, redirecionando para o mapa...');
    //    window.location.href = 'map.html';
    // }

    // Adiciona o evento de 'submit' ao formulário
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o recarregamento da página

        // Limpa erros anteriores e desabilita o botão
        errorMessage.textContent = '';
        loginButton.disabled = true;
        loginButton.textContent = 'Entrando...';

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            // Faz a chamada (fetch) para a API de login
            const response = await fetch(loginApiUrl, {
                method: 'POST',
                // Define os cabeçalhos da requisição
                headers: {
                    'Content-Type': 'application/json', // Indica que estamos enviando JSON
                    'Accept': 'application/json'       // Indica que esperamos JSON de volta
                },
                // Converte os dados do formulário para uma string JSON
                body: JSON.stringify({ email: email, password: password })
            });

            // Tenta converter a resposta da API para um objeto JSON
            const result = await response.json();

            // Verifica se a requisição foi bem-sucedida (status 2xx) E se a API retornou success: true
            if (response.ok && result.success && result.data?.token) {
                // Sucesso!
                console.log('Login realizado com sucesso!');

                // Guarda o token JWT recebido no localStorage do navegador
                localStorage.setItem(TOKEN_KEY, result.data.token);

                // Redireciona o usuário para a página do mapa
                window.location.href = 'map.html'; // Certifique-se que este arquivo existe

            } else {
                // Falha no login (credenciais erradas, erro da API, etc.)
                const message = result.error?.message || 'Erro desconhecido no login.';
                console.error('Falha no login:', message, '| Status:', response.status);
                errorMessage.textContent = message;
                // Reabilita o botão
                loginButton.disabled = false;
                loginButton.textContent = 'Entrar';
            }

        } catch (error) {
            // Erro na comunicação com a API (rede, servidor fora do ar, CORS, etc.)
            console.error('Erro na requisição de login:', error);
            errorMessage.textContent = 'Não foi possível conectar ao servidor. Verifique a rede ou tente mais tarde.';
            // Reabilita o botão
            loginButton.disabled = false;
            loginButton.textContent = 'Entrar';
        }
    });
});