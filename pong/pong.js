var canvas;
var ctx;

var ballX = 300;
var ballY = 100;
var ballSpeedX = 15;
var ballSpeedY =5;
var ballHeight = 12;
var ballWidth = 12;

var paddle1Y;
var paddle2Y;
var paddle1Size = 100;
var paddle2Size = 100;

var rBouncePointX;
var lBouncePointX;
var rLaunchPointX;
var lLaunchPointX;

var player1Score = 0;
var player2Score = 0;
var scoreX = 250;
var scoreY = 75;
var fontSize = 120;

var PADDLE_THICKNESS = 15;
var PADDLE_OFFSET = 20;
var PADDLE_SPEED = 15;

var FPS = 30;
var FRAME_RATE = 1000 / FPS;

var WINNING_SCORE = 11;
var winner = 0;


window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    paddle1Y = canvas.height / 2 - (paddle1Size / 2);
    paddle2Y = canvas.height / 2 - (paddle2Size / 2);

    rBouncePointX = canvas.width - PADDLE_OFFSET - PADDLE_THICKNESS - ballWidth;
    lBouncePointX = PADDLE_OFFSET + PADDLE_THICKNESS;

    rLaunchPointX = canvas.width - PADDLE_OFFSET - PADDLE_THICKNESS - 100;
    lLaunchPointX = PADDLE_OFFSET + PADDLE_THICKNESS + 100;

    window.addEventListener("keydown", doKeyDown, false);
    window.addEventListener("mousedown", doMouseDown, false);

    setInterval(draw, FRAME_RATE);
};


function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    for (var i = 0; i < canvas.height; i+=40) {
        ctx.fillRect(canvas.width / 2, i, 5, 20);
    }
    if (winner !== 0) {
        showText();
        showWinner(winner);
        return;
    }
    else {
        moveBall();
        movePaddle();
        showText();
    }
}


function moveBall() {
    ctx.fillStyle = "white";
    // Ball approaches right paddle
    if (ballX >= rBouncePointX) {
        if (struckPaddle(2)) {
            bounceBall(paddle2Y);
        }
        else if (ballX >= canvas.width) {
            player1Score++;
            if (player1Score >= WINNING_SCORE) {
                winner = 1;
            }
            else {
                resetBall(rLaunchPointX);
            }
        }
    }
    else if (ballX <= lBouncePointX) {
        if (struckPaddle(1)) {
            bounceBall(paddle1Y);
        }
        else if (ballX <= 0) {
            player2Score++;
            if (player2Score >= WINNING_SCORE) {
                winner = 2;
            }
            else {
                resetBall(lLaunchPointX);
            }
        }
    }
    if (winner === 0) {
        if (ballY >= canvas.height - ballHeight || ballY <= 0) {
            ballSpeedY = -ballSpeedY;
        }
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        ctx.fillRect(ballX, ballY, ballWidth, ballHeight);
    }
}


function struckPaddle(pNum) {
    var yRange;
    if (pNum == 1) {
        yRange = ballY >= paddle1Y && ballY <= paddle1Y + paddle1Size;
        return yRange && ballX >= lBouncePointX - PADDLE_THICKNESS;
    }
    else {
        yRange = ballY >= paddle2Y && ballY <= paddle2Y + paddle2Size;
        return yRange && ballX <= rBouncePointX + PADDLE_THICKNESS;
    }
}


function bounceBall(paddleY) {
    ballSpeedX = -ballSpeedX;
    var deltaY = ballY - (paddleY + (paddle1Size / 2));
    ballSpeedY = deltaY * 0.45;
}


function resetBall(launchPoint) {
    ballX = launchPoint;
    ballY = canvas.height / 4;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = -ballSpeedY + Math.floor(Math.random() * (6));
    if (Math.abs(ballSpeedY > 10)) {
        ballSpeedY = 5;
    }
}


function movePaddle() {
    ctx.fillStyle = "white";
    // Paddle 1
    ctx.fillRect(PADDLE_OFFSET, paddle1Y, PADDLE_THICKNESS, paddle1Size);
    // Paddle 2
    ctx.fillRect(canvas.width - PADDLE_THICKNESS - PADDLE_OFFSET, paddle2Y,
        PADDLE_THICKNESS, paddle2Size);
}


function doKeyDown(evt) {
    // Use up and down arrow keys for right paddle
    if (evt.keyCode == 38 && paddle2Y > 0) {
        paddle2Y -= PADDLE_SPEED;
    }
    else if (evt.keyCode == 40 && paddle2Y < canvas.height - paddle2Size) {
        paddle2Y += PADDLE_SPEED;
    }
    // User w and s keys for left paddle
    else if (evt.keyCode == 87 && paddle1Y > 0) {
        paddle1Y -= PADDLE_SPEED;
    }
    else if (evt.keyCode == 83 && paddle1Y < canvas.height - paddle1Size) {
        paddle1Y += PADDLE_SPEED;
    }
}


function doMouseDown() {
    if (winner !== 0) {
        resetGame();
    }
}


function resetGame() {
    player1Score = 0;
    player2Score = 0;
    if (winner === 1) {
        ballX = lLaunchPointX;
        ballSpeedX = 15;
    }
    else {
        ballX = rLaunchPointX;
        ballSpeedX = -15;
    }
    ballSpeedY = 5;

    paddle1Y = canvas.height / 2 - (paddle1Size / 2);
    paddle2Y = canvas.height / 2 - (paddle2Size / 2);

    winner = 0;
}


function showText() {
    ctx.fillStyle = "white";
    ctx.font = fontSize + "px ArcadeClassic";
    ctx.textAlign = "center";
    ctx.fillText(player1Score, scoreX, scoreY);
    ctx.fillText(player2Score, canvas.width - scoreX, scoreY);
}


function showWinner(player) {
    ctx.fillStyle = "white";
    ctx.font = (fontSize - 60) + "px ArcadeClassic";
    ctx.textAlign = "center";
    ctx.fillText("Player  " + player + "  won!", canvas.width / 2, 300);
}