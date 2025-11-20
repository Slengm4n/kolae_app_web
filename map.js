// Espera o DOM (HTML) carregar
document.addEventListener('DOMContentLoaded', () => {

    // --- URLs DA API (do seu projeto Kolae original) ---
    const API_BASE_URL = 'http://localhost/kolae/api/v1';
    const VENUES_URL = `${API_BASE_URL}/venues`;
    const SPORTS_URL = `${API_BASE_URL}/sports`;
    const GAMES_URL = `${API_BASE_URL}/games`; // Ou /matches, conforme você renomeou

    // --- Chave do Token ---
    const TOKEN_KEY = 'kolaeAuthToken';

    // --- Elementos da Página ---
    const venueSidebar = document.getElementById('venue-sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sportSelect = document.getElementById('sport-select');
    const createGameForm = document.getElementById('create-game-form');
    const errorMessage = document.getElementById('game-error-message');
    const successMessage = document.getElementById('game-success-message');
    const logoutButton = document.getElementById('logout-button');
    const createGameButton = document.getElementById('create-game-button');
    const hiddenVenueIdInput = document.getElementById('venue-id-hidden');
    const userNamePlaceholder = document.getElementById('user-name-placeholder');
    
    
    // --- Variáveis Globais ---
    let map;
    let allVenues = [];
    let allSports = [];
    let markers = [];

    // --- 1. VERIFICAÇÃO DE AUTENTICAÇÃO ---
    const authToken = localStorage.getItem(TOKEN_KEY);
    if (!authToken) {
        console.error('Nenhum token encontrado. Redirecionando para login.');
        // Se não houver token, expulsa o usuário de volta para o login
        window.location.href = 'login.html';
        return; // Para a execução do script
    }

    // Tenta decodificar o token para mostrar o nome (Bônus)
    try {
        const payload = JSON.parse(atob(authToken.split('.')[1]));
        // Se você não colocou o nome do usuário no token, mostramos genérico
        // Se colocou (ex: 'user_name'), use payload.user_name
        userNamePlaceholder.textContent = 'Usuário Logado';
    } catch (e) {
        userNamePlaceholder.textContent = 'Usuário';
    }

    // --- 2. FUNÇÕES DE EVENTOS (Logout, Fechar Sidebar, etc) ---
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = 'login.html';
    });
    
    closeSidebarBtn.addEventListener('click', () => {
        venueSidebar.classList.add('translate-x-full');
    });

    // Lógica da sidebar mobile (Menu Principal)
    const mainSidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    const overlay = document.getElementById('sidebar-overlay');

    if (toggleBtn) toggleBtn.addEventListener('click', () => {
        mainSidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
    });
    if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', () => {
        mainSidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    });
    if (overlay) overlay.addEventListener('click', () => {
        mainSidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    });

    // --- 3. FUNÇÕES DE BUSCA DE DADOS (FETCH) ---

    // Função genérica para fazer chamadas 'fetch' já com o token
    async function fetchData(url, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${authToken}`, // Adiciona o token em TODAS as chamadas
            ...options.headers,
        };

        try {
            const response = await fetch(url, { ...options, headers });

            if (response.status === 401) {
                // Token expirou ou é inválido!
                alert('Sua sessão expirou. Por favor, faça login novamente.');
                localStorage.removeItem(TOKEN_KEY);
                window.location.href = 'login.html';
                throw new Error('Não autorizado (Token inválido/expirado)');
            }
            
            const result = await response.json();

            if (!response.ok) {
                 throw new Error(result.error?.message || `Falha na API (Status: ${response.status})`);
            }
            if (!result.success) {
                throw new Error(result.error?.message || 'API retornou um erro desconhecido');
            }
            
            return result.data;

        } catch (error) {
            console.error(`Erro ao fazer fetch de ${url}:`, error.message);
            throw error; // Propaga o erro para quem chamou
        }
    }
    
    // Carrega a lista de esportes e preenche o <select>
    async function loadSports() {
        try {
            allSports = await fetchData(SPORTS_URL); // GET
            sportSelect.innerHTML = '<option value="">Selecione um esporte</option>';
            
            allSports.forEach(sport => {
                const option = document.createElement('option');
                option.value = sport.id;
                option.textContent = sport.name;
                sportSelect.appendChild(option);
            });
        } catch (error) {
            sportSelect.innerHTML = `<option value="">Erro ao carregar</option>`;
            sportSelect.disabled = true;
            console.error("Erro carregando esportes:", error.message);
        }
    }

    // Carrega as quadras e inicia o mapa
    async function loadVenuesAndInitMap() {
        try {
            allVenues = await fetchData(VENUES_URL); // GET
            // Chama a função initMap (que está no escopo global)
            initMap(allVenues);
        } catch (error) {
            document.getElementById('map').innerHTML = `<p class="text-red-400 p-4">Erro ao carregar quadras: ${error.message}. Verifique se a API (${VENUES_URL}) está rodando e o CORS está correto.</p>`;
        }
    }

    // --- 4. FUNÇÃO DE INICIALIZAÇÃO DO GOOGLE MAPS ---
    // Esta função se torna global porque é chamada pelo 'callback=runMapScript'

    
    window.initMap = (venues) => {
        const mapCenter = { lat: -23.5213, lng: -46.1884 }; // Centro do mapa
        const mapStyle = [{"elementType":"geometry","stylers":[{"color":"#242f3e"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#242f3e"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#746855"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#38414e"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#212a37"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#746855"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#1f2835"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#17263c"}]}];

        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 12,
            center: mapCenter,
            disableDefaultUI: true,
            zoomControl: true,
            styles: mapStyle
        });
        
        const bounds = new google.maps.LatLngBounds();
        markers.forEach(marker => marker.setMap(null));
        markers = [];

        venues.forEach(venue => {
            const lat = parseFloat(venue.latitude);
            const lng = parseFloat(venue.longitude);

            if (!isNaN(lat) && !isNaN(lng)) {
                const position = { lat, lng };
                const marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: venue.name,
                    icon: { 
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: "#38BDF8", // Cyan
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: "#0D1117"
                    }
                });

                markers.push(marker);
                bounds.extend(position);

                // ** A MÁGICA **
                // Adiciona o evento de clique em cada marcador
                marker.addListener('click', () => {
                    populateSidebar(venue); // Preenche a sidebar com os dados
                    venueSidebar.classList.remove('translate-x-full'); // Mostra a sidebar
                });
            }
        });

        if (venues.length > 0 && !bounds.isEmpty()) {
            map.fitBounds(bounds);
        }
    };
    
    // --- 5. FUNÇÃO PARA PREENCHER A SIDEBAR ---
    function populateSidebar(venue) {
        document.getElementById('venue-image').src = venue.full_image_url || 'https://placehold.co/400x200/161B22/E0E0E0?text=Sem+Imagem';
        document.getElementById('venue-name').textContent = venue.name;
        document.getElementById('venue-address').textContent = `${venue.street}, ${venue.number} - ${venue.city}`;
        document.getElementById('owner-image').src = venue.owner_image_url;
        document.getElementById('owner-name').textContent = venue.owner_name;

        // ** Guarda o ID da quadra no input escondido do formulário **
        hiddenVenueIdInput.value = venue.id;

        // Limpa e preenche comodidades
        const amenitiesContainer = document.getElementById('venue-amenities');
        amenitiesContainer.innerHTML = ''; // Limpa
        if (venue.has_leisure_area == "1") {
            amenitiesContainer.innerHTML += `<span class="inline-flex items-center gap-1.5 bg-gray-700 px-3 py-1 rounded-full"><i class="fas fa-utensils text-cyan-400"></i>Área de Lazer</span>`;
        }
        if (venue.has_lighting == "1") {
            amenitiesContainer.innerHTML += `<span class="inline-flex items-center gap-1.5 bg-gray-700 px-3 py-1 rounded-full"><i class="fas fa-lightbulb text-cyan-400"></i>Iluminação</span>`;
        }
        if (venue.is_covered == "1") {
            amenitiesContainer.innerHTML += `<span class="inline-flex items-center gap-1.5 bg-gray-700 px-3 py-1 rounded-full"><i class="fas fa-cloud-sun text-cyan-400"></i>Coberta</span>`;
        }
        if (amenitiesContainer.innerHTML === '') {
             amenitiesContainer.innerHTML = `<span class="text-gray-500 text-sm">Nenhuma comodidade cadastrada.</span>`;
        }
        
        errorMessage.textContent = '';
        successMessage.textContent = '';
        createGameForm.reset(); 
    }

    // --- 6. EVENTO DE SUBMISSÃO DO FORMULÁRIO DE CRIAR PARTIDA ---
    createGameForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessage.textContent = '';
        successMessage.textContent = '';
        createGameButton.disabled = true;
        createGameButton.textContent = 'Criando...';

        const venueId = hiddenVenueIdInput.value; 
        const sportId = sportSelect.value;
        const startTimeInput = document.getElementById('start-time').value;

        if (!venueId || !sportId || !startTimeInput) {
            errorMessage.textContent = 'Preencha todos os campos.';
            createGameButton.disabled = false;
            createGameButton.textContent = 'Iniciar Partida';
            return;
        }

        // Formata a data para o padrão da API (YYYY-MM-DD HH:MM:SS)
        const formattedStartTime = startTimeInput.replace('T', ' ') + ':00';
        
        // Validação: Verifica se a data está no futuro
        if (new Date(formattedStartTime) < new Date()) {
            errorMessage.textContent = 'A data de início deve ser no futuro.';
            createGameButton.disabled = false;
            createGameButton.textContent = 'Iniciar Partida';
            return;
        }

        const gameData = {
            venue_id: parseInt(venueId, 10),
            sport_id: parseInt(sportId, 10),
            start_time: formattedStartTime
        };

        try {
            const result = await fetchData(GAMES_URL, {
                method: 'POST',
                body: JSON.stringify(gameData)
            });
            
            successMessage.textContent = `Partida criada com sucesso! (ID: ${result.game_id || result.match_id})`;
            createGameForm.reset(); 
            
            setTimeout(() => {
                venueSidebar.classList.add('translate-x-full');
                successMessage.textContent = '';
            }, 2500); // Fecha a sidebar após sucesso

        } catch (error) {
            errorMessage.textContent = error.message || 'Erro ao criar partida.';
        } finally {
            createGameButton.disabled = false;
            createGameButton.textContent = 'Iniciar Partida';
        }
    });

    // --- 7. INICIALIZAÇÃO ---
    
    // Carrega os esportes (para o dropdown) assim que a página é validada
    loadSports();

    // Espera o Google Maps carregar (evento disparado pelo 'callback=runMapScript')
    document.addEventListener('google-maps-loaded', () => {
        // Agora o Google Maps está pronto, podemos carregar as quadras e iniciar o mapa
        loadVenuesAndInitMap();
    });
});