// Game Data from provided JSON
const gameData = {
    redemptionPets: [
        { "name": "Wise Owl", "description": "Provides cryptic but helpful advice", "type": "guidance" },
        { "name": "Loyal Dog", "description": "Never abandons you in dark times", "type": "loyalty" },
        { "name": "Mystical Cat", "description": "Sees through illusions and lies", "type": "insight" },
        { "name": "Guardian Spirit", "description": "Protects against spiritual threats", "type": "protection" },
        { "name": "Talking Raven", "description": "Messenger between worlds", "type": "communication" },
        { "name": "Ancient Turtle", "description": "Grants patience and wisdom", "type": "wisdom" },
        { "name": "Phoenix Chick", "description": "Symbolizes rebirth and hope", "type": "renewal" },
        { "name": "Spirit Guide", "description": "Shows the path to redemption", "type": "guidance" },
        { "name": "No Redemption Pet", "description": "Walk the path alone", "type": "independence" }
    ],
    categories: {
        "species": {
            "name": "Species",
            "strong": ["Dragon", "Angel", "Vampire Lord", "Demon Prince", "Divine Being", "Phoenix", "Celestial", "Ancient Elf", "Titan", "Primordial"],
            "weak": ["Fairy", "Goblin", "Regular Human", "Halfling", "Garden Gnome", "House Cat", "Anxious Ghost", "Clumsy Dwarf", "Sleepy Sloth", "Confused Squirrel"]
        },
        "powers": {
            "name": "Powers",
            "strong": ["Reality Manipulation", "Time Control", "Omniscience", "Immortality", "Teleportation", "Mind Reading", "Element Control", "Shapeshifting", "Flight", "Divine Magic"],
            "weak": ["Talk to Insects", "Change Hair Color", "Sense White Lies", "Glow in Dark", "Perfect Parking", "Never Lose Socks", "Always Know Time", "Predict Weather", "Understand Recipes", "Never Get Hiccups"]
        },
        "class": {
            "name": "Class",
            "strong": ["Archmage", "Legendary Warrior", "Master Assassin", "Divine Paladin", "Chaos Sorcerer", "Death Knight", "Battle Strategist", "Elemental Sage", "Time Mage", "Void Walker"],
            "weak": ["Village Baker", "Anxious Librarian", "Confused Alchemist", "Bumbling Knight", "Retired Adventurer", "Street Performer", "Tavern Bard", "Nervous Healer", "Lost Tourist", "Professional Worrier"]
        },
        "skillLevel": {
            "name": "Skill Level",
            "options": ["Legendary Master", "Renowned Expert", "Skilled Professional", "Competent Practitioner", "Average Performer", "Struggling Amateur", "Bumbling Novice", "Dangerously Incompetent", "Cursed by Fate", "Cosmically Unlucky"]
        },
        "alignment": {
            "name": "Alignment",
            "options": ["Lawful Good", "Chaotic Good", "True Neutral", "Lawful Evil", "Chaotic Evil", "Morally Confused", "Apocalyptically Neutral", "Lawful Stupid", "Chaotic Hungry", "Lawful Sleepy", "Neutral Evil But Trying", "Good But Sarcastic", "Evil But Polite", "Lawful Dramatic", "Chaotic Wholesome"]
        },
        "companion": {
            "name": "Companion",
            "strong": ["Ancient Dragon", "Loyal Phoenix", "Wise Spirit", "Magical Unicorn", "Battle Wolf", "Celestial Eagle", "Shadow Panther", "Mystical Fox", "Guardian Bear", "Storm Raven"],
            "weak": ["Sarcastic Parrot", "Anxious Hamster", "Dramatic Ferret", "Sleepy Sloth", "Cowardly Lion", "Gossiping Magpie", "Clumsy Elephant", "Pessimistic Owl", "Confused Penguin", "Hyperactive Chipmunk"]
        },
        "weakness": {
            "name": "Weakness",
            "serious": ["Cursed Bloodline", "Magical Allergy", "Prophesied Doom", "Ancient Curse", "Divine Punishment", "Mortal Enemy", "Soul Bond Vulnerability", "Time Loop Trap"],
            "quirky": ["Afraid of Butterflies", "Speaks Only in Rhyme", "Can't Refuse a Dare", "Collects Bottle Caps", "Narrates Own Life", "Always Hungry", "Terrible Direction Sense"]
        }
    },
    sarcasticComments: {
        "overpowered": [
            "Well, someone's been reading the power fantasy handbook.",
            "Because apparently 'balanced' is a dirty word in your vocabulary.",
            "I'm sure this won't go to your head at all.",
            "With great power comes... absolutely no responsibility, apparently."
        ],
        "underpowered": [
            "At least you'll never lack for humility.",
            "Well, that's... certainly a choice.",
            "I'm sure you'll find creative uses for that... somehow.",
            "The universe has quite the sense of humor, doesn't it?"
        ],
        "contradictory": [
            "Because apparently the universe has a sense of irony.",
            "This should be interesting to explain at parties.",
            "Well, that's not confusing at all.",
            "I sense a deeply compelling internal conflict brewing."
        ]
    },
    categoryOrder: ["species", "powers", "class", "skillLevel", "alignment", "companion", "weakness"],
    colors: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B']
};

