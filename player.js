// Advanced Video Player JavaScript

let video = null;
let controlsOverlay = null;
let controlsTimeout = null;
let isPlaying = false;
let isMuted = false;
let isFullscreen = false;
let currentVolume = 1;
let currentTime = 0;
let duration = 0;
let currentMovie = null;
let watchProgress = {};

// Initialize player
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('player.html')) {
        initializePlayer();
        loadMovieFromURL();
        setupPlayerEventListeners();
        setupKeyboardShortcuts();
    }
});

// Initialize player components
function initializePlayer() {
    video = document.getElementById('main-video');
    controlsOverlay = document.getElementById('controls-overlay');
    
    if (!video || !controlsOverlay) {
        console.error('Player elements not found');
        return;
    }
    
    // Set initial volume
    video.volume = currentVolume;
    
    // Load watch progress from localStorage
    watchProgress = JSON.parse(localStorage.getItem('watchProgress')) || {};
    
    // Show controls initially
    showControls();
    
    // Hide controls after 3 seconds of inactivity
    resetControlsTimeout();
}

// Load movie data from URL parameters
function loadMovieFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    
    if (movieId) {
        loadMovie(parseInt(movieId));
    } else {
        // Load default movie for demo
        loadMovie(1);
    }
}

// Load movie data and setup player
function loadMovie(movieId) {
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    currentMovie = movies.find(m => m.id === movieId);
    
    if (!currentMovie) {
        showError('Filme não encontrado');
        return;
    }
    
    // Update UI with movie info
    updateMovieInfo();
    
    // Set video source
    setupVideoSource();
    
    // Load related movies
    loadRelatedMovies();
    
    // Resume from last position if available
    resumeFromLastPosition();
}

// Update movie information in UI
function updateMovieInfo() {
    if (!currentMovie) return;
    
    // Update header
    document.getElementById('movie-title-header').textContent = currentMovie.titulo;
    document.getElementById('movie-year-header').textContent = currentMovie.ano_lancamento;
    document.getElementById('movie-genre-header').textContent = getGenreName(currentMovie.genero);
    document.getElementById('movie-rating-header').textContent = `⭐ ${currentMovie.rating}`;
    
    // Update info panel
    document.getElementById('movie-title-info').textContent = currentMovie.titulo;
    document.getElementById('movie-year-info').textContent = currentMovie.ano_lancamento;
    document.getElementById('movie-genre-info').textContent = getGenreName(currentMovie.genero);
    document.getElementById('movie-rating-info').textContent = `⭐ ${currentMovie.rating}`;
    document.getElementById('movie-synopsis-info').textContent = currentMovie.sinopse;
    document.getElementById('movie-poster-img').src = currentMovie.url_poster;
    document.getElementById('movie-poster-img').alt = currentMovie.titulo;
    
    // Update page title
    document.title = `${currentMovie.titulo} - CineFlix Player`;
}

// Setup video source and tracks
function setupVideoSource() {
    if (!currentMovie || !video) return;
    
    // For demo purposes, use a sample video
    const videoSource = video.querySelector('source');
    videoSource.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    
    // Setup subtitle tracks (demo)
    const subtitleTracks = video.querySelectorAll('track');
    subtitleTracks.forEach(track => {
        track.src = ''; // In production, this would be actual subtitle files
    });
    
    // Load the video
    video.load();
}

// Setup player event listeners
function setupPlayerEventListeners() {
    if (!video) return;
    
    // Video events
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    
    // Controls events
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.addEventListener('click', handleProgressClick);
        progressBar.addEventListener('mousemove', handleProgressHover);
    }
    
    const volumeRange = document.getElementById('volume-range');
    if (volumeRange) {
        volumeRange.addEventListener('input', handleVolumeChange);
    }
    
    // Quality and speed menu events
    setupMenuEvents();
    
    // Mouse movement for controls
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleDocumentClick);
    
    // Touch events for mobile
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
}

// Video event handlers
function handleLoadStart() {
    showLoading();
}

function handleLoadedMetadata() {
    duration = video.duration;
    updateTimeDisplay();
}

function handleLoadedData() {
    hideLoading();
}

function handleCanPlay() {
    hideLoading();
    hideError();
}

function handlePlay() {
    isPlaying = true;
    updatePlayPauseButtons();
    saveWatchProgress();
}

function handlePause() {
    isPlaying = false;
    updatePlayPauseButtons();
    saveWatchProgress();
}

function handleTimeUpdate() {
    currentTime = video.currentTime;
    updateProgressBar();
    updateTimeDisplay();
    
    // Save progress every 10 seconds
    if (Math.floor(currentTime) % 10 === 0) {
        saveWatchProgress();
    }
}

