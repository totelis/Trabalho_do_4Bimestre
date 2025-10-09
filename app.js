// Global Variables
let currentUser = null;
let movies = [];
let plans = [];
let isLoggedIn = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadMovies();
    loadPlans();
    setupEventListeners();
});

// Initialize application
function initializeApp() {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isLoggedIn = true;
        updateUIForLoggedInUser();
    }
    
    // Initialize database if not exists
    initializeDatabase();
}

// Database initialization (using localStorage for demo)
function initializeDatabase() {
    // Initialize users table
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    
    // Initialize movies table
    if (!localStorage.getItem('movies')) {
        const sampleMovies = [
            {
                id: 1,
                titulo: "Vingadores: Ultimato",
                sinopse: "Os heróis restantes se unem para desfazer as ações de Thanos e restaurar o equilíbrio do universo.",
                ano_lancamento: 2019,
                genero: "acao",
                url_poster: "https://via.placeholder.com/300x450/1a1a1a/e50914?text=Vingadores+Ultimato",
                url_video: "videos/sample1.mp4",
                rating: "9.2"
            },
            {
                id: 2,
                titulo: "Parasita",
                sinopse: "Uma família pobre se infiltra na vida de uma família rica com consequências inesperadas.",
                ano_lancamento: 2019,
                genero: "drama",
                url_poster: "https://via.placeholder.com/300x450/1a1a1a/e50914?text=Parasita",
                url_video: "videos/sample2.mp4",
                rating: "8.6"
            },
            {
                id: 3,
                titulo: "Coringa",
                sinopse: "A origem sombria do icônico vilão do Batman em uma Gotham City decadente.",
                ano_lancamento: 2019,
                genero: "drama",
                url_poster: "https://via.placeholder.com/300x450/1a1a1a/e50914?text=Coringa",
                url_video: "videos/sample3.mp4",
                rating: "8.4"
            },
            {
                id: 4,
                titulo: "Toy Story 4",
                sinopse: "Woody e seus amigos embarcam em uma nova aventura com novos brinquedos.",
                ano_lancamento: 2019,
                genero: "comedia",
                url_poster: "https://via.placeholder.com/300x450/1a1a1a/e50914?text=Toy+Story+4",
                url_video: "videos/sample4.mp4",
                rating: "7.8"
            },
            {
                id: 5,
                titulo: "It: Capítulo 2",
                sinopse: "O Clube dos Perdedores retorna para enfrentar Pennywise mais uma vez.",
                ano_lancamento: 2019,
                genero: "terror",
                url_poster: "https://via.placeholder.com/300x450/1a1a1a/e50914?text=It+Capitulo+2",
                url_video: "videos/sample5.mp4",
                rating: "6.5"
            },
            {
                id: 6,
                titulo: "Blade Runner 2049",
                sinopse: "Um jovem blade runner descobre um segredo que pode mergulhar a sociedade no caos.",
                ano_lancamento: 2017,
                genero: "ficcao",
                url_poster: "https://via.placeholder.com/300x450/1a1a1a/e50914?text=Blade+Runner+2049",
                url_video: "videos/sample6.mp4",
                rating: "8.0"
            }
        ];
        localStorage.setItem('movies', JSON.stringify(sampleMovies));
    }
    
    // Initialize plans table
    if (!localStorage.getItem('plans')) {
        const samplePlans = [
            {
                id: 1,
                nome: "Básico",
                preco: 19.90,
                qualidade_video: "HD",
                telas_simultaneas: 1,
                features: ["Qualidade HD", "1 tela simultânea", "Catálogo completo", "Sem anúncios"]
            },
            {
                id: 2,
                nome: "Padrão",
                preco: 29.90,
                qualidade_video: "Full HD",
                telas_simultaneas: 2,
                features: ["Qualidade Full HD", "2 telas simultâneas", "Catálogo completo", "Sem anúncios", "Download offline"]
            },
            {
                id: 3,
                nome: "Premium",
                preco: 39.90,
                qualidade_video: "4K Ultra HD",
                telas_simultaneas: 4,
                features: ["Qualidade 4K Ultra HD", "4 telas simultâneas", "Catálogo completo", "Sem anúncios", "Download offline", "Conteúdo exclusivo"]
            }
        ];
        localStorage.setItem('plans', JSON.stringify(samplePlans));
    }
}

// Load movies from database
function loadMovies() {
    movies = JSON.parse(localStorage.getItem('movies')) || [];
    displayFeaturedMovies();
    displayCatalogMovies(movies);
}