// Game state
let gameState = {
    currentScreen: 'welcome',
    currentCategoryIndex: 0,
    character: {},
    redemptionPet: null,
    characterBalance: { strong: 0, weak: 0 },
    isSpinning: false,
    soundEnabled: true,
    wheelRotation: 0,
    canvas: null,
    ctx: null
};

// Leaderboard storage
let leaderboard = {
    hero: [],
    antihero: [],
    villain: [],
    overall: []
};

// Audio context and sound effects
let audioContext;
let soundBuffers = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing Spin of Destiny...');
    init();
});

function init() {
    try {
        setupEventListeners();
        initializeAudio();
        loadLeaderboard();
        setupRedemptionPets();
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Initialization failed:', error);
    }
}

function setupEventListeners() {
    console.log('Setting up event listeners...');

    // Welcome screen - using more robust event handling
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const nameInput = document.getElementById('character-name-start');
            const emailInput = document.getElementById('character-email-start');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';

            if (!name) {
                alert('Please enter your hero\'s name to begin!');
                if (nameInput) nameInput.focus();
                return;
            }

            if (!email || !email.includes('@')) {
                alert('Please enter a valid email address for the leaderboard!');
                if (emailInput) emailInput.focus();
                return;
            }

            gameState.characterName = name;
            gameState.characterEmail = email;
            console.log('Start button clicked, Name:', name, 'Email:', email);
            startGamePhase();
        });
        console.log('Start button event listener added');
    }

    const leaderboardBtn = document.getElementById('leaderboard-btn');
    if (leaderboardBtn) {
        leaderboardBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Leaderboard button clicked');
            showScreen('leaderboard');
        });
        console.log('Leaderboard button event listener added');
    }

    // Pet Decision & Reward
    const rollFateBtn = document.getElementById('roll-fate-btn');
    if (rollFateBtn) {
        rollFateBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            rollForPet();
        });
    }

    const claimPetBtn = document.getElementById('claim-pet-btn');
    if (claimPetBtn) {
        claimPetBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            claimPet();
        });
    }

    // Game controls
    const spinBtn = document.getElementById('spin-btn');
    if (spinBtn) {
        spinBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Spin button clicked');
            spinWheel();
        });
    }

    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleSound();
        });
    }

    // Results screen
    const newCharacterBtn = document.getElementById('new-character-btn');
    if (newCharacterBtn) {
        newCharacterBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            resetGame();
            showScreen('welcome');
        });
    }

    const saveCharacterBtn = document.getElementById('save-character-btn');
    if (saveCharacterBtn) {
        saveCharacterBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            saveCharacterToLeaderboard();
        });
    }

    const viewLeaderboardBtn = document.getElementById('view-leaderboard-btn');
    if (viewLeaderboardBtn) {
        viewLeaderboardBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            showScreen('leaderboard');
        });
    }

    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            resetGame();
            showScreen('welcome');
        });
    }

    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            exportCharacter();
        });
    }

    // Leaderboard
    const backToWelcomeBtn = document.getElementById('back-to-welcome-btn');
    if (backToWelcomeBtn) {
        backToWelcomeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Back to welcome button clicked');
            showScreen('welcome');
        });
        console.log('Back to welcome button event listener added');
    }

    // Leaderboard tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const tabName = btn.dataset.tab;
            switchLeaderboardTab(tabName);
        });
    });

    // Window resize
    window.addEventListener('resize', function () {
        if (gameState.currentScreen === 'game') {
            setupCanvas();
        }
    });

    console.log('Event listeners setup complete');
}

// Audio System
function initializeAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        createSoundEffects();
        console.log('Audio system initialized');
    } catch (error) {
        console.warn('Web Audio API not supported:', error);
        gameState.soundEnabled = false;
    }
}

function createSoundEffects() {
    if (!audioContext) return;

    try {
        soundBuffers.spin = createSpinSound();
        soundBuffers.tick = createTickSound();
        soundBuffers.victory = createVictorySound();
        soundBuffers.select = createSelectionSound();
        soundBuffers.suspense = createSuspenseSound();
        soundBuffers.bonus = createBonusSound();
    } catch (error) {
        console.warn('Error creating sound effects:', error);
    }
}

function createSpinSound() {
    const duration = 0.3;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        const frequency = 200 + Math.sin(t * 50) * 100;
        data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 2) * 0.3;
    }
    return buffer;
}

function createTickSound() {
    const duration = 0.1;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        data[i] = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 20) * 0.2;
    }
    return buffer;
}

function createVictorySound() {
    const duration = 1.5;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    const notes = [523.25, 659.25, 783.99]; // C, E, G

    for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        let sample = 0;

        notes.forEach((note, index) => {
            const noteStart = index * 0.4;
            if (t >= noteStart && t < noteStart + 0.5) {
                const noteTime = t - noteStart;
                sample += Math.sin(2 * Math.PI * note * noteTime) * Math.exp(-noteTime * 2) * 0.2;
            }
        });

        data[i] = sample;
    }
    return buffer;
}

