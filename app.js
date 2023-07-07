// Game variables
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const blockSize = 20;
const playfieldWidth = canvas.width / blockSize;
const playfieldHeight = canvas.height / blockSize;

let playfield = [];
let currentPiece = {};
let gameInterval;
let score = 0;
let level = 1;
let speed = 500;

// Initialize the playfield
function createPlayfield() {
    for (let row = 0; row < playfieldHeight; row++) {
        playfield[row] = [];
        for (let col = 0; col < playfieldWidth; col++) {
            playfield[row][col] = 0;
        }
    }
}

// Draw a block on the canvas
function drawBlock(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    context.strokeStyle = 'black';
    context.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
}

// Draw the playfield
function drawPlayfield() {
    for (let row = 0; row < playfieldHeight; row++) {
        for (let col = 0; col < playfieldWidth; col++) {
            const block = playfield[row][col];
            if (block) {
                drawBlock(col, row, 'gray');
            }
        }
    }
}

// Generate a random Tetromino piece
function generatePiece() {
    const pieces = [
        [[1, 1, 1, 1]],
        [[1, 1], [1, 1]],
        [[1, 1, 0], [0, 1, 1]],
        [[0, 1, 1], [1, 1, 0]],
        [[1, 1, 1], [0, 1, 0]],
        [[1, 1, 1], [1, 0, 0]],
        [[1, 1, 1], [0, 0, 1]]
    ];

    const piece = pieces[Math.floor(Math.random() * pieces.length)];
    return {
        piece,
        x: Math.floor((playfieldWidth - piece[0].length) / 2),
        y: 0
    };
}

// Draw the current piece on the playfield
function drawPiece() {
    currentPiece.piece.forEach((row, y) => {
        row.forEach((block, x) => {
            if (block) {
                drawBlock(currentPiece.x + x, currentPiece.y + y, 'cyan');
            }
        });
    });
}


// Move the current piece down
function movePieceDown() {
    currentPiece.y++;
    if (collides()) {
        currentPiece.y--;
        mergePiece();
        clearRows();
        currentPiece = generatePiece();
        if (collides()) {
            gameOver();
        }
    }
}

// Merge the current piece with the playfield
function mergePiece() {
    currentPiece.piece.forEach((row, y) => {
        row.forEach((block, x) => {
            if (block) {
                playfield[currentPiece.y + y][currentPiece.x + x] = 1;
            }
        });
    });
}

// Check if the current piece collides with the playfield or the borders
function collides() {
    for (let row = 0; row < currentPiece.piece.length; row++) {
        for (let col = 0; col < currentPiece.piece[row].length; col++) {
            if (
                currentPiece.piece[row][col] &&
                (playfield[currentPiece.y + row] && playfield[currentPiece.y + row][currentPiece.x + col]) !== 0
            ) {
                return true;
            }
        }
    }
    return false;
}


function clearRows() {
    let rowsCleared = 0;

    for (let row = playfieldHeight - 1; row >= 0; row--) {
        if (playfield[row].every(block => block !== 0)) {
            playfield.splice(row, 1);
            playfield.unshift(new Array(playfieldWidth).fill(0));
            rowsCleared++;
        }
    }

    if (rowsCleared > 0) {
        score += rowsCleared * 10 * level;
        updateScore();
        updateLevel();
        updateSpeed();
    }
}


function gameOver() {
    clearInterval(gameInterval);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '30px Arial';
    context.fillStyle = 'red';
    context.textAlign = 'center';
    context.fillText('Game Over', canvas.width / 2, canvas.height / 2);
}

// Clear the playfield
function clearPlayfield() {
    playfield = playfield.map(row => row.fill(0));
}

// Handle key presses
function handleKeyPress(event) {
    switch (event.code) {
        case 'ArrowLeft':
            currentPiece.x--;
            if (collides()) {
                currentPiece.x++;
            }
            break;
        case 'ArrowRight':
            currentPiece.x++;
            if (collides()) {
                currentPiece.x--;
            }
            break;
        case 'ArrowDown':
            movePieceDown();
            break;
        case 'ArrowUp':
            rotatePiece();
            break;
    }
}

// Rotate the current piece
function rotatePiece() {
    const tempPiece = currentPiece.piece;
    currentPiece.piece = currentPiece.piece[0].map((_, i) =>
        currentPiece.piece.map(row => row[i]).reverse()
    );
    if (collides()) {
        currentPiece.piece = tempPiece;
    }
}

// Update the score display
function updateScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = score;
}

// Update the level display
function updateLevel() {
    const levelElement = document.getElementById('level');
    levelElement.textContent = level;
}

// Update the game speed based on the current level
function updateSpeed() {
    speed = 500 - (level - 1) * 50;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}
function updateScoreDisplay(){
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = score;

}
function updateLevelDisplay(){
    const levelElement = document.getElementById('level');
    levelElement.textContent = level;
}
// Game loop
function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayfield();
    drawPiece();
    movePieceDown();
}

// Initialize the game
function init() {
    createPlayfield();
    currentPiece = generatePiece();
    gameInterval = setInterval(gameLoop, speed);
    document.addEventListener('keydown', handleKeyPress);
    updateScore();
    updateLevel();
}

// Start the game
init();
