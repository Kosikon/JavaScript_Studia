const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const numBallsInput = document.getElementById('numBalls');
const distanceInput = document.getElementById('distance');
const gravityInput = document.getElementById('gravity');
const speedInput = document.getElementById('speed');

let balls = [];
let animationFrameId;
let running = false;

class Ball {
    constructor(x, y, vx, vy, radius) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
    }

    move() {
        // Grawitacja miêdzy kulkami
        for (let i = 0; i < balls.length; i++) {
            if (balls[i] !== this) {
                const dx = balls[i].x - this.x;
                const dy = balls[i].y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < parseInt(distanceInput.value)) {
                    const force = parseFloat(gravityInput.value) * (1 / (distance * distance)); // Dodano kwadrat odleg³oœci
                    this.vx += force * dx / distance;
                    this.vy += force * dy / distance;
                }
            }
        }

        // Prêdkoœæ
        this.x += this.vx * parseFloat(speedInput.value);
        this.y += this.vy * parseFloat(speedInput.value);

        // Odbicie od krawêdzi
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.vx *= -1;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.vy *= -1;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
        ctx.fill();
        ctx.closePath();
    }
}

function calculateDistance(ball1, ball2) {
    const dx = ball1.x - ball2.x;
    const dy = ball1.y - ball2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function drawLine(ball1, ball2) {
    ctx.beginPath();
    ctx.moveTo(ball1.x, ball1.y);
    ctx.lineTo(ball2.x, ball2.y);
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.stroke();
    ctx.closePath();
}

function createBalls(numBalls) {
    balls = [];
    for (let i = 0; i < numBalls; i++) {
        const radius = Math.random() * 10 + 5;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const vx = 0;
        const vy = 0;
        balls.push(new Ball(x, y, vx, vy, radius));
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    balls.forEach(ball => {
        ball.move();
        ball.draw();
    });

    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const distance = calculateDistance(balls[i], balls[j]);
            if (distance < parseInt(distanceInput.value)) {
                drawLine(balls[i], balls[j]);
            }
        }
    }

    if (running) {
        animationFrameId = requestAnimationFrame(update);
    }
}

startButton.addEventListener('click', () => {
    if (!running) {
        running = true;
        createBalls(parseInt(numBallsInput.value));
        update();
    }
});

resetButton.addEventListener('click', () => {
    running = false;
    cancelAnimationFrame(animationFrameId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls = [];
});