function createSelectionSound() {
    const duration = 0.5;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        const frequency = 440 + t * 220;
        data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 3) * 0.3;
    }
    return buffer;
}

function playSound(soundName, volume = 1) {
    if (!audioContext || !gameState.soundEnabled || !soundBuffers[soundName]) return;

    try {
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();

        source.buffer = soundBuffers[soundName];
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start();
    } catch (error) {
        console.warn('Error playing sound:', error);
    }
}

// Screen Management
function showScreen(screenName) {
    console.log('Switching to screen:', screenName);

    try {
        const screens = ['welcome', 'game', 'pet-decision', 'pet-reward', 'results', 'leaderboard'];
        screens.forEach(screen => {
            const element = document.getElementById(`${screen}-screen`);
            if (element) {
                element.classList.remove('active');
                console.log(`Removed active from ${screen}-screen`);
            }
        });

        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            gameState.currentScreen = screenName;
            console.log(`Added active to ${screenName}-screen`);

            if (screenName === 'game') {
                setTimeout(() => setupCanvas(), 50);
            } else if (screenName === 'leaderboard') {
                updateLeaderboardDisplay();
            }
        } else {
            console.error(`Screen not found: ${screenName}-screen`);
        }
    } catch (error) {
        console.error('Show screen failed:', error);
    }
}

// function showRedemptionScreen() { ... removed ... }

function setupRedemptionPets() {
    const petGrid = document.getElementById('pet-grid');
    if (!petGrid) return;

    petGrid.innerHTML = gameData.redemptionPets.map(pet => {
        const isNoPet = pet.name === "No Redemption Pet";
        return `
            <div class="pet-option ${isNoPet ? 'no-pet' : ''}" data-pet='${JSON.stringify(pet)}'>
                <div class="pet-name">${pet.name}</div>
                <div class="pet-description">${pet.description}</div>
                <div class="pet-type">${pet.type}</div>
            </div>
        `;
    }).join('');

    // Add click handlers
    petGrid.querySelectorAll('.pet-option').forEach(option => {
        option.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const petData = JSON.parse(option.dataset.pet);
            selectRedemptionPet(petData);
        });
    });
}

function selectRedemptionPet(petData) {
    console.log('Selected pet:', petData.name);
    if (petData.name !== "No Redemption Pet") {
        gameState.redemptionPet = petData;
    }
    startGamePhase();
}

function startGamePhase() {
    console.log('Starting game phase...');
    gameState.currentCategoryIndex = 0;
    updateGameDisplay();
    showScreen('game');
}

function resetGame() {
    console.log('Resetting game...');
    gameState.currentCategoryIndex = 0;
    gameState.character = {};
    gameState.redemptionPet = null;
    gameState.characterBalance = { strong: 0, weak: 0 };
    gameState.isSpinning = false;
    gameState.wheelRotation = 0;

    updateCharacterDisplay();
    updateBalanceDisplay();
    hideSelection();
    hideQuote();
}

// Canvas and Wheel
function setupCanvas() {
    console.log('Setting up canvas...');
    const canvas = document.getElementById('wheel-canvas');
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }

    const maxSize = Math.min(window.innerWidth * 0.4, 400);
    const size = window.innerWidth <= 768 ? Math.min(maxSize, 300) : 400;

    canvas.width = size;
    canvas.height = size;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';

    gameState.canvas = canvas;
    gameState.ctx = canvas.getContext('2d');

    drawWheel();
    console.log('Canvas setup complete');
}

