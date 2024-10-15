const gameField = document.getElementById('game-field');
const scoreInf = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const restartBtn = document.getElementById('restart-btn');

const ctx = gameField.getContext('2d');

const audio = new Audio("./assets/audio/assets_audio.mp3")


const colorField = '#000';
const colorSnake = '#FC7CE3';
const colorFood = '#E94D37';

const fieldWidth = gameField.width;
const fieldHeight = gameField.height;
const cellSize = 30;

const initSnake = [
    { x: cellSize * 2, y: 0 },
    { x: cellSize, y: 0 },
    { x: 0, y: 0 },
];

let snake = JSON.parse(JSON.stringify(initSnake));
let snakeHead = {
    x: snake[0].x,
    y: snake[0].y,
};

const food = {
    x: 0,
    y: 0,
};

const speed = {
    x: cellSize,
    y: 0,
};

let score = 0;
let highScore = localStorage.getItem('high-score') || 0;
let interval;

function drawField() {
    ctx.fillStyle = colorField;
    ctx.fillRect(0, 0, fieldWidth, fieldHeight);
}

function drawSnake() {
    for(let index = 0; index < snake.length; index++){
        const snakePart = snake[index];
        if(
            index !== 0 &&
            snakePart.x === snakeHead.x &&
            snakePart.y === snakeHead.y
        ) {
            return gameFinish();
        }
        ctx.fillStyle = colorSnake;
        ctx.fillRect(snakePart.x, snakePart.y, cellSize, cellSize);
    }
}
function drawFood() {
    ctx.fillStyle = colorFood;
    ctx.fillRect(food.x, food.y, cellSize, cellSize);
}

function getRandomPosition() {
    return Math.floor(Math.random() * (fieldWidth / cellSize)) * cellSize;
}

function placeFood() {
    food.x = getRandomPosition();
    food.y = getRandomPosition();
}

function updateScore(newScore) {
    if(score > highScore) {
        highScore = score;
        localStorage.setItem('HighScore', highScore);
    }
    score = newScore;
    scoreInf.textContent = score;
}

function checkAte() {
    if(snakeHead.x === food.x && snakeHead.y === food.y) {
        placeFood();
        updateScore(score + 1);
        audio.play();
        return true;
    }
    return false;
}

function move() {
    snakeHead.x += speed.x;
    snakeHead.y += speed.y;

    if(snakeHead.x < 0) {
        snakeHead.x = fieldWidth - cellSize;
    } else if(snakeHead.x > fieldWidth - cellSize) {
        snakeHead.x = 0;
    } else if(snakeHead.y < 0) {
        snakeHead.y = fieldHeight - cellSize;
    } else if(snakeHead.y > fieldHeight - cellSize) {
        snakeHead.y = 0;
    }
    snake.unshift({
        x: snakeHead.x,
        y: snakeHead.y,
    });
    if(!checkAte()) {
        snake.pop();
    }
}

function changeDirection(ev) {
    const isGoingUp = speed.y < 0;
    const isGoingDown = speed.y > 0;
    const isGoingRight = speed.x > 0;
    const isGoingLeft = speed.x < 0;

    if(ev.key === 'ArrowRight' && !isGoingLeft) {
        speed.x = cellSize;
        speed.y = 0;
    } else if(ev.key === 'ArrowLeft' && !isGoingRight) {
        speed.x = -cellSize;
        speed.y = 0;
    } else if(ev.key === 'ArrowUp' && !isGoingDown) {
        speed.x = 0;
        speed.y = -cellSize;
    } else if(ev.key === 'ArrowDown' && !isGoingUp) {
        speed.x = 0;
        speed.y = cellSize;
    }
}

function nextTick() {
    drawField();
    drawFood();
    drawSnake();
    move();
}

function gameFinish() {
    ctx.clearRect(0, 0, fieldWidth, fieldHeight);
    clearInterval(interval);
    ctx.fillStyle = 'red';
    ctx.font = '50px bold';
    ctx.fillText('Game over :(', 200, 200);
}

function gameStart(){
    snake = JSON.parse(JSON.stringify(initSnake));
    snakeHead = {
        x: snake[0].x,
        y: snake[0].y
    }
    speed.x = cellSize;
    speed.y = 0;
    updateScore(0);
    highScoreEl.textContent = highScore;
    placeFood();
    restartBtn.addEventListener('click', restartGame);
    window.addEventListener('keydown', changeDirection);
    interval = setInterval(nextTick, 200);
}

function restartGame() {
    gameFinish();
    gameStart();
}

window.addEventListener('load', gameStart);