// Load plans from database
function loadPlans() {
    plans = JSON.parse(localStorage.getItem('plans')) || [];
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilter);
    });
    
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Authentication Functions
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        showMessage('Login realizado com sucesso!', 'success');
        closeModal('login-modal');
        updateUIForLoggedInUser();
    } else {
        showMessage('Email ou senha incorretos!', 'error');
    }
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    // Validation
    if (password !== confirmPassword) {
        showMessage('As senhas não coincidem!', 'error');
        return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        showMessage('Este email já está cadastrado!', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password, // In production, this should be hashed
        plano_id: null,
        data_criacao: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showMessage('Cadastro realizado com sucesso! Faça login para continuar.', 'success');
    closeModal('signup-modal');
    showLoginModal();
}

function logout() {
    currentUser = null;
    isLoggedIn = false;
    localStorage.removeItem('currentUser');
    updateUIForLoggedOutUser();
    showMessage('Logout realizado com sucesso!', 'success');
}

// UI Update Functions
function updateUIForLoggedInUser() {
    const navAuth = document.querySelector('.nav-auth');
    if (navAuth) {
        navAuth.innerHTML = `
            <span class="user-greeting">Olá, ${currentUser.name}</span>
            <button class="btn-login" onclick="logout()">Sair</button>
        `;
    }
}

function updateUIForLoggedOutUser() {
    const navAuth = document.querySelector('.nav-auth');
    if (navAuth) {
        navAuth.innerHTML = `
            <button class="btn-login" onclick="showLoginModal()">Entrar</button>
            <button class="btn-signup" onclick="showSignupModal()">Cadastrar</button>
        `;
    }
}

// Movie Display Functions
function displayFeaturedMovies() {
    const featuredContainer = document.getElementById('featured-movies');
    if (!featuredContainer) return;
    
    const featuredMovies = movies.slice(0, 6); // Show first 6 movies as featured
    
    featuredContainer.innerHTML = featuredMovies.map(movie => `
        <div class="movie-card" onclick="showMovieDetails(${movie.id})">
            <img src="${movie.url_poster}" alt="${movie.titulo}" class="movie-poster">
            <div class="movie-rating">${movie.rating}</div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.titulo}</h3>
                <p class="movie-year">${movie.ano_lancamento}</p>
                <p class="movie-genre">${getGenreName(movie.genero)}</p>
            </div>
        </div>
    `).join('');
}

function displayCatalogMovies(moviesToShow) {
    const catalogContainer = document.getElementById('catalog-movies');
    if (!catalogContainer) return;
    
    if (moviesToShow.length === 0) {
        catalogContainer.innerHTML = '<p class="text-center">Nenhum filme encontrado.</p>';
        return;
    }
    
    catalogContainer.innerHTML = moviesToShow.map(movie => `
        <div class="movie-card" onclick="showMovieDetails(${movie.id})">
            <img src="${movie.url_poster}" alt="${movie.titulo}" class="movie-poster">
            <div class="movie-rating">${movie.rating}</div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.titulo}</h3>
                <p class="movie-year">${movie.ano_lancamento}</p>
                <p class="movie-genre">${getGenreName(movie.genero)}</p>
            </div>
        </div>
    `).join('');
}

// Search and Filter Functions
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredMovies = movies.filter(movie => 
        movie.titulo.toLowerCase().includes(searchTerm) ||
        movie.sinopse.toLowerCase().includes(searchTerm)
    );
    displayCatalogMovies(filteredMovies);
}

function handleFilter(event) {
    const genre = event.target.getAttribute('data-genre');
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter movies
    let filteredMovies;
    if (genre === 'all') {
        filteredMovies = movies;
    } else {
        filteredMovies = movies.filter(movie => movie.genero === genre);
    }
    
    displayCatalogMovies(filteredMovies);
}

// Movie Details Functions
function showMovieDetails(movieId) {
    const movie = movies.find(m => m.id === movieId);
    if (!movie) return;
    
    const movieDetails = document.getElementById('movie-details');
    movieDetails.innerHTML = `
        <div class="movie-detail-content">
            <div class="movie-detail-poster">
                <img src="${movie.url_poster}" alt="${movie.titulo}">
            </div>
            <div class="movie-detail-info">
                <h2>${movie.titulo}</h2>
                <div class="movie-detail-meta">
                    <span class="movie-year">${movie.ano_lancamento}</span>
                    <span class="movie-genre">${getGenreName(movie.genero)}</span>
                    <span class="movie-rating">⭐ ${movie.rating}</span>
                </div>
                <p class="movie-synopsis">${movie.sinopse}</p>
                <div class="movie-actions">
                    ${isLoggedIn ? 
                        `<button class="btn-primary" onclick="playMovie(${movie.id})">▶ Assistir</button>` :
                        `<button class="btn-primary" onclick="showLoginModal()">Faça login para assistir</button>`
                    }
                    <button class="btn-secondary" onclick="addToWatchlist(${movie.id})">+ Minha Lista</button>
                </div>
            </div>
        </div>
    `;
    
    showModal('movie-modal');
}