function drawWheel() {
    if (!gameState.ctx || !gameState.canvas) return;

    const ctx = gameState.ctx;
    const canvas = gameState.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Get current category options
    const currentCategoryKey = gameData.categoryOrder[gameState.currentCategoryIndex];
    const currentCategory = gameData.categories[currentCategoryKey];

    let allOptions = [];
    if (currentCategory.strong && currentCategory.weak) {
        allOptions = [...currentCategory.strong, ...currentCategory.weak];
    } else if (currentCategory.options) {
        allOptions = [...currentCategory.options];
    } else if (currentCategory.serious && currentCategory.quirky) {
        allOptions = [...currentCategory.serious, ...currentCategory.quirky];
    }

    const anglePerSegment = (2 * Math.PI) / allOptions.length;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context state
    ctx.save();

    // Apply rotation from center
    ctx.translate(centerX, centerY);
    ctx.rotate((gameState.wheelRotation * Math.PI) / 180);

    // Draw segments
    allOptions.forEach((option, index) => {
        const startAngle = index * anglePerSegment - Math.PI / 2;
        const endAngle = (index + 1) * anglePerSegment - Math.PI / 2;
        const color = gameData.colors[index % gameData.colors.length];

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 2;
        ctx.font = 'bold 11px Arial';

        let displayText = option;
        if (option.length > 12) {
            displayText = option.substring(0, 9) + '...';
        }
        ctx.fillText(displayText, radius * 0.4, 0);
        ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Add center symbol
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', 0, 0);

    ctx.restore();
}

function updateGameDisplay() {
    console.log('Updating game display for category:', gameState.currentCategoryIndex);
    const categoryTitle = document.getElementById('category-title');
    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');

    const currentCategoryKey = gameData.categoryOrder[gameState.currentCategoryIndex];
    const currentCategory = gameData.categories[currentCategoryKey];

    if (categoryTitle) categoryTitle.textContent = currentCategory.name;
    if (progressText) progressText.textContent = `Category ${gameState.currentCategoryIndex + 1} of ${gameData.categoryOrder.length}`;
    if (progressFill) progressFill.style.width = `${((gameState.currentCategoryIndex + 1) / gameData.categoryOrder.length) * 100}%`;

    updateRedemptionPetDisplay();
    drawWheel();
}

function spinWheel() {
    if (gameState.isSpinning) return;

    console.log('Starting wheel spin for category:', gameState.currentCategoryIndex);
    gameState.isSpinning = true;

    // Update UI to spinning state
    const spinBtn = document.getElementById('spin-btn');
    const spinText = spinBtn?.querySelector('.spin-text');
    const spinningText = spinBtn?.querySelector('.spinning-text');
    const pointer = document.querySelector('.wheel-pointer');
    const canvas = document.getElementById('wheel-canvas');

    if (spinBtn) {
        spinBtn.disabled = true;
        spinBtn.classList.add('spinning');
    }
    if (spinText) spinText.style.display = 'none';
    if (spinningText) spinningText.style.display = 'block';
    if (pointer) pointer.classList.add('spinning');
    if (canvas) canvas.classList.add('spinning');

    playSound('spin', 0.7);

    // Get current category and select option
    const currentCategoryKey = gameData.categoryOrder[gameState.currentCategoryIndex];
    const currentCategory = gameData.categories[currentCategoryKey];
    const selectedOption = selectBalancedOption(currentCategory);

    console.log('Selected option:', selectedOption);

    // Get all options for animation
    let allOptions = [];
    if (currentCategory.strong && currentCategory.weak) {
        allOptions = [...currentCategory.strong, ...currentCategory.weak];
    } else if (currentCategory.options) {
        allOptions = [...currentCategory.options];
    } else if (currentCategory.serious && currentCategory.quirky) {
        allOptions = [...currentCategory.serious, ...currentCategory.quirky];
    }

    const selectedIndex = allOptions.indexOf(selectedOption);
    const optionCount = allOptions.length;
    const anglePerSegment = 360 / optionCount;
    const targetAngle = selectedIndex * anglePerSegment;
    const spinRotations = 8 + Math.random() * 6;
    const randomOffset = (Math.random() - 0.5) * anglePerSegment * 0.3;
    const finalRotation = spinRotations * 360 + (360 - targetAngle) + randomOffset;

    animateWheel(finalRotation, 4000, () => {
        gameState.isSpinning = false;

        // Reset UI
        if (spinBtn) {
            spinBtn.disabled = false;
            spinBtn.classList.remove('spinning');
        }
        if (spinText) spinText.style.display = 'block';
        if (spinningText) spinningText.style.display = 'none';
        if (pointer) pointer.classList.remove('spinning');
        if (canvas) canvas.classList.remove('spinning');

        // Process selection
        gameState.character[currentCategory.name] = selectedOption;
        updateCharacterBalance(currentCategory, selectedOption);
        updateCharacterDisplay();
        updateBalanceDisplay();

        showSelection(selectedOption);
        showQuote(selectedOption, currentCategory);
        playSound('victory', 0.8);
        createCelebration();

        // Move to next category or results
        setTimeout(() => {
            hideSelection();
            hideQuote();
            if (gameState.currentCategoryIndex < gameData.categoryOrder.length - 1) {
                gameState.currentCategoryIndex++;

                // Auto-spin logic
                const spinBtn = document.getElementById('spin-btn');
                if (spinBtn) {
                    spinBtn.disabled = true;
                    spinBtn.textContent = `Auto-spinning in 2s...`;
                }

                setTimeout(() => {
                    console.log('Auto-spinning next category:', gameState.currentCategoryIndex);
                    updateGameDisplay();
                    spinWheel();
                }, 2000);

            } else {
                console.log('All categories complete, showing pet decision');
                setTimeout(() => showPetDecisionScreen(), 1000);
            }
        }, 3000);
    });
}

function selectBalancedOption(category) {
    // Determine if we should favor strong or weak options for balance
    const totalSelected = gameState.currentCategoryIndex;
    const targetStrongRatio = 0.5;
    const currentStrongCount = gameState.characterBalance.strong;
    const currentRatio = totalSelected > 0 ? currentStrongCount / totalSelected : 0;

    let favorStrong = currentRatio < targetStrongRatio;

    // Add some randomness
    if (Math.random() < 0.3) {
        favorStrong = !favorStrong;
    }

    let selectedOption;
    if (category.strong && category.weak) {
        if (favorStrong && category.strong.length > 0) {
            selectedOption = category.strong[Math.floor(Math.random() * category.strong.length)];
        } else {
            selectedOption = category.weak[Math.floor(Math.random() * category.weak.length)];
        }
    } else if (category.options) {
        // For skill level and alignment - treat first half as strong, second half as weak
        const options = category.options;
        const halfPoint = Math.floor(options.length / 2);
        if (favorStrong) {
            selectedOption = options[Math.floor(Math.random() * halfPoint)];
        } else {
            selectedOption = options[halfPoint + Math.floor(Math.random() * (options.length - halfPoint))];
        }
    } else if (category.serious && category.quirky) {
        // For weakness - serious are "weak", quirky are "weak" too but more humorous
        const allOptions = [...category.serious, ...category.quirky];
        selectedOption = allOptions[Math.floor(Math.random() * allOptions.length)];
    }

    return selectedOption;
}

function updateCharacterBalance(category, selectedOption) {
    if (category.strong && category.strong.includes(selectedOption)) {
        gameState.characterBalance.strong++;
    } else if (category.options) {
        // For options-based categories, treat first half as strong
        const halfPoint = Math.floor(category.options.length / 2);
        const optionIndex = category.options.indexOf(selectedOption);
        if (optionIndex < halfPoint) {
            gameState.characterBalance.strong++;
        } else {
            gameState.characterBalance.weak++;
        }
    } else {
        gameState.characterBalance.weak++;
    }
}

function animateWheel(totalRotation, duration, onComplete) {
    const startRotation = gameState.wheelRotation;
    const startTime = performance.now();
    let tickTimer = 0;

    function animate(currentTime) {
        try {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentRotation = startRotation + totalRotation * easeOut;

            gameState.wheelRotation = currentRotation % 360;
            drawWheel();

            if (progress < 0.8) {
                const speed = 1 - progress;
                const tickInterval = 100 + (200 * (1 - speed));

                if (currentTime - tickTimer > tickInterval) {
                    playSound('tick', 0.3 * speed);
                    tickTimer = currentTime;
                }
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                onComplete();
            }
        } catch (error) {
            console.error('Animation frame error:', error);
            onComplete();
        }
    }

    requestAnimationFrame(animate);
}

function showSelection(option) {
    const selectionDisplay = document.getElementById('selection-display');
    const selectedOption = document.getElementById('selected-option');

    if (selectionDisplay && selectedOption) {
        selectedOption.textContent = option;
        selectionDisplay.style.display = 'block';
        playSound('select', 0.6);
    }
}

function hideSelection() {
    const selectionDisplay = document.getElementById('selection-display');
    if (selectionDisplay) {
        selectionDisplay.style.display = 'none';
    }
}

function showQuote(selectedOption, category) {
    const quoteDisplay = document.getElementById('quote-display');
    const quoteText = document.getElementById('quote-text');

    if (!quoteDisplay || !quoteText) return;

    let quote = '';

    // Determine quote type based on selection
    if (category.strong && category.strong.includes(selectedOption)) {
        quote = gameData.sarcasticComments.overpowered[Math.floor(Math.random() * gameData.sarcasticComments.overpowered.length)];
    } else if (category.weak && category.weak.includes(selectedOption)) {
        quote = gameData.sarcasticComments.underpowered[Math.floor(Math.random() * gameData.sarcasticComments.underpowered.length)];
    } else {
        quote = gameData.sarcasticComments.contradictory[Math.floor(Math.random() * gameData.sarcasticComments.contradictory.length)];
    }

    quoteText.textContent = quote;
    quoteDisplay.style.display = 'block';
}

function hideQuote() {
    const quoteDisplay = document.getElementById('quote-display');
    if (quoteDisplay) {
        quoteDisplay.style.display = 'none';
    }
}

function updateRedemptionPetDisplay() {
    const petDisplay = document.getElementById('redemption-pet-display');
    const petValue = document.getElementById('redemption-pet-value');
    const petDescription = document.getElementById('redemption-pet-description');

    if (petDisplay && petValue) {
        if (gameState.redemptionPet) {
            petValue.textContent = gameState.redemptionPet.name;
            if (petDescription) petDescription.textContent = gameState.redemptionPet.description;
            petDisplay.style.display = 'block';
        } else {
            petValue.textContent = 'None';
            if (petDescription) petDescription.textContent = 'Walking the path alone';
            petDisplay.style.display = 'block';
        }
    }
}

function updateCharacterDisplay() {
    const traits = Object.entries(gameState.character);
    const characterTraits = document.getElementById('character-traits');

    if (!characterTraits) return;

    if (traits.length === 0) {
        characterTraits.innerHTML = '<div class="trait-placeholder">Begin spinning to build your character!</div>';
        return;
    }

    characterTraits.innerHTML = traits.map(([category, value]) => {
        const categoryKey = gameData.categoryOrder.find(key =>
            gameData.categories[key].name === category
        );
        const categoryData = gameData.categories[categoryKey];
        let isStrong = false;

        if (categoryData.strong) {
            isStrong = categoryData.strong.includes(value);
        } else if (categoryData.options) {
            const halfPoint = Math.floor(categoryData.options.length / 2);
            const optionIndex = categoryData.options.indexOf(value);
            isStrong = optionIndex < halfPoint;
        }

        const traitClass = isStrong ? 'strong' : 'weak';

        return `
            <div class="trait-item ${traitClass}">
                <span class="trait-label">${category}:</span>
                <span class="trait-value">${value}</span>
            </div>
        `;
    }).join('');
}

function updateBalanceDisplay() {
    const totalTraits = gameState.characterBalance.strong + gameState.characterBalance.weak;
    if (totalTraits === 0) {
        const goodBalance = document.getElementById('good-balance');
        const challengeBalance = document.getElementById('challenge-balance');
        if (goodBalance) goodBalance.style.width = '0%';
        if (challengeBalance) challengeBalance.style.width = '0%';
        return;
    }

    const strongPercentage = (gameState.characterBalance.strong / totalTraits) * 100;
    const weakPercentage = (gameState.characterBalance.weak / totalTraits) * 100;

    const goodBalance = document.getElementById('good-balance');
    const challengeBalance = document.getElementById('challenge-balance');

    if (goodBalance) goodBalance.style.width = `${strongPercentage}%`;
    if (challengeBalance) challengeBalance.style.width = `${weakPercentage}%`;
}

function createCelebration() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    document.body.appendChild(celebration);

    const colors = ['#FFD700', '#FF69B4', '#00FF7F', '#1E90FF', '#FF6347', '#9370DB'];

    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
        celebration.appendChild(confetti);
    }

    setTimeout(() => {
        if (document.body.contains(celebration)) {
            document.body.removeChild(celebration);
        }
    }, 4000);
}

