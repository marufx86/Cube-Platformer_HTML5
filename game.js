const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let CANVAS_WIDTH = 800;
let CANVAS_HEIGHT = 600;
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const MOVEMENT_SPEED = 5;

let gameStatus = 'start';
let score = 0;
let highScore = 0;

const gameState = {
    player: {
        x: 50,
        y: 450,
        width: 30,
        height: 30,
        color: '#4444ff',
        velocityY: 0,
        isJumping: false
    },
    platforms: [
        { x: 0, y: 500, width: CANVAS_WIDTH, height: 20, color: '#666666' },
        { x: 0, y: 400, width: CANVAS_WIDTH, height: 20, color: '#666666' },
        { x: 0, y: 300, width: CANVAS_WIDTH, height: 20, color: '#666666' },
        { x: 0, y: 200, width: CANVAS_WIDTH, height: 20, color: '#666666' },
        { x: 0, y: 100, width: CANVAS_WIDTH, height: 20, color: '#666666' }
    ],
    enemies: [
        { x: 700, y: 480, width: 20, height: 20, color: '#ff4444', direction: -1, speed: 2, initialX: 700 },
        { x: 700, y: 380, width: 20, height: 20, color: '#ff4444', direction: -1, speed: 3, initialX: 700 },
        { x: 700, y: 280, width: 20, height: 20, color: '#ff4444', direction: -1, speed: 4, initialX: 700 },
        { x: 700, y: 180, width: 20, height: 20, color: '#ff4444', direction: -1, speed: 5, initialX: 700 }
    ],
    coins: []
};

let leftPressed = false;
let rightPressed = false;

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Touch controls
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const jumpButton = document.getElementById('jumpButton');

leftButton.addEventListener('touchstart', (e) => { e.preventDefault(); leftPressed = true; });
leftButton.addEventListener('touchend', (e) => { e.preventDefault(); leftPressed = false; });
rightButton.addEventListener('touchstart', (e) => { e.preventDefault(); rightPressed = true; });
rightButton.addEventListener('touchend', (e) => { e.preventDefault(); rightPressed = false; });
jumpButton.addEventListener('touchstart', (e) => { e.preventDefault(); jump(); });

function jump() {
    if (!gameState.player.isJumping) {
        gameState.player.velocityY = JUMP_FORCE;
        gameState.player.isJumping = true;
    }
}

function handleKeyDown(e) {
    if (gameStatus !== 'playing') return;
    if (e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === 'ArrowRight') rightPressed = true;
    if (e.key === 'ArrowUp' || e.key === ' ') {
        jump();
    }
}

function handleKeyUp(e) {
    if (e.key === 'ArrowLeft') leftPressed = false;
    if (e.key === 'ArrowRight') rightPressed = false;
}

function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function spawnCoin() {
    const randomPlatform = gameState.platforms[Math.floor(Math.random() * (gameState.platforms.length - 1)) + 1];
    gameState.coins.push({
        x: Math.random() * (randomPlatform.width - 20) + randomPlatform.x,
        y: randomPlatform.y - 30,
        width: 20,
        height: 20,
        color: '#ffd700'
    });
}

function update() {
    if (gameStatus !== 'playing') return;

    const { player, platforms, enemies, coins } = gameState;

    // Handle horizontal movement
    if (leftPressed) player.x -= MOVEMENT_SPEED;
    if (rightPressed) player.x += MOVEMENT_SPEED;

    // Apply gravity
    player.velocityY += GRAVITY;
    player.y += player.velocityY;

    // Check platform collisions
    player.isJumping = true;
    for (const platform of platforms) {
        if (
            checkCollision(player, platform) &&
            player.velocityY > 0 &&
            player.y + player.height - player.velocityY <= platform.y
        ) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;
        }
    }

    // Update and check enemy collisions
    for (const enemy of enemies) {
        // Move enemy
        enemy.x += enemy.speed * enemy.direction;

        // Reverse direction if at edge of platform
        if (enemy.x <= 0 || enemy.x + enemy.width >= CANVAS_WIDTH) {
            enemy.direction *= -1;
        }

        // Check collision with player
        if (checkCollision(player, enemy)) {
            gameOver();
        }
    }

    // Check coin collisions
    for (let i = coins.length - 1; i >= 0; i--) {
        if (checkCollision(player, coins[i])) {
            coins.splice(i, 1);
            score += 10;
            updateScore();
            if (score > highScore) {
                highScore = score;
                updateHighScore();
            }
        }
    }

    // Spawn new coin if there are less than 3
    if (coins.length < 3 && Math.random() < 0.02) {
        spawnCoin();
    }

    // Keep player in bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > CANVAS_WIDTH) player.x = CANVAS_WIDTH - player.width;

    // Check win condition (reach top platform)
    if (player.y <= 100) {
        showMessage("You won!", "The cube reached the top!");
        gameOver();
    }
}