function handleProgress() {
    updateBufferBar();
}

function handleEnded() {
    isPlaying = false;
    updatePlayPauseButtons();
    saveWatchProgress();
    showRelatedMovies();
}

function handleError(event) {
    console.error('Video error:', event);
    showError('Erro ao carregar o vídeo');
}

function handleWaiting() {
    showBuffering();
}

function handlePlaying() {
    hideBuffering();
}

// Control functions
function togglePlayPause() {
    if (!video) return;
    
    if (isPlaying) {
        video.pause();
    } else {
        video.play().catch(e => {
            console.error('Play failed:', e);
            showMessage('Erro ao reproduzir vídeo', 'error');
        });
    }
}

function skipBackward() {
    if (!video) return;
    video.currentTime = Math.max(0, video.currentTime - 10);
}

function skipForward() {
    if (!video) return;
    video.currentTime = Math.min(duration, video.currentTime + 10);
}

function toggleMute() {
    if (!video) return;
    
    if (isMuted) {
        video.volume = currentVolume;
        isMuted = false;
    } else {
        currentVolume = video.volume;
        video.volume = 0;
        isMuted = true;
    }
    
    updateVolumeControls();
}

function handleVolumeChange(event) {
    if (!video) return;
    
    const volume = event.target.value / 100;
    video.volume = volume;
    currentVolume = volume;
    isMuted = volume === 0;
    
    updateVolumeControls();
}

function updateVolumeControls() {
    const volumeIcon = document.querySelector('.volume-icon');
    const muteIcon = document.querySelector('.mute-icon');
    const volumeRange = document.getElementById('volume-range');
    
    if (isMuted || video.volume === 0) {
        volumeIcon.style.display = 'none';
        muteIcon.style.display = 'inline';
    } else {
        volumeIcon.style.display = 'inline';
        muteIcon.style.display = 'none';
    }
    
    if (volumeRange) {
        volumeRange.value = video.volume * 100;
    }
}

// Progress bar functions
function handleProgressClick(event) {
    if (!video || !duration) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    video.currentTime = newTime;
}

function handleProgressHover(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const hoverX = event.clientX - rect.left;
    const percentage = hoverX / rect.width;
    const hoverTime = percentage * duration;
    
    // Show time tooltip (could be implemented)
    // showTimeTooltip(hoverTime, event.clientX, event.clientY);
}

function updateProgressBar() {
    if (!duration) return;
    
    const percentage = (currentTime / duration) * 100;
    const progressPlayed = document.getElementById('progress-played');
    const progressThumb = document.getElementById('progress-thumb');
    
    if (progressPlayed) {
        progressPlayed.style.width = `${percentage}%`;
    }
    
    if (progressThumb) {
        progressThumb.style.left = `${percentage}%`;
    }
}

function updateBufferBar() {
    if (!video || !duration) return;
    
    const buffered = video.buffered;
    if (buffered.length > 0) {
        const bufferedEnd = buffered.end(buffered.length - 1);
        const percentage = (bufferedEnd / duration) * 100;
        const progressBuffer = document.getElementById('progress-buffer');
        
        if (progressBuffer) {
            progressBuffer.style.width = `${percentage}%`;
        }
    }
}

function updateTimeDisplay() {
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    
    if (currentTimeEl) {
        currentTimeEl.textContent = formatTime(currentTime);
    }
    
    if (totalTimeEl && duration) {
        totalTimeEl.textContent = formatTime(duration);
    }
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

// Play/Pause button updates
function updatePlayPauseButtons() {
    const playIcons = document.querySelectorAll('.play-icon');
    const pauseIcons = document.querySelectorAll('.pause-icon');
    
    if (isPlaying) {
        playIcons.forEach(icon => icon.style.display = 'none');
        pauseIcons.forEach(icon => icon.style.display = 'inline');
    } else {
        playIcons.forEach(icon => icon.style.display = 'inline');
        pauseIcons.forEach(icon => icon.style.display = 'none');
    }
}

// Fullscreen functions
function toggleFullscreen() {
    const container = document.getElementById('video-container');
    
    if (!isFullscreen) {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
            container.mozRequestFullScreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
    }
}

// Listen for fullscreen changes
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
    
    const fullscreenIcon = document.querySelector('.fullscreen-icon');
    const exitFullscreenIcon = document.querySelector('.exit-fullscreen-icon');
    
    if (isFullscreen) {
        fullscreenIcon.style.display = 'none';
        exitFullscreenIcon.style.display = 'inline';
    } else {
        fullscreenIcon.style.display = 'inline';
        exitFullscreenIcon.style.display = 'none';
    }
}