function showResults() {
    console.log('Showing results screen');
    showScreen('results');
    generateCharacterSummary();
    playSound('victory', 1.0);
}

function generateCharacterSummary() {
    const character = gameState.character;
    const characterName = generateCharacterName();
    const description = generateCharacterDescription(character);
    const finalCommentary = generateFinalCommentary();

    const characterSummary = document.getElementById('character-summary');
    const finalCommentaryDiv = document.getElementById('final-commentary');

    if (characterSummary) {
        let redemptionPetHtml = '';
        if (gameState.redemptionPet) {
            redemptionPetHtml = `
                <div class="final-trait pet">
                    <div class="final-trait-label">Redemption Pet</div>
                    <div class="final-trait-value">${gameState.redemptionPet.name}</div>
                </div>
            `;
        }

        characterSummary.innerHTML = `
            <div class="character-name">${characterName}</div>
            <div class="character-description">${description}</div>
            <div class="final-traits">
                ${redemptionPetHtml}
                ${Object.entries(character).map(([category, value]) => {
            const categoryKey = gameData.categoryOrder.find(key =>
                gameData.categories[key].name === category
            );
            const categoryData = gameData.categories[categoryKey];
            let isStrong = false;

            if (categoryData.strong) {
                isStrong = categoryData.strong.includes(value);
            } else if (categoryData.options) {
                const halfPoint = Math.floor(categoryData.options.length / 2);
                const optionIndex = categoryData.options.indexOf(value);
                isStrong = optionIndex < halfPoint;
            }

            const traitClass = isStrong ? 'strong' : 'weak';

            return `
                        <div class="final-trait ${traitClass}">
                            <div class="final-trait-label">${category}</div>
                            <div class="final-trait-value">${value}</div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    }

    if (finalCommentaryDiv) {
        finalCommentaryDiv.textContent = finalCommentary;
    }
}

