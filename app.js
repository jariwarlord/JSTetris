
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const blockSize = 20;
const playfieldWidth = canvas.width / blockSize;
const playfieldHeight = canvas.height / blockSize;

let playfield = [];
let currentPiece = {};
let gameInterval;
let level = 1;
let speed = 1000 / level;

const levelValueElement = document.getElementById('levelValue');


function createPlayfield() {
    for (let row = 0; row < playfieldHeight; row++) {
        playfield[row] = [];
        for (let col = 0; col < playfieldWidth; col++) {
            playfield[row][col] = 0;
        }
    }
}


function drawBlock(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    context.strokeStyle = 'black';
    context.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
}


function drawPlayfield() {
    for (let row = 0; row < playfieldHeight; row++) {
        for (let col = 0; col < playfieldWidth; col++) {
            const block = playfield[row][col];
            if (block) {
                drawBlock(col, row, block);
            }
        }
    }
}


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


function drawPiece() {
    currentPiece.piece.forEach((row, y) => {
        row.forEach((block, x) => {
            if (block) {
                drawBlock(currentPiece.x + x, currentPiece.y + y, 'cyan');
            }
        });
    });
}


function movePieceDown() {
    currentPiece.y++;
    if (collides()) {
        currentPiece.y--;
        mergePiece();
        currentPiece = generatePiece();
        if (collides()) {
            gameOver();
        }
    }
}


function mergePiece() {
    currentPiece.piece.forEach((row, y) => {
        row.forEach((block, x) => {
            if (block) {
                playfield[currentPiece.y + y][currentPiece.x + x] = 1;
            }
        });
    });
}


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


function gameOver() {
    clearInterval(gameInterval);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '30px Arial';
    context.fillStyle = 'red';
    context.textAlign = 'center';
    context.fillText('Game Over', canvas.width / 2, canvas.height / 2);
}


function clearPlayfield() {
    playfield = playfield.map(row => row.fill(0));
}


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


function rotatePiece() {
    const tempPiece = currentPiece.piece;
    currentPiece.piece = currentPiece.piece[0].map((_, i) =>
        currentPiece.piece.map(row => row[i]).reverse()
    );
    if (collides()) {
        currentPiece.piece = tempPiece;
    }
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayfield();
    drawPiece();
    movePieceDown();
}


function init() {
    createPlayfield();
    currentPiece = generatePiece();
    gameInterval = setInterval(gameLoop, 500);
    document.addEventListener('keydown', handleKeyPress);
}


init();
