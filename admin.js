// Admin-specific JavaScript functionality

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin.html')) {
        initializeAdmin();
        loadDashboardStats();
        loadMoviesTable();
        loadUsersTable();
        setupAdminEventListeners();
    }
});

// Initialize admin functionality
function initializeAdmin() {
    // Check if user has admin privileges (simplified for demo)
    // In production, this would be properly authenticated
    console.log('Admin panel initialized');
}

// Setup admin-specific event listeners
function setupAdminEventListeners() {
    // Add movie form
    const addMovieForm = document.getElementById('add-movie-form');
    if (addMovieForm) {
        addMovieForm.addEventListener('submit', handleAddMovie);
    }
    
    // Edit movie form
    const editMovieForm = document.getElementById('edit-movie-form');
    if (editMovieForm) {
        editMovieForm.addEventListener('submit', handleEditMovie);
    }
    
    // File upload handling
    const videoFileInput = document.getElementById('movie-video');
    if (videoFileInput) {
        videoFileInput.addEventListener('change', handleVideoUpload);
    }
}

// Dashboard Statistics
function loadDashboardStats() {
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const plans = JSON.parse(localStorage.getItem('plans')) || [];
    
    // Calculate stats
    const totalMovies = movies.length;
    const totalUsers = users.length;
    const activeSubscriptions = users.filter(user => user.plano_id).length;
    
    // Calculate revenue (simplified)
    let totalRevenue = 0;
    users.forEach(user => {
        if (user.plano_id) {
            const plan = plans.find(p => p.id === user.plano_id);
            if (plan) {
                totalRevenue += plan.preco;
            }
        }
    });
    
    // Update UI
    document.getElementById('total-movies').textContent = totalMovies;
    document.getElementById('total-users').textContent = totalUsers;
    document.getElementById('total-revenue').textContent = `R$ ${totalRevenue.toFixed(2)}`;
    document.getElementById('active-subscriptions').textContent = activeSubscriptions;
}

