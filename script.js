// Variables
let loadingProgress = 0;
let currentTipIndex = 0;
let audioPlayer = null;
let isMusicPlaying = false;
let lastRealProgressTime = null;

// DOM Elements
const progressBar = document.querySelector('.progress-bar');
const loadingPercentage = document.getElementById('loading-percentage');
const loadingStatus = document.getElementById('loading-status');
const tipContent = document.getElementById('tip-content');
const musicToggle = document.getElementById('music-toggle');
const musicTitle = document.getElementById('music-title');
const keybindsGrid = document.getElementById('keybinds-grid');

// Initialize loading screen
document.addEventListener('DOMContentLoaded', () => {
    initializeLoadingScreen();
    initializeTips();
    initializeMusic();
    initializeKeybinds();
    initializeServerInfo();
    applyBackgroundSettings();
    initializeExpandablePanels();
    displayChangelogs();
});

// Initialize loading screen
function initializeLoadingScreen() {
    // Set initial progress
    loadingProgress = 0;
    updateLoadingProgress();
    
    // Only use a very slow simulation as fallback
    const loadingInterval = setInterval(() => {
        // Only increment if we haven't received real loading data in a while
        if (!lastRealProgressTime || (Date.now() - lastRealProgressTime > 5000)) {
            // Very slow increment that won't get ahead of real progress
            loadingProgress += 0.05;
            loadingProgress = Math.min(loadingProgress, 70); // Cap at 70% for simulation
            updateLoadingProgress();
        }
        
        // Clear interval when loading is complete
        if (loadingProgress >= 100) {
            clearInterval(loadingInterval);
            loadingComplete();
        }
    }, 500);
    
    // Listen for actual loading events from FiveM
    window.addEventListener('message', function(event) {
        if (event.data.eventName === 'loadProgress') {
            // Record when we received real progress data
            lastRealProgressTime = Date.now();
            
            // Convert load fraction to percentage (0-100)
            const realProgress = event.data.loadFraction * 100;
            
            // Always use the real progress from FiveM
            loadingProgress = realProgress;
            updateLoadingProgress(event.data.loadingText || null);
            
            // If loading is complete
            if (realProgress >= 100) {
                clearInterval(loadingInterval);
                loadingComplete();
            }
        }
    });
}

// Update loading progress
function updateLoadingProgress(statusText = null) {
    // Update UI with smoother animation
    progressBar.style.transition = 'width 0.3s ease';
    progressBar.style.width = `${loadingProgress}%`;
    loadingPercentage.textContent = `${Math.floor(loadingProgress)}%`;
    
    // Update status text based on progress or use FiveM's status text
    if (statusText) {
        loadingStatus.textContent = statusText;
    } else if (loadingProgress < 20) {
        loadingStatus.textContent = 'Connecting to server...';
    } else if (loadingProgress < 40) {
        loadingStatus.textContent = 'Loading game assets...';
    } else if (loadingProgress < 60) {
        loadingStatus.textContent = 'Initializing scripts...';
    } else if (loadingProgress < 80) {
        loadingStatus.textContent = 'Preparing world...';
    } else if (loadingProgress < 100) {
        loadingStatus.textContent = 'Almost ready...';
    } else {
        loadingStatus.textContent = config.loadingScreen.completeText || 'Welcome to Crescent City!';
    }
}

