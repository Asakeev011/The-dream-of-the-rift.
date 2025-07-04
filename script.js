class DreamriftGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game state
        this.currentScreen = 'menu';
        this.gameState = 'playing';
        this.currentLevel = 0;
        this.memoryFragments = 0;
        this.totalFragments = 3;
        
        // Final animation properties
        this.finalAnimation = {
            active: false,
            fireworks: [],
            parents: {
                x: 400,
                y: 600,
                targetX: 600,
                targetY: 400,
                arrived: false
            },
            lya: {
                x: 600,
                y: 500,
                awake: false
            },
            time: 0
        };
        
        // Player
        this.player = {
            x: 100,
            y: 600,
            width: 30,
            height: 50,
            velocityX: 0,
            velocityY: 0,
            speed: 5,
            jumpPower: 15,
            onGround: false,
            canJump: true,
            color: '#a8e6cf'
        };
        
        // Physics
        this.gravity = 0.8;
        this.friction = 0.8;
        
        // Level data
        this.levels = [
            {
                name: 'Комната детства',
                background: '#2d1b69',
                platforms: [
                    {x: 0, y: 750, width: 1200, height: 50, color: '#4a4a4a'},
                    {x: 200, y: 650, width: 100, height: 20, color: '#6a6a6a'},
                    {x: 400, y: 550, width: 100, height: 20, color: '#6a6a6a'},
                    {x: 600, y: 450, width: 100, height: 20, color: '#6a6a6a'},
                    {x: 800, y: 350, width: 100, height: 20, color: '#6a6a6a'},
                    {x: 1000, y: 250, width: 100, height: 20, color: '#6a6a6a'}
                ],
                fragments: [
                    {x: 250, y: 620, collected: false, color: '#ffd700'},
                    {x: 450, y: 520, collected: false, color: '#ffd700'},
                    {x: 1050, y: 220, collected: false, color: '#ffd700'}
                ],
                enemies: [],
                exit: {x: 1100, y: 200, width: 50, height: 50, color: '#00ff00'}
            },
            {
                name: 'Лабиринт теней',
                background: '#1a1a2e',
                platforms: [
                    {x: 0, y: 750, width: 1200, height: 50, color: '#2d2d2d'},
                    {x: 150, y: 600, width: 80, height: 15, color: '#4a4a4a'},
                    {x: 350, y: 500, width: 80, height: 15, color: '#4a4a4a'},
                    {x: 550, y: 400, width: 80, height: 15, color: '#4a4a4a'},
                    {x: 750, y: 300, width: 80, height: 15, color: '#4a4a4a'},
                    {x: 950, y: 200, width: 80, height: 15, color: '#4a4a4a'},
                    // Движущиеся платформы
                    {x: 250, y: 350, width: 60, height: 10, color: '#666666', moving: true, moveY: 200, speed: 0.5, startY: 350},
                    {x: 650, y: 250, width: 60, height: 10, color: '#666666', moving: true, moveY: 150, speed: 0.8, startY: 250},
                    {x: 450, y: 150, width: 60, height: 10, color: '#666666', moving: true, moveY: 100, speed: 0.6, startY: 150}
                ],
                fragments: [
                    {x: 190, y: 570, collected: false, color: '#ffd700'},
                    {x: 390, y: 470, collected: false, color: '#ffd700'},
                    {x: 590, y: 370, collected: false, color: '#ffd700'},
                    {x: 790, y: 270, collected: false, color: '#ffd700'},
                    {x: 990, y: 170, collected: false, color: '#ffd700'}
                ],
                enemies: [
                    {x: 300, y: 720, width: 25, height: 25, color: '#8b0000', speed: 3, direction: 1, type: 'shadow'},
                    {x: 700, y: 720, width: 25, height: 25, color: '#4b0082', speed: 2, direction: -1, type: 'phantom'},
                    {x: 500, y: 720, width: 25, height: 25, color: '#2f4f4f', speed: 4, direction: 1, type: 'ghost'}
                ],
                exit: {x: 1020, y: 170, width: 50, height: 50, color: '#00ff00'}
            },
            {
                name: 'Город из снов',
                background: 'linear-gradient(180deg, #3a1c71 0%, #d76d77 50%, #2b86c5 100%)',
                platforms: [
                    {x: 0, y: 750, width: 1200, height: 50, color: '#22223b'}, // земля
                    {x: 100, y: 600, width: 120, height: 20, color: '#4a4e69'},
                    {x: 350, y: 500, width: 80, height: 20, color: '#4a4e69'},
                    {x: 600, y: 400, width: 200, height: 20, color: '#22223b'}, // длинная крыша
                    {x: 900, y: 300, width: 100, height: 20, color: '#4a4e69'},
                    {x: 1050, y: 200, width: 80, height: 20, color: '#4a4e69'},
                    {x: 700, y: 700, width: 300, height: 15, color: '#9f86c0'}, // мост
                ],
                fragments: [
                    {x: 130, y: 570, collected: false, color: '#ffd700'},
                    {x: 380, y: 470, collected: false, color: '#ffd700'},
                    {x: 650, y: 370, collected: false, color: '#ffd700'},
                    {x: 1100, y: 170, collected: false, color: '#ffd700'}
                ],
                enemies: [
                    {x: 650, y: 380, width: 30, height: 30, color: '#ff44ff', speed: 2, direction: 1},
                    {x: 950, y: 280, width: 30, height: 30, color: '#44ffff', speed: 2, direction: -1}
                ],
                exit: {x: 1120, y: 170, width: 50, height: 50, color: '#00ff00'}
            },
            {
                name: 'Больничная палата',
                background: '#2c3e50',
                platforms: [
                    {x: 0, y: 750, width: 1200, height: 50, color: '#34495e'},
                    {x: 100, y: 600, width: 100, height: 20, color: '#7f8c8d'},
                    {x: 300, y: 500, width: 100, height: 20, color: '#7f8c8d'},
                    {x: 500, y: 400, width: 100, height: 20, color: '#7f8c8d'},
                    {x: 700, y: 300, width: 100, height: 20, color: '#7f8c8d'},
                    {x: 900, y: 200, width: 100, height: 20, color: '#7f8c8d'},
                    {x: 1100, y: 100, width: 100, height: 20, color: '#7f8c8d'}
                ],
                fragments: [
                    {x: 150, y: 570, collected: false, color: '#ffd700'},
                    {x: 350, y: 470, collected: false, color: '#ffd700'},
                    {x: 550, y: 370, collected: false, color: '#ffd700'},
                    {x: 750, y: 270, collected: false, color: '#ffd700'},
                    {x: 950, y: 170, collected: false, color: '#ffd700'}
                ],
                enemies: [
                    {x: 400, y: 720, width: 30, height: 30, color: '#e74c3c', speed: 2, direction: 1},
                    {x: 800, y: 720, width: 30, height: 30, color: '#c0392b', speed: 3, direction: -1}
                ],
                exit: {x: 1150, y: 80, width: 50, height: 50, color: '#00ff00'}
            },
            {
                name: 'Коридор страхов',
                background: '#2c1810',
                platforms: [
                    {x: 0, y: 750, width: 1200, height: 50, color: '#1a1a1a'},
                    {x: 150, y: 650, width: 70, height: 15, color: '#4a4a4a'},
                    {x: 350, y: 550, width: 70, height: 15, color: '#4a4a4a'},
                    {x: 550, y: 450, width: 70, height: 15, color: '#4a4a4a'},
                    {x: 750, y: 350, width: 70, height: 15, color: '#4a4a4a'},
                    {x: 950, y: 250, width: 70, height: 15, color: '#4a4a4a'},
                    {x: 1150, y: 150, width: 70, height: 15, color: '#4a4a4a'}
                ],
                fragments: [
                    {x: 180, y: 620, collected: false, color: '#ffd700'},
                    {x: 380, y: 520, collected: false, color: '#ffd700'},
                    {x: 580, y: 420, collected: false, color: '#ffd700'},
                    {x: 780, y: 320, collected: false, color: '#ffd700'},
                    {x: 980, y: 220, collected: false, color: '#ffd700'},
                    {x: 1180, y: 120, collected: false, color: '#ffd700'}
                ],
                enemies: [
                    {x: 200, y: 720, width: 25, height: 25, color: '#8b0000', speed: 4, direction: 1},
                    {x: 600, y: 720, width: 25, height: 25, color: '#4b0082', speed: 3, direction: -1},
                    {x: 1000, y: 720, width: 25, height: 25, color: '#2f4f4f', speed: 5, direction: 1}
                ],
                exit: {x: 1180, y: 130, width: 50, height: 50, color: '#00ff00'}
            },
            {
                name: 'Центр Разлома',
                background: '#000033',
                platforms: [
                    {x: 0, y: 750, width: 1200, height: 50, color: '#1a1a1a'},
                    {x: 100, y: 600, width: 60, height: 12, color: '#4a4a4a'},
                    {x: 250, y: 500, width: 60, height: 12, color: '#4a4a4a'},
                    {x: 400, y: 400, width: 60, height: 12, color: '#4a4a4a'},
                    {x: 550, y: 300, width: 60, height: 12, color: '#4a4a4a'},
                    {x: 700, y: 200, width: 60, height: 12, color: '#4a4a4a'},
                    {x: 850, y: 100, width: 60, height: 12, color: '#4a4a4a'},
                    {x: 1000, y: 50, width: 60, height: 12, color: '#4a4a4a'}
                ],
                fragments: [
                    {x: 130, y: 570, collected: false, color: '#ffd700'},
                    {x: 280, y: 470, collected: false, color: '#ffd700'},
                    {x: 430, y: 370, collected: false, color: '#ffd700'},
                    {x: 580, y: 270, collected: false, color: '#ffd700'},
                    {x: 730, y: 170, collected: false, color: '#ffd700'},
                    {x: 880, y: 70, collected: false, color: '#ffd700'},
                    {x: 1030, y: 20, collected: false, color: '#ffd700'}
                ],
                enemies: [
                    {x: 150, y: 720, width: 20, height: 20, color: '#ff0000', speed: 6, direction: 1},
                    {x: 450, y: 720, width: 20, height: 20, color: '#00ff00', speed: 5, direction: -1},
                    {x: 750, y: 720, width: 20, height: 20, color: '#0000ff', speed: 7, direction: 1},
                    {x: 1050, y: 720, width: 20, height: 20, color: '#ffff00', speed: 4, direction: -1}
                ],
                exit: {x: 1050, y: 10, width: 50, height: 50, color: '#00ff00'}
            },
            {
                name: 'Загадочный мир',
                background: 'linear-gradient(180deg, #ff69b4 0%, #87ceeb 50%, #dda0dd 100%)',
                platforms: [
                    {x: 0, y: 750, width: 1200, height: 50, color: '#f0f8ff'},
                    {x: 200, y: 600, width: 200, height: 30, color: '#e6e6fa'},
                    {x: 500, y: 450, width: 200, height: 30, color: '#e6e6fa'},
                    {x: 800, y: 300, width: 200, height: 30, color: '#e6e6fa'},
                    {x: 1100, y: 150, width: 100, height: 30, color: '#e6e6fa'}
                ],
                fragments: [
                    {x: 300, y: 570, collected: false, color: '#ffd700'},
                    {x: 600, y: 420, collected: false, color: '#ffd700'},
                    {x: 900, y: 270, collected: false, color: '#ffd700'}
                ],
                enemies: [],
                exit: {x: 1150, y: 130, width: 50, height: 50, color: '#00ff00'}
            }
        ];
        
        // Input handling
        this.keys = {};
        this.setupInput();
        
        // UI elements
        this.setupUI();
        
        // Dialog system
        this.dialogIndex = 0;
        this.dialogs = [
            "Собиратель Снов: Добро пожаловать в Разлом, Лия. Здесь твои воспоминания смешались с кошмарами.",
            "Собиратель Снов: Собери фрагменты памяти, чтобы восстановить связь с реальностью.",
            "Собиратель Снов: Будь осторожна с Шумами - они созданы из твоего страха."
        ];
        
        // Level-specific dialogs
        this.levelDialogs = {
            0: [
                "Собиратель Снов: Это твоя комната детства. Здесь все было так просто и безопасно...",
                "Собиратель Снов: Собери золотые фрагменты, чтобы вспомнить счастливые моменты."
            ],
            1: [
                "Собиратель Снов: Лабиринт теней... Здесь платформы движутся, а враги стали опаснее.",
                "Собиратель Снов: Будь осторожна с движущимися платформами. Они могут унести тебя в пропасть!",
                "Собиратель Снов: Тени стали агрессивнее. Они не хотят, чтобы ты проходила дальше."
            ],
            2: [
                "Собиратель Снов: Город из снов... Здесь всё кажется знакомым, но странным.",
                "Собиратель Снов: Крыши и мосты ведут к воспоминаниям. Будь осторожна на высоте!"
            ],
            3: [
                "Собиратель Снов: День аварии... самое темное воспоминание.",
                "Собиратель Снов: Здесь больше фрагментов и больше Шумов. Будь очень осторожна.",
                "Собиратель Снов: Платформы стали меньше. Прыгай точно!"
            ],
            4: [
                "Собиратель Снов: Больничная палата... где ты лежала в коме.",
                "Собиратель Снов: Здесь твое тело боролось за жизнь, пока сознание блуждало в Разломе."
            ],
            5: [
                "Собиратель Снов: Коридор страхов... последний барьер перед пробуждением.",
                "Собиратель Снов: Твои самые глубокие страхи пытаются удержать тебя здесь."
            ],
            6: [
                "Собиратель Снов: Центр Разлома... сердце твоих воспоминаний.",
                "Собиратель Снов: Здесь решается твоя судьба. Собери все фрагменты!"
            ],
            7: [
                "Собиратель Снов: Загадочный мир... ты почти дома, Лия.",
                "Собиратель Снов: После этого уровня ты пробудишься от комы!"
            ]
        };
        
        // Start game loop
        this.gameLoop();
    }
    
    setupInput() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (e.code === 'Escape') {
                this.togglePause();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Menu buttons
        document.getElementById('startBtn').addEventListener('click', () => {
            this.showScreen('gameScreen');
            this.currentScreen = 'game';
            this.loadLevel(0);
        });
        
        document.getElementById('storyBtn').addEventListener('click', () => {
            this.showScreen('storyScreen');
        });
        
        document.getElementById('controlsBtn').addEventListener('click', () => {
            this.showScreen('controlsScreen');
        });
        
        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            this.showScreen('menu');
        });
        
        document.getElementById('backToMenuBtn2').addEventListener('click', () => {
            this.showScreen('menu');
        });
        
        document.getElementById('resumeBtn').addEventListener('click', () => {
            this.showScreen('gameScreen');
            this.gameState = 'playing';
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.loadLevel(this.currentLevel);
            this.showScreen('gameScreen');
            this.gameState = 'playing';
        });
        
        document.getElementById('mainMenuBtn').addEventListener('click', () => {
            this.showScreen('menu');
            this.currentScreen = 'menu';
        });
        
        document.getElementById('dialogNext').addEventListener('click', () => {
            this.nextDialog();
        });
        
        // Level select button
        document.getElementById('levelSelectBtn').addEventListener('click', () => {
            this.showScreen('levelSelectScreen');
            this.generateLevelButtons();
        });
        
        document.getElementById('backToMenuBtn3').addEventListener('click', () => {
            this.showScreen('menu');
        });
    }
    
    setupUI() {
        this.levelNameElement = document.getElementById('levelName');
        this.memoryFragmentsElement = document.getElementById('memoryFragments');
        this.dialogBox = document.getElementById('dialogBox');
        this.dialogText = document.getElementById('dialogText');
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    togglePause() {
        if (this.currentScreen === 'game' && this.gameState === 'playing') {
            if (this.gameState === 'playing') {
                this.gameState = 'paused';
                this.showScreen('pauseScreen');
            } else {
                this.gameState = 'playing';
                this.showScreen('gameScreen');
            }
        }
    }
    
    loadLevel(levelIndex) {
        this.currentLevel = levelIndex;
        this.memoryFragments = 0;
        this.totalFragments = this.levels[levelIndex].fragments.length;
        
        // Reset player position
        this.player.x = 100;
        this.player.y = 600;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        
        // Update UI
        this.levelNameElement.textContent = this.levels[levelIndex].name;
        this.updateUI();
        
        // Show level-specific dialogs
        if (this.levelDialogs[levelIndex]) {
            this.dialogs = this.levelDialogs[levelIndex];
            this.dialogIndex = 0;
            this.showDialog(0);
        }
    }
    
    updateUI() {
        this.memoryFragmentsElement.textContent = `Фрагменты памяти: ${this.memoryFragments}/${this.totalFragments}`;
    }
    
    showDialog(index) {
        if (index < this.dialogs.length) {
            this.dialogText.textContent = this.dialogs[index];
            this.dialogBox.classList.remove('hidden');
            this.dialogIndex = index;
        }
    }
    
    nextDialog() {
        this.dialogIndex++;
        if (this.dialogIndex < this.dialogs.length) {
            this.showDialog(this.dialogIndex);
        } else {
            this.dialogBox.classList.add('hidden');
        }
    }
    
    handleInput() {
        if (this.gameState !== 'playing') return;
        
        // Horizontal movement
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            this.player.velocityX = -this.player.speed;
        } else if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            this.player.velocityX = this.player.speed;
        } else {
            this.player.velocityX *= this.friction;
        }
        
        // Jumping
        if ((this.keys['Space'] || this.keys['KeyW'] || this.keys['ArrowUp']) && this.player.canJump && this.player.onGround) {
            this.player.velocityY = -this.player.jumpPower;
            this.player.canJump = false;
        }
        
        if (!this.keys['Space'] && !this.keys['KeyW'] && !this.keys['ArrowUp']) {
            this.player.canJump = true;
        }
    }
    
    updatePhysics() {
        const level = this.levels[this.currentLevel];
        
        // Apply gravity
        this.player.velocityY += this.gravity;
        
        // Update position
        this.player.x += this.player.velocityX;
        this.player.y += this.player.velocityY;
        
        // Check platform collisions
        this.player.onGround = false;
        for (let platform of level.platforms) {
            if (this.checkCollision(this.player, platform)) {
                if (this.player.velocityY > 0) {
                    this.player.y = platform.y - this.player.height;
                    this.player.velocityY = 0;
                    this.player.onGround = true;
                } else if (this.player.velocityY < 0) {
                    this.player.y = platform.y + platform.height;
                    this.player.velocityY = 0;
                }
            }
        }
        
        // Check fragment collisions
        for (let fragment of level.fragments) {
            if (!fragment.collected && this.checkCollision(this.player, fragment)) {
                fragment.collected = true;
                this.memoryFragments++;
                this.updateUI();
                console.log('Фрагмент собран! Всего:', this.memoryFragments, '/', this.totalFragments);
            }
        }
        
        // Check exit collision
        if (this.checkCollision(this.player, level.exit)) {
            if (this.memoryFragments >= this.totalFragments) {
                this.nextLevel();
            }
        }
        
        // Update moving platforms
        for (let platform of level.platforms) {
            if (platform.moving) {
                const time = Date.now() * 0.001;
                platform.y = platform.startY + Math.sin(time * platform.speed) * platform.moveY;
            }
        }
        
        // Update enemies
        for (let enemy of level.enemies) {
            enemy.x += enemy.speed * enemy.direction;
            
            // Simple AI - turn around at edges
            if (enemy.x <= 0 || enemy.x >= this.width - enemy.width) {
                enemy.direction *= -1;
            }
            
            // Check collision with player
            if (this.checkCollision(this.player, enemy)) {
                this.player.x = 100;
                this.player.y = 600;
                this.player.velocityX = 0;
                this.player.velocityY = 0;
            }
        }
        
        // Keep player in bounds
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x > this.width - this.player.width) this.player.x = this.width - this.player.width;
        if (this.player.y > this.height) {
            this.player.x = 100;
            this.player.y = 600;
            this.player.velocityX = 0;
            this.player.velocityY = 0;
        }
    }
    
    checkCollision(rect1, rect2) {
        const collision = rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
        
        // Debug collision for fragments
        if (rect2.color === '#ffd700') {
            console.log('Проверка коллизии с фрагментом:', {
                player: {x: rect1.x, y: rect1.y, w: rect1.width, h: rect1.height},
                fragment: {x: rect2.x, y: rect2.y, w: rect2.width, h: rect2.height},
                collision: collision
            });
        }
        
        return collision;
    }
    
    nextLevel() {
        this.currentLevel++;
        if (this.currentLevel < this.levels.length) {
            // Show level completion message
            this.dialogs = [`Собиратель Снов: Отлично! Ты прошла уровень "${this.levels[this.currentLevel - 1].name}".`];
            this.dialogIndex = 0;
            this.showDialog(0);
            
            // Load next level after dialog
            setTimeout(() => {
                this.loadLevel(this.currentLevel);
            }, 2000);
        } else {
            // Start final animation
            this.startFinalAnimation();
        }
    }
    
    startFinalAnimation() {
        this.finalAnimation.active = true;
        this.finalAnimation.time = 0;
        this.finalAnimation.fireworks = [];
        this.finalAnimation.parents.arrived = false;
        this.finalAnimation.lya.awake = false;
        this.currentScreen = 'final'; // Switch to a dedicated final screen
        this.gameState = 'final'; // Prevents other game logic from interfering
        
        // Create initial fireworks launching from bottom
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const startX = 100 + Math.random() * (this.width - 200);
                this.finalAnimation.fireworks.push({
                    x: startX,
                    y: this.height, // start from bottom
                    vx: (Math.random() - 0.5) * 4, // slight horizontal movement
                    vy: -20 - Math.random() * 10, // strong upward velocity
                    color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff1493', '#32cd32'][Math.floor(Math.random() * 9)],
                    exploded: false,
                    particles: []
                });
            }, i * 200); // stagger launches
        }
        
        // Show final dialog
        this.dialogs = [
            "Собиратель Снов: Ты собрала все фрагменты памяти!",
            "Собиратель Снов: Лия пробудилась от комы!",
            "Собиратель Снов: Смотри, фейерверки! Твои родители пришли!"
        ];
        this.dialogIndex = 0;
        this.showDialog(0);
    }
    
    render() {
        if (this.finalAnimation.active) {
            this.drawFinalAnimation();
        } else {
            const level = this.levels[this.currentLevel];
            
            // Clear canvas
            if (level.background.startsWith('linear-gradient')) {
                const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
                grad.addColorStop(0, '#3a1c71');
                grad.addColorStop(0.5, '#d76d77');
                grad.addColorStop(1, '#2b86c5');
                this.ctx.fillStyle = grad;
                this.ctx.fillRect(0, 0, this.width, this.height);
            } else {
                this.ctx.fillStyle = level.background;
                this.ctx.fillRect(0, 0, this.width, this.height);
            }
            
            // Draw atmospheric effects
            this.drawAtmosphericEffects();
            
            // Draw platforms
            for (let platform of level.platforms) {
                this.ctx.fillStyle = platform.color;
                this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            }
            
            // Draw fragments
            for (let fragment of level.fragments) {
                if (!fragment.collected) {
                    this.ctx.fillStyle = fragment.color;
                    this.ctx.beginPath();
                    this.ctx.arc(fragment.x + 10, fragment.y + 10, 10, 0, Math.PI * 2);
                    this.ctx.fill();
                    
                    // Glow effect
                    this.ctx.shadowColor = fragment.color;
                    this.ctx.shadowBlur = 20;
                    this.ctx.fill();
                    this.ctx.shadowBlur = 0;
                    
                    // Add width and height for collision detection
                    fragment.width = 20;
                    fragment.height = 20;
                }
            }
            
            // Draw enemies
            for (let enemy of level.enemies) {
                this.ctx.fillStyle = enemy.color;
                this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            }
            
            // Draw exit
            this.ctx.fillStyle = level.exit.color;
            this.ctx.fillRect(level.exit.x, level.exit.y, level.exit.width, level.exit.height);
            
            // Draw player
            this.drawBoy();
        }
    }
    
    drawFinalAnimation() {
        // Draw sunset gradient background
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, '#ff9966');   // warm orange
        grad.addColorStop(0.4, '#ff5e62'); // pinkish
        grad.addColorStop(0.7, '#8ec5fc'); // light blue
        grad.addColorStop(1, '#2b5876');   // deep blue
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw hospital bed
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(500, 450, 200, 100);
        this.ctx.strokeStyle = '#cccccc';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(500, 450, 200, 100);
        
        // Лия — по центру кровати
        const lyaCenterX = 500 + 100; // центр кровати
        const lyaBaseY = 450 + 30;   // чуть выше середины кровати
        this.ctx.save();
        this.ctx.translate(lyaCenterX, lyaBaseY);
        // Платье
        this.ctx.fillStyle = this.finalAnimation.lya.awake ? '#4a90e2' : '#87ceeb';
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-13, 40);
        this.ctx.lineTo(13, 40);
        this.ctx.closePath();
        this.ctx.fill();
        // Ноги
        this.ctx.strokeStyle = '#ffdbac';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(-5, 40);
        this.ctx.lineTo(-5, 60);
        this.ctx.moveTo(5, 40);
        this.ctx.lineTo(5, 60);
        this.ctx.stroke();
        // Туфли
        this.ctx.fillStyle = '#333';
        this.ctx.beginPath();
        this.ctx.arc(-5, 62, 5, 0, Math.PI, true);
        this.ctx.arc(5, 62, 5, 0, Math.PI, true);
        this.ctx.fill();
        // Руки
        this.ctx.strokeStyle = '#ffdbac';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(-13, 10);
        this.ctx.lineTo(-25, 30);
        this.ctx.moveTo(13, 10);
        this.ctx.lineTo(25, 30);
        this.ctx.stroke();
        // Голова
        this.ctx.beginPath();
        this.ctx.arc(0, -18, 15, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffdbac';
        this.ctx.fill();
        // Волосы
        this.ctx.beginPath();
        this.ctx.arc(0, -22, 16, Math.PI, Math.PI * 2);
        this.ctx.fillStyle = '#a0522d';
        this.ctx.fill();
        // Глаза
        this.ctx.fillStyle = '#222';
        this.ctx.beginPath();
        this.ctx.arc(-5, -20, 2, 0, Math.PI * 2);
        this.ctx.arc(5, -20, 2, 0, Math.PI * 2);
        this.ctx.fill();
        // Улыбка
        this.ctx.strokeStyle = '#b97a56';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(0, -13, 5, 0, Math.PI);
        this.ctx.stroke();
        this.ctx.restore();

        // Родители — по бокам кровати, не пересекаются с Лией
        // Мама (слева)
        this.ctx.save();
        this.ctx.translate(500 + 40, 450 + 80); // слева от кровати
        // Платье
        this.ctx.fillStyle = '#e57373';
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-15, 50);
        this.ctx.lineTo(15, 50);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.strokeStyle = '#f8cfa9';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(-7, 50);
        this.ctx.lineTo(-7, 70);
        this.ctx.moveTo(7, 50);
        this.ctx.lineTo(7, 70);
        this.ctx.stroke();
        this.ctx.fillStyle = '#333';
        this.ctx.beginPath();
        this.ctx.arc(-7, 73, 5, 0, Math.PI, true);
        this.ctx.arc(7, 73, 5, 0, Math.PI, true);
        this.ctx.fill();
        this.ctx.strokeStyle = '#f8cfa9';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(-15, 10);
        this.ctx.lineTo(-30, 35);
        this.ctx.moveTo(15, 10);
        this.ctx.lineTo(30, 35);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(0, -20, 15, 0, Math.PI * 2);
        this.ctx.fillStyle = '#f8cfa9';
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(0, -25, 17, Math.PI, Math.PI * 2);
        this.ctx.fillStyle = '#b5651d';
        this.ctx.fill();
        this.ctx.fillStyle = '#222';
        this.ctx.beginPath();
        this.ctx.arc(-5, -22, 2, 0, Math.PI * 2);
        this.ctx.arc(5, -22, 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#b97a56';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(0, -13, 5, 0, Math.PI);
        this.ctx.stroke();
        this.ctx.restore();

        // Папа (справа)
        this.ctx.save();
        this.ctx.translate(500 + 160, 450 + 80); // справа от кровати
        // Рубашка
        this.ctx.fillStyle = '#1976d2';
        this.ctx.fillRect(-12, 0, 24, 40);
        // Брюки
        this.ctx.fillStyle = '#424242';
        this.ctx.fillRect(-10, 40, 20, 30);
        // Ноги
        this.ctx.strokeStyle = '#e0ac69';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(-5, 70);
        this.ctx.lineTo(-5, 90);
        this.ctx.moveTo(5, 70);
        this.ctx.lineTo(5, 90);
        this.ctx.stroke();
        // Туфли
        this.ctx.fillStyle = '#222';
        this.ctx.beginPath();
        this.ctx.arc(-5, 94, 5, 0, Math.PI, true);
        this.ctx.arc(5, 94, 5, 0, Math.PI, true);
        this.ctx.fill();
        // Руки
        this.ctx.strokeStyle = '#e0ac69';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(-12, 10);
        this.ctx.lineTo(-30, 30);
        this.ctx.moveTo(12, 10);
        this.ctx.lineTo(30, 30);
        this.ctx.stroke();
        // Голова
        this.ctx.beginPath();
        this.ctx.arc(0, -18, 15, 0, Math.PI * 2);
        this.ctx.fillStyle = '#e0ac69';
        this.ctx.fill();
        // Волосы
        this.ctx.beginPath();
        this.ctx.arc(0, -23, 16, Math.PI, Math.PI * 2);
        this.ctx.fillStyle = '#5d4037';
        this.ctx.fill();
        // Глаза
        this.ctx.fillStyle = '#222';
        this.ctx.beginPath();
        this.ctx.arc(-5, -20, 2, 0, Math.PI * 2);
        this.ctx.arc(5, -20, 2, 0, Math.PI * 2);
        this.ctx.fill();
        // Улыбка
        this.ctx.strokeStyle = '#b97a56';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(0, -13, 5, 0, Math.PI);
        this.ctx.stroke();
        this.ctx.restore();
        
        // Draw realistic fireworks
        for (let firework of this.finalAnimation.fireworks) {
            if (!firework.exploded) {
                // Draw rocket trail (больше)
                for (let i = 0; i < 8; i++) {
                    const trailX = firework.x - firework.vx * i * 0.15;
                    const trailY = firework.y - firework.vy * i * 0.15;
                    const alpha = 1 - i * 0.12;
                    this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                    this.ctx.beginPath();
                    this.ctx.arc(trailX, trailY, 4, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                // Draw rocket body (больше)
                this.ctx.fillStyle = firework.color;
                this.ctx.beginPath();
                this.ctx.arc(firework.x, firework.y, 10, 0, Math.PI * 2);
                this.ctx.fill();
                // Glow
                this.ctx.shadowColor = firework.color;
                this.ctx.shadowBlur = 18;
                this.ctx.beginPath();
                this.ctx.arc(firework.x, firework.y, 10, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            } else {
                // Draw explosion particles (больше и ярче)
                for (let particle of firework.particles) {
                    const alpha = particle.life;
                    const size = particle.life * 12 + 4;
                    this.ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.shadowColor = firework.color;
                    this.ctx.shadowBlur = size * 1.5;
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.shadowBlur = 0;
                }
            }
        }
        
        // Draw celebration text instantly 1 second after Lya wakes up
        if (this.finalAnimation.lya.awake && this.finalAnimation.time > 6) {
            // Градиент для текста
            const textGradient = this.ctx.createLinearGradient(this.width/2 - 100, 100, this.width/2 + 100, 130);
            textGradient.addColorStop(0, '#1a237e');
            textGradient.addColorStop(0.5, '#512da8');
            textGradient.addColorStop(1, '#3949ab');
            this.ctx.fillStyle = textGradient;
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Лия пробудилась!', this.width / 2, 100);
            this.ctx.fillText('Семья воссоединилась!', this.width / 2, 130);
        }
    }
    
    drawBoy() {
        const x = this.player.x;
        const y = this.player.y;
        const width = this.player.width;
        const height = this.player.height;
        // Glow
        this.ctx.shadowColor = this.player.color;
        this.ctx.shadowBlur = 15;
        // Body (shirt)
        this.ctx.fillStyle = '#4a90e2'; // blue shirt
        this.ctx.fillRect(x + 5, y + 15, width - 10, 20);
        // Shorts
        this.ctx.fillStyle = '#1565c0';
        this.ctx.fillRect(x + 7, y + 35, width - 14, 12);
        // Head
        this.ctx.fillStyle = '#ffdbac';
        this.ctx.fillRect(x + 8, y + 5, width - 16, 12);
        // Hair (short)
        this.ctx.fillStyle = '#5d4037';
        this.ctx.fillRect(x + 8, y + 5, width - 16, 4);
        // Eyes
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(x + 12, y + 9, 2, 2);
        this.ctx.fillRect(x + 18, y + 9, 2, 2);
        // Smile
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(x + width/2, y + 13, 2, 0, Math.PI);
        this.ctx.stroke();
        // Arms
        this.ctx.fillStyle = '#ffdbac';
        this.ctx.fillRect(x + 3, y + 18, 4, 12);
        this.ctx.fillRect(x + width - 7, y + 18, 4, 12);
        // Legs
        this.ctx.fillRect(x + 10, y + 47, 4, 10);
        this.ctx.fillRect(x + width - 14, y + 47, 4, 10);
        // Shoes
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x + 10, y + 57, 4, 3);
        this.ctx.fillRect(x + width - 14, y + 57, 4, 3);
        this.ctx.shadowBlur = 0;
    }
    
    drawAtmosphericEffects() {
        // Draw floating particles
        for (let i = 0; i < 20; i++) {
            const x = (i * 60 + Date.now() * 0.01) % this.width;
            const y = (i * 40 + Math.sin(Date.now() * 0.001 + i) * 20) % this.height;
            
            this.ctx.fillStyle = `rgba(168, 230, 207, ${0.3 + Math.sin(Date.now() * 0.002 + i) * 0.2})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    gameLoop() {
        if (this.currentScreen === 'game' && this.gameState === 'playing') {
            this.handleInput();
            this.updatePhysics();
        }
        
        if (this.finalAnimation.active) {
            this.updateFinalAnimation();
        }
        
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    updateFinalAnimation() {
        this.finalAnimation.time += 0.016; // ~60 FPS
        
        // Update fireworks with realistic physics
        for (let firework of this.finalAnimation.fireworks) {
            if (!firework.exploded) {
                // Update rocket position
                firework.x += firework.vx;
                firework.y += firework.vy;
                firework.vy += 0.2; // gravity
                // Взорвать, если достиг верхней трети экрана или начал падать, или вышел за пределы
                if ((firework.vy > 0 && firework.y < this.height * 0.33) || firework.y < 60) {
                    firework.exploded = true;
                    firework.explosionX = firework.x;
                    firework.explosionY = firework.y;
                    // Create explosion particles (больше)
                    for (let i = 0; i < 50; i++) {
                        const angle = (Math.PI * 2 * i) / 50;
                        const speed = 4 + Math.random() * 5;
                        firework.particles.push({
                            x: firework.x,
                            y: firework.y,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed,
                            life: 1.0,
                            maxLife: 1.0
                        });
                    }
                }
            } else {
                // Update explosion particles
                for (let particle of firework.particles) {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.vy += 0.1; // gravity for particles
                    particle.vx *= 0.98; // air resistance
                    particle.vy *= 0.98;
                    particle.life -= 0.018;
                }
                // Remove dead particles
                firework.particles = firework.particles.filter(p => p.life > 0);
            }
        }
        
        // Add new fireworks from bottom of screen
        if (Math.random() < 0.08) { // reasonable frequency
            const startX = 100 + Math.random() * (this.width - 200);
            this.finalAnimation.fireworks.push({
                x: startX,
                y: this.height, // start from bottom
                vx: (Math.random() - 0.5) * 4, // slight horizontal movement
                vy: -20 - Math.random() * 10, // strong upward velocity
                color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff1493', '#32cd32'][Math.floor(Math.random() * 9)],
                exploded: false,
                particles: []
            });
        }
        
        // Update parents movement
        if (this.finalAnimation.time > 3) {
            const dx = this.finalAnimation.parents.targetX - this.finalAnimation.parents.x;
            const dy = this.finalAnimation.parents.targetY - this.finalAnimation.parents.y;
            this.finalAnimation.parents.x += dx * 0.02;
            this.finalAnimation.parents.y += dy * 0.02;
            
            if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
                this.finalAnimation.parents.arrived = true;
            }
        }
        
        // Wake up Lya
        if (this.finalAnimation.time > 5) {
            this.finalAnimation.lya.awake = true;
        }
        
        // End animation after 10 seconds
        if (this.finalAnimation.time > 10) {
            this.finalAnimation.active = false;
            setTimeout(() => {
                alert('Поздравляем! Лия пробудилась от комы и воссоединилась с родителями! Игра завершена!');
                this.showScreen('menu');
            }, 1000);
        }
    }
    
    generateLevelButtons() {
        const container = document.getElementById('levelButtons');
        container.innerHTML = '';
        this.levels.forEach((level, idx) => {
            const btn = document.createElement('button');
            btn.textContent = `${idx + 1}. ${level.name}`;
            btn.className = 'menu-btn';
            btn.style.margin = '0.5rem';
            btn.onclick = () => {
                this.showScreen('gameScreen');
                this.currentScreen = 'game';
                this.loadLevel(idx);
            };
            container.appendChild(btn);
        });
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    // Показать записку при заходе
    const note = document.getElementById('noteModal');
    note.style.display = 'flex';
    document.getElementById('closeNoteBtn').onclick = () => {
        note.style.display = 'none';
    };

    // Улучшенное определение мобильных устройств
    function isMobile() {
        return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile|BlackBerry|Windows Phone/i.test(navigator.userAgent) || 
               (window.innerWidth <= 768 && window.innerHeight <= 1024);
    }
    
    const touchControls = document.getElementById('touchControls');
    if (isMobile()) {
        touchControls.style.display = 'flex';
        console.log('Мобильное устройство обнаружено - включены сенсорные кнопки');
    }

    // Улучшенное Touch управление
    function setKey(code, value) {
        const game = window._dreamriftGameInstance;
        if (game && game.keys) {
            game.keys[code] = value;
            // Добавляем визуальную обратную связь
            if (event && event.target && event.target.classList.contains('touch-btn')) {
                if (value) {
                    event.target.style.transform = 'scale(0.9)';
                } else {
                    event.target.style.transform = 'scale(1)';
                }
            }
        }
    }
    
    // Предотвращение двойного нажатия
    let touchStartTime = 0;
    
    document.getElementById('btnLeft').addEventListener('touchstart', e => { 
        setKey('ArrowLeft', true); 
        e.preventDefault(); 
        touchStartTime = Date.now();
    });
    document.getElementById('btnLeft').addEventListener('touchend', e => { 
        setKey('ArrowLeft', false); 
        e.preventDefault(); 
    });
    
    document.getElementById('btnRight').addEventListener('touchstart', e => { 
        setKey('ArrowRight', true); 
        e.preventDefault(); 
        touchStartTime = Date.now();
    });
    document.getElementById('btnRight').addEventListener('touchend', e => { 
        setKey('ArrowRight', false); 
        e.preventDefault(); 
    });
    
    document.getElementById('btnJump').addEventListener('touchstart', e => { 
        setKey('Space', true); 
        e.preventDefault(); 
        touchStartTime = Date.now();
    });
    document.getElementById('btnJump').addEventListener('touchend', e => { 
        setKey('Space', false); 
        e.preventDefault(); 
    });
    
    // Предотвращение масштабирования при двойном нажатии
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Предотвращение зума при двойном нажатии
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Сохраняем ссылку на игру для touch управления
    window._dreamriftGameInstance = new DreamriftGame();
});
