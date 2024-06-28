const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const startButton = document.getElementById('startButton');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');

let ball = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 20,
    color: 'blue',
    speed: 5
};

let hole = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 30,
    color: 'black'
};

let startTime, endTime, timerInterval;
let score = 0;
let isGameRunning = false;

function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = ball.color;
    context.fill();
    context.closePath();
}

function drawHole() {
    context.beginPath();
    context.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
    context.fillStyle = hole.color;
    context.fill();
    context.closePath();
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function detectCollision() {
    const dx = ball.x - hole.x;
    const dy = ball.y - hole.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ball.radius + hole.radius) {
        endTime = new Date().getTime();
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        isGameRunning = false;
        setTimeout(() => {
            alert(`Game Over! Your score is ${score}`);
        }, 100);
        clearInterval(timerInterval);
    }
}

function resetGame() {
    ball.x = Math.random() * canvas.width;
    ball.y = Math.random() * canvas.height;
    hole.x = Math.random() * canvas.width;
    hole.y = Math.random() * canvas.height;
}

window.addEventListener('deviceorientation', (event) => {
    if (!isGameRunning) return;

    let tiltX = event.beta;
    let tiltY = event.gamma;

    ball.x += tiltY / 100;
    ball.y += tiltX / 100;

    if (ball.x < ball.radius) ball.x = ball.radius;
    if (ball.x > canvas.width - ball.radius) ball.x = canvas.width - ball.radius;
    if (ball.y < ball.radius) ball.y = ball.radius;
    if (ball.y > canvas.height - ball.radius) ball.y = canvas.height - ball.radius;

    detectCollision();
});

document.addEventListener('keydown', (event) => {
    if (!isGameRunning) return;

    switch (event.key) {
        case 'ArrowUp':
            ball.y -= ball.speed;
            break;
        case 'ArrowDown':
            ball.y += ball.speed;
            break;
        case 'ArrowLeft':
            ball.x -= ball.speed;
            break;
        case 'ArrowRight':
            ball.x += ball.speed;
            break;
    }

    if (ball.x < ball.radius) ball.x = ball.radius;
    if (ball.x > canvas.width - ball.radius) ball.x = canvas.width - ball.radius;
    if (ball.y < ball.radius) ball.y = ball.radius;
    if (ball.y > canvas.height - ball.radius) ball.y = canvas.height - ball.radius;

    detectCollision();
});

function animate() {
    clearCanvas();
    drawBall();
    drawHole();

    if (isGameRunning) {
        moveBall();
        requestAnimationFrame(animate);
    }
}

function moveBall() { }

function startGame() {
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    isGameRunning = true;
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 100);
    resetGame();
    animate();
}

function updateTimer() {
    const elapsed = Math.floor((new Date().getTime() - startTime) / 1000);
    timerDisplay.textContent = `Time: ${elapsed}`;

    if (elapsed >= 60) {
        isGameRunning = false;
        clearInterval(timerInterval);
        setTimeout(() => {
            alert(`Game Over! Your score is ${score}`);
        }, 100);
    }
}

startButton.addEventListener('click', startGame);