// Movies Management
function loadMoviesTable() {
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    const tableBody = document.getElementById('movies-table-body');
    
    if (!tableBody) return;
    
    if (movies.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <div class="empty-state-icon">🎬</div>
                    <h3>Nenhum filme cadastrado</h3>
                    <p>Adicione seu primeiro filme para começar.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = movies.map(movie => `
        <tr>
            <td>${movie.id}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <img src="${movie.url_poster}" alt="${movie.titulo}" class="movie-poster-thumb">
                    <strong>${movie.titulo}</strong>
                </div>
            </td>
            <td>${movie.ano_lancamento}</td>
            <td><span class="plan-badge-admin plan-${movie.genero}">${getGenreName(movie.genero)}</span></td>
            <td>⭐ ${movie.rating}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editMovie(${movie.id})">✏️ Editar</button>
                    <button class="btn-delete" onclick="deleteMovie(${movie.id})">🗑️ Excluir</button>
                    <a href="index.html" class="btn-view" target="_blank">👁️ Ver</a>
                </div>
            </td>
        </tr>
    `).join('');
}

// Users Management
function loadUsersTable() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const plans = JSON.parse(localStorage.getItem('plans')) || [];
    const tableBody = document.getElementById('users-table-body');
    
    if (!tableBody) return;
    
    if (users.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <div class="empty-state-icon">👥</div>
                    <h3>Nenhum usuário cadastrado</h3>
                    <p>Os usuários aparecerão aqui quando se cadastrarem.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = users.map(user => {
        const plan = plans.find(p => p.id === user.plano_id);
        const planName = plan ? plan.nome : 'Nenhum';
        const planClass = plan ? `plan-${plan.nome.toLowerCase()}` : 'plan-none';
        const creationDate = new Date(user.data_criacao).toLocaleDateString('pt-BR');
        
        return `
            <tr>
                <td>${user.id}</td>
                <td><strong>${user.name}</strong></td>
                <td>${user.email}</td>
                <td><span class="plan-badge-admin ${planClass}">${planName}</span></td>
                <td>${creationDate}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="editUser(${user.id})">✏️ Editar</button>
                        <button class="btn-delete" onclick="deleteUser(${user.id})">🗑️ Excluir</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Add Movie Functionality
function showAddMovieModal() {
    showModal('add-movie-modal');
}

function handleAddMovie(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    
    // Get form values
    const title = formData.get('title');
    const year = parseInt(formData.get('year'));
    const genre = formData.get('genre');
    const rating = parseFloat(formData.get('rating'));
    const synopsis = formData.get('synopsis');
    const poster = formData.get('poster') || `https://via.placeholder.com/300x450/1a1a1a/e50914?text=${encodeURIComponent(title)}`;
    const videoUrl = formData.get('video-url') || 'videos/sample.mp4';
    
    // Create new movie object
    const newMovie = {
        id: Date.now(),
        titulo: title,
        sinopse: synopsis,
        ano_lancamento: year,
        genero: genre,
        url_poster: poster,
        url_video: videoUrl,
        rating: rating.toString(),
        data_upload: new Date().toISOString()
    };
    
    // Add to movies array
    movies.push(newMovie);
    localStorage.setItem('movies', JSON.stringify(movies));
    
    // Update UI
    loadMoviesTable();
    loadDashboardStats();
    closeModal('add-movie-modal');
    
    // Reset form
    event.target.reset();
    
    showMessage('Filme adicionado com sucesso!', 'success');
}

// Edit Movie Functionality
function editMovie(movieId) {
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    const movie = movies.find(m => m.id === movieId);
    
    if (!movie) {
        showMessage('Filme não encontrado!', 'error');
        return;
    }
    
    // Populate edit form
    document.getElementById('edit-movie-id').value = movie.id;
    document.getElementById('edit-movie-title').value = movie.titulo;
    document.getElementById('edit-movie-year').value = movie.ano_lancamento;
    document.getElementById('edit-movie-genre').value = movie.genero;
    document.getElementById('edit-movie-rating').value = movie.rating;
    document.getElementById('edit-movie-synopsis').value = movie.sinopse;
    document.getElementById('edit-movie-poster').value = movie.url_poster;
    
    showModal('edit-movie-modal');
}

function handleEditMovie(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    const movieId = parseInt(formData.get('id'));
    
    // Find movie index
    const movieIndex = movies.findIndex(m => m.id === movieId);
    if (movieIndex === -1) {
        showMessage('Filme não encontrado!', 'error');
        return;
    }
    
    // Update movie data
    movies[movieIndex] = {
        ...movies[movieIndex],
        titulo: formData.get('title'),
        ano_lancamento: parseInt(formData.get('year')),
        genero: formData.get('genre'),
        rating: parseFloat(formData.get('rating')).toString(),
        sinopse: formData.get('synopsis'),
        url_poster: formData.get('poster') || movies[movieIndex].url_poster
    };
    
    // Save to localStorage
    localStorage.setItem('movies', JSON.stringify(movies));
    
    // Update UI
    loadMoviesTable();
    closeModal('edit-movie-modal');
    
    showMessage('Filme atualizado com sucesso!', 'success');
}

// Delete Movie Functionality
function deleteMovie(movieId) {
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    const movie = movies.find(m => m.id === movieId);
    
    if (!movie) {
        showMessage('Filme não encontrado!', 'error');
        return;
    }
    
    if (confirm(`Tem certeza que deseja excluir o filme "${movie.titulo}"?`)) {
        const updatedMovies = movies.filter(m => m.id !== movieId);
        localStorage.setItem('movies', JSON.stringify(updatedMovies));
        
        loadMoviesTable();
        loadDashboardStats();
        
        showMessage('Filme excluído com sucesso!', 'success');
    }
}

// User Management Functions
function editUser(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        showMessage('Usuário não encontrado!', 'error');
        return;
    }
    
    // Simple edit functionality - in production this would be a proper modal
    const newName = prompt('Novo nome:', user.name);
    if (newName && newName !== user.name) {
        user.name = newName;
        
        const userIndex = users.findIndex(u => u.id === userId);
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
        
        loadUsersTable();
        showMessage('Usuário atualizado com sucesso!', 'success');
    }
}

function deleteUser(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        showMessage('Usuário não encontrado!', 'error');
        return;
    }
    
    if (confirm(`Tem certeza que deseja excluir o usuário "${user.name}"?`)) {
        const updatedUsers = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        loadUsersTable();
        loadDashboardStats();
        
        showMessage('Usuário excluído com sucesso!', 'success');
    }
}

// File Upload Handling
function handleVideoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('video/')) {
        showMessage('Por favor, selecione um arquivo de vídeo válido.', 'error');
        event.target.value = '';
        return;
    }
    
    // Validate file size (max 500MB for demo)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
        showMessage('O arquivo é muito grande. Tamanho máximo: 500MB.', 'error');
        event.target.value = '';
        return;
    }
    
    // In a real application, you would upload the file to a server
    // For this demo, we'll just show a success message
    showMessage(`Arquivo "${file.name}" selecionado com sucesso!`, 'success');
    
    // Disable the URL input when a file is selected
    const urlInput = document.getElementById('movie-video-url');
    if (urlInput) {
        urlInput.disabled = true;
        urlInput.placeholder = 'Arquivo de vídeo selecionado';
    }
}