function generateCharacterName() {
    const prefixes = ['Mighty', 'Dark', 'Swift', 'Wise', 'Brave', 'Ancient', 'Noble', 'Fierce', 'Mystic', 'Shadow'];
    const suffixes = ['blade', 'heart', 'wing', 'storm', 'fire', 'shadow', 'light', 'walker', 'born', 'keeper'];

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    return `${prefix}${suffix} the Destined`;
}

function generateCharacterDescription(character) {
    const petDescription = gameState.redemptionPet ? ` accompanied by their loyal ${gameState.redemptionPet.name},` : '';
    return `A legendary ${character['Species']} ${character['Class']} with the power of ${character['Powers']}. 
    Their ${character['Skill Level']} abilities are guided by ${character['Alignment']} principles,${petDescription} 
    and they are joined by their ${character['Companion']}. Though challenged by ${character['Weakness']}, 
    their destiny awaits in the realm of adventure!`;
}

function generateFinalCommentary() {
    const strongCount = gameState.characterBalance.strong;
    const weakCount = gameState.characterBalance.weak;
    const totalTraits = strongCount + weakCount;
    const strongRatio = strongCount / totalTraits;

    if (strongRatio > 0.7) {
        return "Well, well, someone's been blessed by the RNG gods. Try not to let all that power go to your head... who am I kidding, it already has.";
    } else if (strongRatio < 0.3) {
        return "Ah, the classic underdog build. Either you're in for the greatest comeback story ever told, or this is going to be a very short adventure.";
    } else if (gameState.redemptionPet && strongRatio > 0.5) {
        return "A redemption pet AND decent powers? Someone's hedging their bets. Smart... or perhaps just lucky.";
    } else {
        return "A perfectly balanced character, as all things should be. Well, 'balanced' might be a generous term, but at least it's... interesting.";
    }
}

