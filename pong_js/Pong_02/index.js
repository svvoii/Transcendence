const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const paddleWidth = 20,
	paddleHeight = 120,
	paddleSpeed = 8,
	ballRadius = 12,
	initialBallSpeed = 10,
	maxBallSpeed = 40,
	netWidth = 5,
	netColor = "WHITE";

// Draw net on canvas
function drawNet() {

	for (let i = 0; i < canvas.height; i += 15) {
		
		drawRect(canvas.width / 2 - netWidth / 2, i, netWidth, 10, netColor);
		// context.fillRect(canvas.width / 2 - netWidth / 2, i, netWidth, 20);
	}
}

// Draw rectangle on canvas
function drawRect(x, y, width, height, color) {
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
}

// Draw circle on canvas
function drawCircle(x, y, radius, color) {
	context.fillStyle = color;
	context.beginPath();
	context.arc(x, y, radius, 0, Math.PI * 2, false);
	context.closePath();
	context.fill();
}

// Draw text on canvas
function drawText(text, x, y, color, fontSize = 60, fontWeight = 'bold', font = 'Courier New') {
	context.fillStyle = color;
	context.font = `${fontWeight} ${fontSize}px ${font}`;
	context.textAlign = 'center';
	context.fillText(text, x, y);
}

// Create a paddle object
function createPaddle(x, y, width, height, color) {
	return { x, y, width, height, color, score: 0 };
}

// Create a ball object
function createBall(x, y, radius, velocityX, velocityY, color) {
	return { x, y, radius, velocityX, velocityY, color, speed: initialBallSpeed };
}

// Define paddle objects
const user = createPaddle(0, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "WHITE");
const computer = createPaddle(canvas.width - paddleWidth, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "WHITE");

// Define ball object
const ball = createBall(canvas.width / 2, canvas.height / 2, ballRadius, initialBallSpeed, initialBallSpeed, "WHITE");

// Update paddle position based on mouse movement
canvas.addEventListener('mousemove', movePaddle);

function movePaddle(event) {
	const rect = canvas.getBoundingClientRect();
	user.y = event.clientY - rect.top - user.height / 2;
}

// Check for collision between ball and paddle
function collision(ball, paddle) {
	return (
		ball.x + ball.radius > paddle.x &&
		ball.x - ball.radius < paddle.x + paddle.width &&
		ball.y + ball.radius > paddle.y &&
		ball.y - ball.radius < paddle.y + paddle.height
	);
}

// reset ball position and velocity
function resetBall() {
	ball.x = canvas.width / 2;
	ball.y = Math.random() * (canvas.height - ballRadius * 2) + ballRadius;
	ball.velocityX = -ball.velocityX;
	ball.speed = initialBallSpeed;
}

// Update game logic
function update() {
	// Check for score and reset ball if necessary
	if (ball.x - ball.radius < 0) {
		computer.score++;
		resetBall();
	} else if (ball.x + ball.radius > canvas.width) {
		user.score++;
		resetBall();
	}

	// Update ball position
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;

	// Update computer paddle position based on ball position
	computer.y += (ball.y - (computer.y + computer.height / 2)) * 0.1;

	// Top and bottom wall collision
	if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
		ball.velocityY = -ball.velocityY;
	}

	// Determine which paddle the ball is colliding with
	let player = ball.x + ball.radius < canvas.width / 2 ? user : computer;
	if (collision(ball, player)) {
		const collidePoint = ball.y - (player.y + player.height / 2);
		const collisionAngle = (collidePoint / (player.height / 2)) * (Math.PI / 4);
		const direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
		ball.velocityX = direction * ball.speed * Math.cos(collisionAngle);
		ball.velocityY = ball.speed * Math.sin(collisionAngle);

		// Increase ball speed and limit it to maxBallSpeed
		ball.speed += 0.2;
		if (ball.speed > maxBallSpeed) {
			ball.speed = maxBallSpeed;
		}
	}
}

// Render game on canvas
function render() {
	// Clear canvas
	drawRect(0, 0, canvas.width, canvas.height, "BLACK");

	// Draw net
	drawNet();

	// Draw scores
	drawText(user.score, canvas.width / 4, canvas.height / 2, "GRAY", 120, 'bold');
	drawText(computer.score, (3 * canvas.width) / 4, canvas.height / 2, "GRAY", 120, 'bold');

	// Draw paddles
	drawRect(user.x, user.y, user.width, user.height, user.color);
	drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);

	// Draw ball
	drawCircle(ball.x, ball.y, ball.radius, ball.color);

}

// Game loop
function gameLoop() {
	update();
	render();
}

// Start game loop to run 60 frames per second
const framePerSecond = 60;
// setInterval(gameLoop, 1000 / framePerSecond);