// Apply background settings from config
function applyBackgroundSettings() {
    if (config.visual && config.visual.background) {
        const bgConfig = config.visual.background;
        
        if (bgConfig.useCustomBackground && bgConfig.customBackgroundPath) {
            console.log('Loading background from:', bgConfig.customBackgroundPath);
            
            // Create a new image element for the background
            const bgImage = new Image();
            bgImage.onload = function() {
                console.log('Background image loaded successfully');
                // Apply the background directly to the body
                document.body.style.backgroundImage = `url('${bgConfig.customBackgroundPath}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundRepeat = 'no-repeat';
            };
            
            bgImage.onerror = function() {
                console.error('Failed to load background image');
                // Fallback to a solid color
                document.body.style.backgroundColor = '#121212';
            };
            
            bgImage.src = bgConfig.customBackgroundPath;
            
            // Also apply to the background div as a fallback
            const backgroundElement = document.querySelector('.background');
            if (backgroundElement) {
                backgroundElement.style.backgroundImage = `url('${bgConfig.customBackgroundPath}')`;
            }
        }
    }
}

// Initialize server information display
function initializeServerInfo() {
    if (config.serverInfo) {
        // Update server name and tagline
        updateServerNameAndTagline();
        
        // Initialize player count
        updatePlayerCount();
        
        // Set up announcements
        displayAnnouncements();
        
        // Display server rules
        displayServerRules();
    }
}

// Update server name and tagline from config
function updateServerNameAndTagline() {
    const serverNameElement = document.querySelector('.server-name');
    const taglineElement = document.querySelector('.tagline');
    
    if (serverNameElement && config.serverName) {
        serverNameElement.textContent = config.serverName;
    }
    
    if (taglineElement && config.serverTagline) {
        taglineElement.textContent = config.serverTagline;
    }
}

// Update player count information
function updatePlayerCount() {
    const playerCountElement = document.getElementById('player-count');
    
    if (playerCountElement) {
        // Fetch real player count from FiveM API
        fetchServerInfo('g7kr7z')
            .then(serverInfo => {
                if (serverInfo) {
                    const current = serverInfo.clients;
                    const max = serverInfo.sv_maxclients;
                    playerCountElement.textContent = `${current}/${max} Players`;
                    
                    // Update periodically if enabled
                    if (config.serverInfo.livePlayerCount) {
                        setInterval(() => {
                            fetchServerInfo('g7kr7z')
                                .then(updatedInfo => {
                                    if (updatedInfo) {
                                        playerCountElement.textContent = `${updatedInfo.clients}/${updatedInfo.sv_maxclients} Players`;
                                    }
                                });
                        }, 60000); // Update every minute
                    }
                } else {
                    // Fallback to config values if API fails
                    const { current, max } = config.serverInfo.playerCount;
                    playerCountElement.textContent = `${current}/${max} Players`;
                }
            })
            .catch(() => {
                // Fallback to config values if API fails
                const { current, max } = config.serverInfo.playerCount;
                playerCountElement.textContent = `${current}/${max} Players`;
            });
    }
}

// Function to fetch server info from FiveM API
function fetchServerInfo(joinCode) {
    return new Promise((resolve, reject) => {
        fetch(`https://servers-frontend.fivem.net/api/servers/single/${joinCode}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.Data) {
                    resolve(data.Data);
                } else {
                    reject('Invalid server data');
                }
            })
            .catch(error => {
                console.error('Error fetching server info:', error);
                reject(error);
            });
    });
}

// Display server announcements
function displayAnnouncements() {
    const announcementsElement = document.getElementById('announcements');
    
    if (announcementsElement && config.serverInfo.announcements && config.serverInfo.announcements.length > 0) {
        announcementsElement.innerHTML = '';
        
        // Add each announcement
        config.serverInfo.announcements.forEach(announcement => {
            const announcementItem = document.createElement('div');
            announcementItem.className = 'announcement-item';
            
            announcementItem.innerHTML = `
                <div class="announcement-title">${announcement.title}</div>
                <div class="announcement-content">${announcement.content}</div>
            `;
            
            announcementsElement.appendChild(announcementItem);
        });
    }
}

// Display server rules
function displayServerRules() {
    const rulesElement = document.getElementById('server-rules');
    
    if (rulesElement && config.serverInfo.rules && config.serverInfo.rules.length > 0) {
        rulesElement.innerHTML = '';
        
        // Add title
        const rulesTitle = document.createElement('div');
        rulesTitle.className = 'rules-title';
        rulesTitle.textContent = 'SERVER RULES';
        rulesElement.appendChild(rulesTitle);
        
        // Add each rule
        config.serverInfo.rules.forEach((rule, index) => {
            const ruleElement = document.createElement('div');
            ruleElement.className = 'rule-item';
            ruleElement.innerHTML = `<span class="rule-number">${index + 1}.</span> ${rule}`;
            rulesElement.appendChild(ruleElement);
        });
    }
}

// Loading complete
function loadingComplete() {
    loadingStatus.textContent = config.loadingScreen.completeText || 'Welcome to Crescent City!';
    
    // Add a slight delay before potentially hiding the loading screen
    setTimeout(() => {
        // In a real implementation, you might want to signal to the game that loading is complete
        // or wait for the game to tell you to hide the loading screen
    }, 1000);
}