// Leaderboard Functions
function saveCharacterToLeaderboard() {
    // Name is already valid from start
    const characterName = gameState.characterName || generateCharacterName();
    const characterEmail = gameState.characterEmail;

    if (!characterEmail) {
        alert("Error: No email found. Please restart.");
        return;
    }

    const characterData = {
        name: characterName,
        email: characterEmail,
        traits: gameState.character,
        redemptionPet: gameState.redemptionPet,
        balance: gameState.characterBalance,
        createdAt: new Date().toISOString(),
        score: calculateOverallScore(),
        id: Date.now().toString()
    };

    // determine category based on alignment
    const alignment = gameState.character['Alignment'] || "";
    let category = 'antihero'; // Default

    const heroAlignments = ["Lawful Good", "Chaotic Good", "Good But Sarcastic", "Chaotic Wholesome"];
    const villainAlignments = ["Lawful Evil", "Chaotic Evil", "Evil But Polite", "Lawful Sleepy"];

    if (heroAlignments.includes(alignment)) {
        category = 'hero';
    } else if (villainAlignments.includes(alignment)) {
        category = 'villain';
    }

    // Add to specific category and overall
    if (!leaderboard[category]) leaderboard[category] = [];
    if (!leaderboard.overall) leaderboard.overall = [];

    // Helper to update or add
    const updateOrAdd = (list, data) => {
        const existingIndex = list.findIndex(c => c.email === data.email);
        if (existingIndex !== -1) {
            // Check if new score is higher
            if (data.score > list[existingIndex].score) {
                list[existingIndex] = data; // Update
                return true; // Updated
            }
            return false; // Not updated (old score higher or equal)
        } else {
            list.push(data);
            return true; // Added
        }
    };

    const updatedCategory = updateOrAdd(leaderboard[category], characterData);
    const updatedOverall = updateOrAdd(leaderboard.overall, characterData);

    if (!updatedCategory && !updatedOverall) {
        alert(`You have a previous score of that is higher or equal! Leaderboard not updated.`);
    } else {
        alert('Character saved to leaderboard!');
    }

    // Sort and limit
    leaderboard[category].sort((a, b) => b.score - a.score);
    leaderboard.overall.sort((a, b) => b.score - a.score);

    leaderboard[category] = leaderboard[category].slice(0, 20);
    leaderboard.overall = leaderboard.overall.slice(0, 20);

    saveLeaderboard();
}


function calculateOverallScore() {
    return (gameState.characterBalance.strong || 0) * 10
        + (gameState.characterBalance.weak || 0) * 5
        + (gameState.redemptionPet ? 20 : 0)
        + Math.floor(Math.random() * 10);
}

function calculatePowerLevel() {
    return gameState.characterBalance.strong * 15 + (gameState.redemptionPet ? 10 : 0) + Math.floor(Math.random() * 20);
}

function calculateCreativity() {
    const uniqueCombos = Object.values(gameState.character).join('').length;
    return uniqueCombos + Math.floor(Math.random() * 50);
}

function calculateComedy() {
    return gameState.characterBalance.weak * 12 + Math.floor(Math.random() * 30);
}

function calculateRedemptionScore() {
    if (!gameState.redemptionPet) return 0;
    return gameState.characterBalance.strong * 10 + gameState.characterBalance.weak * 5 + Math.floor(Math.random() * 25);
}

function loadLeaderboard() {
    try {
        const saved = localStorage.getItem('spinOfDestinyLeaderboard');
        if (saved) {
            leaderboard = JSON.parse(saved);
        }
    } catch (error) {
        console.warn('Failed to load leaderboard:', error);
    }
}

function saveLeaderboard() {
    try {
        localStorage.setItem('spinOfDestinyLeaderboard', JSON.stringify(leaderboard));
    } catch (error) {
        console.warn('Failed to save leaderboard:', error);
    }
}

function switchLeaderboardTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

    // Update tab content
    document.querySelectorAll('.leaderboard-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`)?.classList.add('active');

    updateLeaderboardDisplay();
}