function draw() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const { player, platforms, enemies, coins } = gameState;

    // Draw platforms
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw enemies
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Draw coins
    coins.forEach(coin => {
        ctx.fillStyle = coin.color;
        ctx.beginPath();
        ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function gameLoop() {
    update();
    draw();
    if (gameStatus === 'playing') {
        requestAnimationFrame(gameLoop);
    }
}

function startGame() {
    gameState.player.x = 50;
    gameState.player.y = 450;
    gameState.player.velocityY = 0;
    gameState.player.isJumping = false;
    gameState.enemies.forEach(enemy => {
        enemy.x = enemy.initialX;
        enemy.direction = -1;
    });
    gameState.coins = [];
    score = 0;
    updateScore();
    gameStatus = 'playing';
    hideOverlay();
    showTouchControls();
    gameLoop();
}

function pauseGame() {
    gameStatus = 'paused';
    showOverlay();
    hideTouchControls();
}

function resumeGame() {
    gameStatus = 'playing';
    hideOverlay();
    showTouchControls();
    gameLoop();
}

function restartGame() {
    startGame();
}

function gameOver() {
    gameStatus = 'gameover';
    showOverlay();
    hideTouchControls();
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

function updateHighScore() {
    document.getElementById('highScore').textContent = highScore;
    localStorage.setItem('highScore', highScore.toString());
}

function showOverlay() {
    const overlay = document.getElementById('gameOverlay');
    const overlayTitle = document.getElementById('overlayTitle');
    const overlayScore = document.getElementById('overlayScore');
    const startButton = document.getElementById('startButton');
    const resumeButton = document.getElementById('resumeButton');
    const restartButton = document.getElementById('restartButton');

    overlay.style.display = 'block';

    if (gameStatus === 'start') {
        overlayTitle.textContent = 'Cube Platformer';
        overlayScore.textContent = '';
        startButton.style.display = 'inline-block';
        resumeButton.style.display = 'none';
        restartButton.style.display = 'none';
    } else if (gameStatus === 'paused') {
        overlayTitle.textContent = 'Game Paused';
        overlayScore.textContent = `Score: ${score}`;
        startButton.style.display = 'none';
        resumeButton.style.display = 'inline-block';
        restartButton.style.display = 'inline-block';
    } else if (gameStatus === 'gameover') {
        overlayTitle.textContent = 'Game Over';
        overlayScore.textContent = `Score: ${score}`;
        startButton.style.display = 'none';
        resumeButton.style.display = 'none';
        restartButton.style.display = 'inline-block';
    }
}

function hideOverlay() {
    document.getElementById('gameOverlay').style.display = 'none';
}

function showTouchControls() {
    document.getElementById('touchControls').style.display = 'flex';
}

function hideTouchControls() {
    document.getElementById('touchControls').style.display = 'none';
}

function showMessage(title, message) {
    alert(`${title}\n${message}`);
}

// Event listeners for buttons
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('resumeButton').addEventListener('click', resumeGame);
document.getElementById('restartButton').addEventListener('click', restartGame);

// Load high score from// Load high score from local storage
const storedHighScore = localStorage.getItem('highScore');
if (storedHighScore) {
    highScore = parseInt(storedHighScore, 10);
    updateHighScore();
}

// Resize canvas and game elements for mobile devices
function resizeCanvas() {
    const container = document.getElementById('gameContainer');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const aspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT;

    if (containerWidth / containerHeight > aspectRatio) {
        canvas.style.width = 'auto';
        canvas.style.height = '100%';
    } else {
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
    }

    // Update canvas dimensions
    CANVAS_WIDTH = canvas.width = canvas.offsetWidth;
    CANVAS_HEIGHT = canvas.height = canvas.offsetHeight;

    // Adjust game elements
    gameState.platforms.forEach(platform => {
        platform.width = CANVAS_WIDTH;
    });

    gameState.enemies.forEach(enemy => {
        enemy.initialX = CANVAS_WIDTH - enemy.width;
        if (enemy.x > CANVAS_WIDTH - enemy.width) {
            enemy.x = enemy.initialX;
        }
    });
}

// Call resizeCanvas on window resize
window.addEventListener('resize', resizeCanvas);

// Initial resize
resizeCanvas();

// Show initial overlay
showOverlay();