// Initialize tips rotation
function initializeTips() {
    // Display first tip
    displayTip();
    
    // Rotate tips every 8 seconds
    setInterval(displayTip, 8000);
}

// Display a tip
function displayTip() {
    // Fade out current tip
    tipContent.style.opacity = 0;
    
    // After fade out, change content and fade in
    setTimeout(() => {
        tipContent.textContent = config.tips[currentTipIndex];
        tipContent.style.opacity = 1;
        
        // Move to next tip
        currentTipIndex = (currentTipIndex + 1) % config.tips.length;
    }, 500);
}

// Initialize keybinds display
function initializeKeybinds() {
    if (config.keybinds && keybindsGrid) {
        // Clear any existing content
        keybindsGrid.innerHTML = '';
        
        // Add each keybind to the grid
        config.keybinds.forEach(keybind => {
            // Create container for key-action pair
            const keybindItem = document.createElement('div');
            keybindItem.className = 'keybind-item';
            
            // Create key element
            const keyElement = document.createElement('div');
            keyElement.className = 'keybind-key';
            keyElement.textContent = keybind.key;
            
            // Create action element
            const actionElement = document.createElement('div');
            actionElement.className = 'keybind-action';
            actionElement.textContent = keybind.action;
            
            // Add elements to the container
            keybindItem.appendChild(keyElement);
            keybindItem.appendChild(actionElement);
            
            // Add container to the grid
            keybindsGrid.appendChild(keybindItem);
        });
    }
}

// Initialize background music
function initializeMusic() {
    if (config.music && config.music.enabled) {
        // Create audio element
        audioPlayer = new Audio(config.music.url);
        audioPlayer.volume = config.music.volume;
        audioPlayer.loop = true;
        
        // Update music title
        if (config.music.title) {
            musicTitle.textContent = config.music.title;
        }
        
        // Setup music toggle button
        musicToggle.addEventListener('click', toggleMusic);
        
        // Auto-play music if configured
        if (config.music.autoplay) {
            // We need to wait for user interaction due to browser policies
            document.addEventListener('click', function startMusic() {
                if (!isMusicPlaying) {
                    toggleMusic();
                    document.removeEventListener('click', startMusic);
                }
            });
        }
    } else {
        // Hide music controls if music is disabled
        document.querySelector('.music-controls').style.display = 'none';
    }
}

// Toggle background music
function toggleMusic() {
    if (isMusicPlaying) {
        audioPlayer.pause();
        musicToggle.innerHTML = '<i class="music-icon">♪</i>';
        musicToggle.classList.remove('active');
    } else {
        audioPlayer.play();
        musicToggle.innerHTML = '<i class="music-icon">■</i>';
        musicToggle.classList.add('active');
    }
    
    isMusicPlaying = !isMusicPlaying;
}

// Initialize expandable panels
function initializeExpandablePanels() {
    const announcementsHeader = document.getElementById('announcements-header');
    const changelogHeader = document.getElementById('changelog-header');
    
    if (announcementsHeader) {
        announcementsHeader.addEventListener('click', () => {
            const panel = announcementsHeader.closest('.expandable-panel');
            panel.classList.toggle('expanded');
        });
    }
    
    if (changelogHeader) {
        changelogHeader.addEventListener('click', () => {
            const panel = changelogHeader.closest('.expandable-panel');
            panel.classList.toggle('expanded');
        });
    }
}

// Display changelogs
function displayChangelogs() {
    const changelogElement = document.getElementById('changelog');
    
    if (changelogElement && config.serverInfo.changelogs && config.serverInfo.changelogs.length > 0) {
        changelogElement.innerHTML = '';
        
        // Add each changelog
        config.serverInfo.changelogs.forEach(changelog => {
            const changelogItem = document.createElement('div');
            changelogItem.className = 'changelog-item';
            
            changelogItem.innerHTML = `
                <div class="changelog-title">${changelog.title}</div>
                <div class="changelog-date">${changelog.date}</div>
                <div class="changelog-content">${changelog.content}</div>
            `;
            
            changelogElement.appendChild(changelogItem);
        });
    }
}

// Remove the duplicate DOMContentLoaded event listener at the bottom of the file