function playMovie(movieId) {
    if (!isLoggedIn) {
        showMessage('Faça login para assistir aos filmes!', 'error');
        return;
    }
    
    const movie = movies.find(m => m.id === movieId);
    if (!movie) return;
    
    const videoPlayer = document.getElementById('video-player');
    const videoSource = videoPlayer.querySelector('source');
    
    // For demo purposes, we'll use a sample video URL
    // In production, this would be the actual movie file
    videoSource.src = `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;
    videoPlayer.load();
    
    closeModal('movie-modal');
    showModal('player-modal');
    
    // Start playing
    videoPlayer.play().catch(e => {
        console.log('Auto-play prevented:', e);
        showMessage('Clique no botão play para iniciar o vídeo.', 'info');
    });
}

function closePlayer() {
    const videoPlayer = document.getElementById('video-player');
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
    closeModal('player-modal');
}

// Plan Selection Functions
function selectPlan(planType) {
    if (!isLoggedIn) {
        showMessage('Faça login para selecionar um plano!', 'error');
        showLoginModal();
        return;
    }
    
    const plan = plans.find(p => p.nome.toLowerCase() === planType);
    if (!plan) return;
    
    // Simulate payment process
    const confirmPayment = confirm(`Confirmar assinatura do plano ${plan.nome} por R$ ${plan.preco.toFixed(2)}/mês?`);
    
    if (confirmPayment) {
        // Update user's plan
        currentUser.plano_id = plan.id;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update users database
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        showMessage(`Parabéns! Você agora tem o plano ${plan.nome}!`, 'success');
        scrollToSection('catalog');
    }
}

// Utility Functions
function getGenreName(genre) {
    const genreMap = {
        'acao': 'Ação',
        'drama': 'Drama',
        'comedia': 'Comédia',
        'terror': 'Terror',
        'ficcao': 'Ficção Científica'
    };
    return genreMap[genre] || genre;
}

function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at top of body
    document.body.insertBefore(messageDiv, document.body.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('mobile-active');
}

function addToWatchlist(movieId) {
    if (!isLoggedIn) {
        showMessage('Faça login para adicionar à sua lista!', 'error');
        return;
    }
    
    showMessage('Filme adicionado à sua lista!', 'success');
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function showLoginModal() {
    showModal('login-modal');
}

function showSignupModal() {
    showModal('signup-modal');
}

function switchModal(currentModalId, targetModalId) {
    closeModal(currentModalId);
    showModal(targetModalId);
}

// Admin Functions (for demo purposes)
function uploadMovie() {
    if (!isLoggedIn) {
        showMessage('Faça login para fazer upload de filmes!', 'error');
        return;
    }
    
    // This would typically be a more complex form
    const title = prompt('Título do filme:');
    const year = prompt('Ano de lançamento:');
    const genre = prompt('Gênero (acao, drama, comedia, terror, ficcao):');
    const synopsis = prompt('Sinopse:');
    
    if (title && year && genre && synopsis) {
        const newMovie = {
            id: Date.now(),
            titulo: title,
            sinopse: synopsis,
            ano_lancamento: parseInt(year),
            genero: genre,
            url_poster: `https://via.placeholder.com/300x450/1a1a1a/e50914?text=${encodeURIComponent(title)}`,
            url_video: 'videos/sample.mp4',
            rating: '8.0'
        };
        
        movies.push(newMovie);
        localStorage.setItem('movies', JSON.stringify(movies));
        
        displayFeaturedMovies();
        displayCatalogMovies(movies);
        
        showMessage('Filme adicionado com sucesso!', 'success');
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // ESC key to close modals
    if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal[style*="block"]');
        openModals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }
    
    // Space bar to play/pause video
    if (event.code === 'Space' && document.getElementById('player-modal').style.display === 'block') {
        event.preventDefault();
        const video = document.getElementById('video-player');
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        header.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// Initialize tooltips and other interactive elements
function initializeInteractiveElements() {
    // Add hover effects to movie cards
    const movieCards = document.querySelectorAll('.movie-card');
    movieCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Call initialization after DOM is loaded
document.addEventListener('DOMContentLoaded', initializeInteractiveElements);