// Picture-in-Picture
function togglePictureInPicture() {
    if (!video) return;
    
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
    } else {
        video.requestPictureInPicture().catch(error => {
            console.error('PiP failed:', error);
            showMessage('Picture-in-Picture não suportado', 'error');
        });
    }
}

// Quality and Speed menus
function setupMenuEvents() {
    // Quality menu
    const qualityOptions = document.querySelectorAll('.quality-option');
    qualityOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectQuality(this.dataset.quality);
        });
    });
    
    // Speed menu
    const speedOptions = document.querySelectorAll('.speed-option');
    speedOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectSpeed(parseFloat(this.dataset.speed));
        });
    });
}

function toggleQualityMenu() {
    const menu = document.getElementById('quality-menu');
    menu.classList.toggle('show');
    
    // Close speed menu if open
    document.getElementById('speed-menu').classList.remove('show');
}

function toggleSpeedMenu() {
    const menu = document.getElementById('speed-menu');
    menu.classList.toggle('show');
    
    // Close quality menu if open
    document.getElementById('quality-menu').classList.remove('show');
}

function selectQuality(quality) {
    // Update active quality option
    document.querySelectorAll('.quality-option').forEach(option => {
        option.classList.remove('active');
    });
    
    document.querySelector(`[data-quality="${quality}"]`).classList.add('active');
    
    // In a real implementation, this would switch video quality
    console.log('Quality changed to:', quality);
    
    // Close menu
    document.getElementById('quality-menu').classList.remove('show');
    
    showMessage(`Qualidade alterada para ${quality}`, 'success');
}

function selectSpeed(speed) {
    if (!video) return;
    
    video.playbackRate = speed;
    
    // Update active speed option
    document.querySelectorAll('.speed-option').forEach(option => {
        option.classList.remove('active');
    });
    
    document.querySelector(`[data-speed="${speed}"]`).classList.add('active');
    
    // Update speed button text
    document.querySelector('.speed-selector .control-icon').textContent = `${speed}x`;
    
    // Close menu
    document.getElementById('speed-menu').classList.remove('show');
}

// Subtitles
function toggleSubtitles() {
    if (!video) return;
    
    const tracks = video.textTracks;
    
    if (tracks.length > 0) {
        const track = tracks[0];
        
        if (track.mode === 'showing') {
            track.mode = 'hidden';
            showMessage('Legendas desativadas', 'success');
        } else {
            track.mode = 'showing';
            showMessage('Legendas ativadas', 'success');
        }
    } else {
        showMessage('Nenhuma legenda disponível', 'error');
    }
}

// Controls visibility
function showControls() {
    if (controlsOverlay) {
        controlsOverlay.classList.add('show');
        document.body.style.cursor = 'default';
    }
    
    const playerHeader = document.querySelector('.player-header');
    if (playerHeader) {
        playerHeader.style.opacity = '1';
    }
}

function hideControls() {
    if (controlsOverlay && isPlaying) {
        controlsOverlay.classList.remove('show');
        document.body.style.cursor = 'none';
    }
    
    const playerHeader = document.querySelector('.player-header');
    if (playerHeader && isPlaying) {
        playerHeader.style.opacity = '0';
    }
}

function resetControlsTimeout() {
    clearTimeout(controlsTimeout);
    showControls();
    
    controlsTimeout = setTimeout(() => {
        hideControls();
    }, 3000);
}

// Mouse and touch events
function handleMouseMove() {
    resetControlsTimeout();
}

function handleDocumentClick(event) {
    // Close menus when clicking outside
    if (!event.target.closest('.quality-selector')) {
        document.getElementById('quality-menu').classList.remove('show');
    }
    
    if (!event.target.closest('.speed-selector')) {
        document.getElementById('speed-menu').classList.remove('show');
    }
}

function handleTouchStart() {
    resetControlsTimeout();
}

function handleTouchMove() {
    resetControlsTimeout();
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Prevent default for video-related keys
        const videoKeys = ['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyF', 'KeyM', 'KeyC'];
        
        if (videoKeys.includes(event.code)) {
            event.preventDefault();
        }
        
        switch (event.code) {
            case 'Space':
                togglePlayPause();
                break;
            case 'ArrowLeft':
                skipBackward();
                break;
            case 'ArrowRight':
                skipForward();
                break;
            case 'ArrowUp':
                changeVolume(0.1);
                break;
            case 'ArrowDown':
                changeVolume(-0.1);
                break;
            case 'KeyF':
                toggleFullscreen();
                break;
            case 'KeyM':
                toggleMute();
                break;
            case 'KeyC':
                toggleSubtitles();
                break;
            case 'Slash':
            case 'Question':
                if (event.shiftKey) {
                    showShortcuts();
                }
                break;
            case 'Escape':
                hideShortcuts();
                break;
        }
    });
}

