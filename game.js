// --- Cached DOM Elements ---
const levelTitle = document.getElementById('level-title');
const highScoreDisplay = document.getElementById('high-score-display');
const colorButtons = document.querySelectorAll('.simon-btn');
const body = document.body;
const beepSound = document.getElementById('beep-sound');
const gameOverSound = document.getElementById('game-over-sound');
const backgroundMusic = document.getElementById('background-music');

// --- Game State Variables ---
let gameSeq = [];
let userSeq = [];
let gameStarted = false;
let level = 0;
let highScore = localStorage.getItem('simonHighScore') || 0;
const buttonColors = ['red', 'green', 'yellow', 'blue'];
let isMusicUnmuted = false;

// --- Initialize Game ---
highScoreDisplay.innerText = `High Score: ${highScore}`;
levelTitle.classList.add('pulsate'); 
playBackgroundMusic(); // Start the (muted) music as soon as the page loads.

// --- Event Listeners ---

// NEW: A function that unmutes the music and then removes itself.
function unmuteOnFirstMove() {
    if (!isMusicUnmuted) {
        backgroundMusic.muted = false;
        isMusicUnmuted = true;
        // Now that the music is unmuted, we don't need to listen for this anymore.
        document.removeEventListener('mousemove', unmuteOnFirstMove);
    }
}

// NEW: Listen for the first mouse movement to trigger the unmute.
document.addEventListener('mousemove', unmuteOnFirstMove);

document.addEventListener('keypress', () => {
    // The unmute logic has been REMOVED from here.
    // This listener is now only responsible for starting the game.
    if (!gameStarted) {
        startGame();
    }
});

colorButtons.forEach(button => {
    button.addEventListener('click', handleUserClick);
});

// --- Game Logic Functions ---

function startGame() {
    gameStarted = true;
    pauseBackgroundMusic(); // Pause music when game starts
    levelTitle.classList.remove('pulsate');
    levelUp();
}

function levelUp() {
    userSeq = [];
    level++;
    levelTitle.innerText = `Level ${level}`;
    const randomColor = buttonColors[Math.floor(Math.random() * 4)];
    gameSeq.push(randomColor);
    playSequence();
}

async function playSequence() {
    toggleButtons(false); 
    await sleep(500); 
    for (const color of gameSeq) {
        const button = document.getElementById(color);
        flash(button);
        await sleep(600 - (level * 10));
    }
    toggleButtons(true);
}

function handleUserClick(event) {
    if (!gameStarted) return;
    const userChosenColor = event.target.id;
    userSeq.push(userChosenColor);
    const button = document.getElementById(userChosenColor);
    flash(button);
    checkAnswer(userSeq.length - 1);
}

function checkAnswer(currentLevel) {
    if (gameSeq[currentLevel] === userSeq[currentLevel]) {
        if (userSeq.length === gameSeq.length) {
            setTimeout(levelUp, 1000);
        }
    } else {
        gameOver();
    }
}

function gameOver() {
    playSound(gameOverSound); 
    body.classList.add('game-over');
    levelTitle.innerHTML = `Game Over! Your Score: ${level - 1}<br>Press Any Key to Restart`;
    levelTitle.classList.add('pulsate');
    
    if (level - 1 > highScore) {
        highScore = level - 1;
        highScoreDisplay.innerText = `High Score: ${highScore}`;
        localStorage.setItem('simonHighScore', highScore);
    }
    
    setTimeout(() => {
        body.classList.remove('game-over');
        playBackgroundMusic(); 
    }, 1500);

    resetGame();
}

function resetGame() {
    gameStarted = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}

// --- Helper & Utility Functions ---

function flash(button) {
    playSound(beepSound);
    button.classList.add('flash');
    setTimeout(() => {
        button.classList.remove('flash');
    }, 250);
}

function playSound(soundElement) {
    soundElement.currentTime = 0;
    soundElement.play();
}

// --- Music Control Functions ---
function playBackgroundMusic() {
    backgroundMusic.volume = 0.3;
    backgroundMusic.play().catch(error => {
        console.log("Audio play failed initially but will start on user interaction.", error);
    });
}

function pauseBackgroundMusic() {
    backgroundMusic.pause();
}
// --- End of Functions ---

function toggleButtons(enabled) {
    colorButtons.forEach(button => {
        button.disabled = !enabled;
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}