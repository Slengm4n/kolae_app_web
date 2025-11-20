// Espera o HTML carregar antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- Configuração ---
    // A URL da API do seu projeto Kolae ORIGINAL (que está rodando no XAMPP)
    const LOGIN_API_URL = 'http://localhost/kolae/api/v1/auth/login';
    // O nome da chave para salvar o token no navegador
    const TOKEN_KEY = 'kolaeAuthToken';
    // A página para onde o usuário será enviado após o login
    const MAP_PAGE_URL = 'map.html';

    // --- Seletores de Elementos ---
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-button');
    const errorMessageDiv = document.getElementById('error-message');

    // --- Verificação Inicial ---
    // Se o usuário já tem um token, redireciona direto para o mapa
    if (localStorage.getItem(TOKEN_KEY)) {
        console.log('Token encontrado, redirecionando para o mapa...');
        window.location.href = MAP_PAGE_URL;
        return; // Para a execução
    }

    // --- Evento de Submit do Formulário ---
    loginForm.addEventListener('submit', async (event) => {
        // Impede que o formulário recarregue a página
        event.preventDefault();

        // 1. Mostrar estado de "Carregando"
        setLoading(true);

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            // 2. Fazer a chamada 'fetch' para a API
            const response = await fetch(LOGIN_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                // Converte os dados do JS para uma string JSON que a API espera
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            // Converte a resposta (que é JSON) em um objeto JavaScript
            const result = await response.json();

            // 3. Verificar a Resposta da API
            if (response.ok && result.success && result.data?.token) {
                // SUCESSO!
                console.log('Login bem-sucedido!');
                
                // Salva o token JWT no localStorage do navegador
                localStorage.setItem(TOKEN_KEY, result.data.token);
                
                // Redireciona o usuário para a página do mapa
                window.location.href = MAP_PAGE_URL;

            } else {
                // FALHA (Ex: senha errada)
                const message = result.error?.message || 'Email ou senha inválidos.';
                console.error('Falha no login:', message);
                showError(message);
                setLoading(false); // Para o carregamento
            }

        } catch (error) {
            // FALHA (Ex: API fora do ar, erro de rede, CORS)
            console.error('Erro de conexão com a API:', error);
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                showError('Erro de CORS ou API/XAMPP fora do ar. Verifique o console.');
            } else {
                showError('Não foi possível conectar ao servidor. Tente mais tarde.');
            }
            setLoading(false); // Para o carregamento
        }
    });

    /**
     * Ativa ou desativa o estado de carregamento do formulário
     * @param {boolean} isLoading
     */
    function setLoading(isLoading) {
        if (isLoading) {
            loginButton.disabled = true;
            loginButton.textContent = 'Entrando...';
            errorMessageDiv.classList.add('hidden'); // Esconde erros antigos
        } else {
            loginButton.disabled = false;
            loginButton.textContent = 'Entrar';
        }
    }

    /**
     * Exibe uma mensagem de erro na tela
     * @param {string} message
     */
    function showError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.classList.remove('hidden'); // Mostra o 'div' de erro
    }
});