// Utility Functions for Admin
function exportData() {
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const plans = JSON.parse(localStorage.getItem('plans')) || [];
    
    const data = {
        movies,
        users: users.map(user => ({...user, password: '[HIDDEN]'})), // Hide passwords
        plans,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `cineflix-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showMessage('Dados exportados com sucesso!', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.movies) localStorage.setItem('movies', JSON.stringify(data.movies));
                if (data.users) localStorage.setItem('users', JSON.stringify(data.users));
                if (data.plans) localStorage.setItem('plans', JSON.stringify(data.plans));
                
                // Reload all data
                loadDashboardStats();
                loadMoviesTable();
                loadUsersTable();
                
                showMessage('Dados importados com sucesso!', 'success');
            } catch (error) {
                showMessage('Erro ao importar dados. Verifique o arquivo.', 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Search and Filter Functions for Admin Tables
function searchMovies(query) {
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    const filteredMovies = movies.filter(movie => 
        movie.titulo.toLowerCase().includes(query.toLowerCase()) ||
        movie.genero.toLowerCase().includes(query.toLowerCase())
    );
    
    // Update table with filtered results
    displayFilteredMovies(filteredMovies);
}

function searchUsers(query) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );
    
    // Update table with filtered results
    displayFilteredUsers(filteredUsers);
}

// Batch Operations
function selectAllMovies() {
    const checkboxes = document.querySelectorAll('.movie-checkbox');
    checkboxes.forEach(checkbox => checkbox.checked = true);
}

function deleteSelectedMovies() {
    const checkboxes = document.querySelectorAll('.movie-checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    if (selectedIds.length === 0) {
        showMessage('Nenhum filme selecionado.', 'error');
        return;
    }
    
    if (confirm(`Excluir ${selectedIds.length} filme(s) selecionado(s)?`)) {
        const movies = JSON.parse(localStorage.getItem('movies')) || [];
        const updatedMovies = movies.filter(movie => !selectedIds.includes(movie.id));
        
        localStorage.setItem('movies', JSON.stringify(updatedMovies));
        loadMoviesTable();
        loadDashboardStats();
        
        showMessage(`${selectedIds.length} filme(s) excluído(s) com sucesso!`, 'success');
    }
}

// Analytics Functions
function generateReport() {
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const plans = JSON.parse(localStorage.getItem('plans')) || [];
    
    // Generate basic analytics
    const genreCount = {};
    movies.forEach(movie => {
        genreCount[movie.genero] = (genreCount[movie.genero] || 0) + 1;
    });
    
    const planCount = {};
    users.forEach(user => {
        if (user.plano_id) {
            const plan = plans.find(p => p.id === user.plano_id);
            if (plan) {
                planCount[plan.nome] = (planCount[plan.nome] || 0) + 1;
            }
        }
    });
    
    console.log('Relatório de Analytics:', {
        totalMovies: movies.length,
        totalUsers: users.length,
        genreDistribution: genreCount,
        planDistribution: planCount
    });
    
    showMessage('Relatório gerado no console!', 'success');
}

// Auto-refresh functionality
let autoRefreshInterval;

function startAutoRefresh() {
    autoRefreshInterval = setInterval(() => {
        loadDashboardStats();
        loadMoviesTable();
        loadUsersTable();
    }, 30000); // Refresh every 30 seconds
    
    showMessage('Auto-refresh ativado (30s)', 'success');
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
        showMessage('Auto-refresh desativado', 'success');
    }
}