function changeVolume(delta) {
    if (!video) return;
    
    const newVolume = Math.max(0, Math.min(1, video.volume + delta));
    video.volume = newVolume;
    currentVolume = newVolume;
    isMuted = newVolume === 0;
    
    updateVolumeControls();
    
    // Show volume indicator
    showMessage(`Volume: ${Math.round(newVolume * 100)}%`, 'info');
}

// Loading and error states
function showLoading() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'block';
    }
    
    const container = document.getElementById('video-container');
    if (container) {
        container.classList.add('loading');
    }
}

function hideLoading() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
    
    const container = document.getElementById('video-container');
    if (container) {
        container.classList.remove('loading');
    }
}

function showBuffering() {
    const container = document.getElementById('video-container');
    if (container) {
        container.classList.add('buffering');
    }
}

function hideBuffering() {
    const container = document.getElementById('video-container');
    if (container) {
        container.classList.remove('buffering');
    }
}

function showError(message) {
    const errorEl = document.getElementById('error-message');
    if (errorEl) {
        errorEl.style.display = 'block';
        errorEl.querySelector('p').textContent = message;
    }
}

function hideError() {
    const errorEl = document.getElementById('error-message');
    if (errorEl) {
        errorEl.style.display = 'none';
    }
}

function retryVideo() {
    hideError();
    if (video) {
        video.load();
    }
}

// Watch progress
function saveWatchProgress() {
    if (!currentMovie || !video) return;
    
    watchProgress[currentMovie.id] = {
        currentTime: video.currentTime,
        duration: video.duration,
        timestamp: Date.now()
    };
    
    localStorage.setItem('watchProgress', JSON.stringify(watchProgress));
}

function resumeFromLastPosition() {
    if (!currentMovie || !video) return;
    
    const progress = watchProgress[currentMovie.id];
    if (progress && progress.currentTime > 30) { // Only resume if more than 30 seconds
        const shouldResume = confirm(`Continuar de onde parou? (${formatTime(progress.currentTime)})`);
        if (shouldResume) {
            video.currentTime = progress.currentTime;
        }
    }
}

// Related movies
function loadRelatedMovies() {
    if (!currentMovie) return;
    
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    const relatedMovies = movies
        .filter(m => m.id !== currentMovie.id && m.genero === currentMovie.genero)
        .slice(0, 6);
    
    const relatedGrid = document.getElementById('related-grid');
    if (relatedGrid) {
        relatedGrid.innerHTML = relatedMovies.map(movie => `
            <div class="related-movie" onclick="playRelatedMovie(${movie.id})">
                <img src="${movie.url_poster}" alt="${movie.titulo}">
                <div class="related-movie-info">
                    <div class="related-movie-title">${movie.titulo}</div>
                    <div class="related-movie-meta">${movie.ano_lancamento} • ⭐ ${movie.rating}</div>
                </div>
            </div>
        `).join('');
    }
}

function showRelatedMovies() {
    const relatedSection = document.getElementById('related-movies');
    if (relatedSection) {
        relatedSection.classList.add('show');
    }
}

function playRelatedMovie(movieId) {
    window.location.href = `player.html?id=${movieId}`;
}

// Navigation functions
function goBack() {
    // Save progress before leaving
    saveWatchProgress();
    
    // Go back to previous page or catalog
    if (document.referrer) {
        window.history.back();
    } else {
        window.location.href = 'index.html#catalog';
    }
}

function resumeWatching() {
    if (video) {
        video.play();
        showControls();
    }
}

// Additional features
function toggleWatchlist() {
    if (!currentMovie) return;
    
    // Add to watchlist logic
    showMessage('Adicionado à sua lista!', 'success');
}

function shareMovie() {
    if (!currentMovie) return;
    
    if (navigator.share) {
        navigator.share({
            title: currentMovie.titulo,
            text: currentMovie.sinopse,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showMessage('Link copiado para a área de transferência!', 'success');
        });
    }
}

function downloadMovie() {
    if (!currentMovie) return;
    
    // In a real app, this would initiate download
    showMessage('Download iniciado! Verifique suas notificações.', 'success');
}

// Shortcuts help
function showShortcuts() {
    const shortcutsHelp = document.getElementById('shortcuts-help');
    if (shortcutsHelp) {
        shortcutsHelp.style.display = 'flex';
    }
}

function hideShortcuts() {
    const shortcutsHelp = document.getElementById('shortcuts-help');
    if (shortcutsHelp) {
        shortcutsHelp.style.display = 'none';
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    saveWatchProgress();
});