function updateLeaderboardDisplay() {
    const categories = ['hero', 'antihero', 'villain', 'overall'];

    categories.forEach(category => {
        const listElement = document.getElementById(`leaderboard-${category}`);
        if (!listElement) return;

        const entries = leaderboard[category] || [];

        if (entries.length === 0) {
            listElement.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">No characters yet. Be the first!</p>';
            return;
        }

        listElement.innerHTML = entries.map((character, index) => {
            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            const traitsSummary = Object.entries(character.traits).map(([key, value]) =>
                `${key}: ${value.length > 15 ? value.substring(0, 12) + '...' : value}`
            ).join(', ');

            // Add title for Overall category
            let displayName = character.name;
            if (category === 'overall' && character.traits && character.traits['Class']) {
                displayName += ` <span class="character-title">the ${character.traits['Class']}</span>`;
            }

            return `
                <div class="leaderboard-entry ${rankClass}">
                    <div class="rank-badge">${rank}</div>
                    <div class="character-info">
                        <h4>${displayName}</h4>
                        <div class="character-traits-summary">${traitsSummary}</div>
                        ${character.redemptionPet ? `<div class="character-traits-summary">Pet: ${character.redemptionPet.name}</div>` : ''}
                        <div class="character-meta">
                            <span>Score: ${character.score}</span>
                            <span>Created: ${new Date(character.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    });
}

function exportCharacter() {
    const character = gameState.character;
    const characterName = generateCharacterName();

    const exportData = {
        name: characterName,
        traits: character,
        redemptionPet: gameState.redemptionPet,
        balance: gameState.characterBalance,
        createdAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `${characterName.replace(/\s+/g, '_')}_Character.json`);
    linkElement.click();
}

function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.textContent = gameState.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off';
    }

    if (gameState.soundEnabled && audioContext && audioContext.state === 'suspended') {
        audioContext.resume().catch(err => console.warn('Audio resume failed:', err));
    }

    if (gameState.soundEnabled) {
        setTimeout(() => playSound('select', 0.3), 100);
    }
}
function createSuspenseSound() {
    const duration = 2.0;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        const frequency = 100 + Math.random() * 50;
        data[i] = (Math.random() * 2 - 1) * Math.exp(t) * 0.1;
    }
    return buffer;
}

function createBonusSound() {
    const duration = 1.0;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        const frequency = 400 + Math.sin(t * 50) * 200;
        data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 2) * 0.3;
    }
    return buffer;
}

// Pet Decision Logic


function showPetDecisionScreen() {
    console.log('Showing pet decision screen');
    showScreen('pet-decision');
    // Reset visual state
    const diamond = document.getElementById('decision-diamond');
    const decisionText = diamond.querySelector('.decision-text');
    const rollBtn = document.getElementById('roll-fate-btn');

    if (diamond) {
        diamond.classList.remove('rolling');
        diamond.classList.remove('shaking');
    }
    if (decisionText) decisionText.textContent = '?';

    // Reset click count
    gameState.fateClickCount = 0;
    if (rollBtn) {
        rollBtn.textContent = "Test Your Fate";
        rollBtn.disabled = false;
        rollBtn.classList.remove('btn--danger');
    }
}

function rollForPet() {
    gameState.fateClickCount = (gameState.fateClickCount || 0) + 1;
    const clicks = gameState.fateClickCount;
    const rollBtn = document.getElementById('roll-fate-btn');
    const diamond = document.getElementById('decision-diamond');

    // Tension phase (clicks 1-4)
    if (clicks < 5) {
        // Visuals
        if (diamond) {
            diamond.classList.remove('shaking');
            void diamond.offsetWidth; // trigger reflow
            diamond.classList.add('shaking');
        }

        // Sound - pitch increases with each click
        playSound('suspense', 0.5 + (clicks * 0.1));

        // Button Text
        const phrases = [
            "Test Your Fate",
            "Are you sure?",
            "Fate is listening...",
            "PUSH HARDER!",
            "DESTINY AWAITS!"
        ];
        if (rollBtn) {
            rollBtn.textContent = phrases[clicks] || "AGAIN!";
            if (clicks > 2) rollBtn.classList.add('btn--danger');
        }
        return; // Stop here, wait for next click
    }

    // Final Click (5+) - Execute Roll
    if (rollBtn) {
        rollBtn.disabled = true;
        rollBtn.textContent = "FATE DECIDED!";
    }
    const decisionText = diamond?.querySelector('.decision-text');

    if (diamond) {
        diamond.classList.remove('shaking');
        diamond.classList.add('rolling');
    }

    playSound('spin', 1.0);

    // Animation duration 2.5s
    setTimeout(() => {
        if (diamond) diamond.classList.remove('rolling');

        // 10% chance for pet
        const roll = Math.random();
        console.log('Pet roll:', roll);

        if (roll < 0.1) {
            // Success!
            if (decisionText) decisionText.textContent = '★';
            playSound('bonus', 1.0);
            createCelebration();

            setTimeout(() => {
                selectRandomPet();
            }, 1000);
        } else {
            // Failure
            if (decisionText) decisionText.textContent = '✖';
            playSound('tick', 0.5); // Disappointed tick

            setTimeout(() => {
                showResults();
            }, 1500);
        }

    }, 2500);
}

function selectRandomPet() {
    // Filter out 'No Pet' option from data if it exists there, 
    // or just pick from valid pets
    const validPets = gameData.redemptionPets.filter(p => p.name !== "No Redemption Pet");
    const pet = validPets[Math.floor(Math.random() * validPets.length)];

    gameState.redemptionPet = pet;
    showPetRewardScreen(pet);
}

function showPetRewardScreen(pet) {
    showScreen('pet-reward');

    const card = document.getElementById('reward-pet-card');
    if (card) {
        card.innerHTML = `
            <div class="reward-pet-name">${pet.name}</div>
            <div class="reward-pet-type">${pet.type}</div>
            <div class="reward-pet-desc">${pet.description}</div>
        `;
    }
}

function claimPet() {
    showResults();
}
