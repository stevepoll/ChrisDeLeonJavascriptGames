var canvas, canvasContext;
var ballX = 75;
var ballY = 75;
var ballSpeedX = 5
var ballSpeedY = 7

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 15;
var paddleX = 400;
var PADDLE_Y;
const PADDLE_OFFSET = 60;
const BALL_RADIUS = 7;

const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_GAP = 2;
const BRICK_COLS = 10;
const BRICK_ROWS = 14;

var brickGrid = new Array(BRICK_COLS);
var bricksLeft = 0;

var mouseX;
var mouseY;

window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");

    PADDLE_Y = canvas.height - PADDLE_THICKNESS - PADDLE_OFFSET;

    var framesPerSecond = 30;
    setInterval(updateAll, 1000 / framesPerSecond);

    canvas.addEventListener("mousemove", updateMousePos);
    resetBricks();
    resetBall();
    // drawBricks();
}


function updateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    // mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseX = evt.clientX;
    // mouseY = evt.clientY - rect.top - root.scrollTop;
    mouseY = evt.clientY;

    paddleX = mouseX - (PADDLE_WIDTH / 2);
    if (paddleX < 0) {
        paddleX = 0;
    }
    else if (paddleX > canvas.width - PADDLE_WIDTH) {
        paddleX = canvas.width - PADDLE_WIDTH
    }

    // cheat to test brick collisions
    /*ballX = mouseX;
    ballY = mouseY;
    ballSpeedX = 3;
    ballSpeedY = -4;*/
}


function updateAll() {
    moveAll();
    drawAll();
}


function ballMove() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX > canvas.width - BALL_RADIUS && ballSpeedX > 0) { // hits off right wall
        ballSpeedX *= -1;
    }
    if (ballX < BALL_RADIUS && ballSpeedX < 0) {                // hits off left wall
        ballSpeedX *= -1;
    }
    if (ballY < BALL_RADIUS) {                                  // hits off top
        ballSpeedY *= -1;
    }
    if (ballHitsPaddle() && ballSpeedY > 0) {                   // hits off paddle
        ballSpeedY *= -1;

        // Calculate distance ball is from middle of paddle
        var delta = ballX - paddleX;
        ballSpeedX = (delta - (PADDLE_WIDTH / 2)) * .35;
    }
    else if (ballY > canvas.height) {
        resetBall();
        resetBricks();
    }
}


function isBrickAtColRow(col, row) {
    if (col >= 0 && col < BRICK_COLS && row >= 0 && row < BRICK_ROWS) {
        var brickIndexUnderCoord = rowColToArrayIndex(col, row);
        return brickGrid[brickIndexUnderCoord];
    }
    else {
        return false;
    }
}


function handleBallBrick() {
    var ballBrickCol = Math.floor(ballX / BRICK_W);
    var ballBrickRow = Math.floor(ballY / BRICK_H);
    var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);

    if (ballBrickCol >=0 && ballBrickCol < BRICK_COLS &&
            ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {
        if (isBrickAtColRow(ballBrickCol, ballBrickRow)) {
            brickGrid[brickIndexUnderBall] = false;
            bricksLeft--;
            // console.log("Bricks left: " + bricksLeft);

            var prevBallX = ballX - ballSpeedX;
            var prevBallY = ballY - ballSpeedY;
            var prevBrickCol = Math.floor(prevBallX / BRICK_W);
            var prevBrickRow = Math.floor(prevBallY / BRICK_H);

            var bothTestsFailed = true;

            if (ballBrickCol != prevBrickCol) {
                if (isBrickAtColRow(prevBrickCol, ballBrickRow) == false) {
                    ballSpeedX *= -1;
                    bothTestsFailed = false;
                }
            }
            if (ballBrickRow != prevBrickRow) {
                if (isBrickAtColRow(ballBrickCol, prevBrickRow) == false) {
                    ballSpeedY *= -1;
                    bothTestsFailed = false;
                }
            }
            if (bothTestsFailed) {
                ballSpeedX *= -1;
                ballSpeedY *= -1;
            }
        }
    }
}


function moveAll() {
    ballMove();
    handleBallBrick();
}


function ballHitsPaddle() {
    var leftEdge = paddleX;
    var rightEdge = leftEdge + PADDLE_WIDTH;
    var topEdge = PADDLE_Y;
    var bottomEdge = topEdge + PADDLE_THICKNESS;

    if (ballX + BALL_RADIUS > leftEdge &&
            ballX - BALL_RADIUS < rightEdge &&
            ballY + BALL_RADIUS > topEdge &&
            ballY < bottomEdge) {

        if (bricksLeft == 0) {
            resetBricks();
        }
        return true;
    }
}


function drawAll() {
    colorRect(0, 0, canvas.width, canvas.height, "black");                  // Clear screen
    colorCircle(ballX, ballY, BALL_RADIUS, "white")                         // Draw ball
    colorRect(paddleX, PADDLE_Y, PADDLE_WIDTH, PADDLE_THICKNESS, "white");  // Draw paddle

    drawBricks();

    // colorText(mouseBrickCol + ", " + mouseBrickRow + ": " + brickIndexUnderMouse,
    // mouseX, mouseY, "yellow");
}


function drawBricks() {
    for (var row = 0; row < BRICK_ROWS; row++) {
        for (var col = 0; col < BRICK_COLS; col++) {
            var arrayIndex = rowColToArrayIndex(col, row);
            // console.log("brick is " + brickGrid[arrayIndex]);
            if (brickGrid[arrayIndex]) {
                colorRect(BRICK_W * col, BRICK_H * row, BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, "blue");
            }
        }
    }
}


function rowColToArrayIndex(col, row) {
    return col + BRICK_COLS * row
}


function resetBricks() {
    bricksLeft = 0

    var i;
    for (i = 0; i < BRICK_COLS * 3; i++) {
        brickGrid[i] = false;
    }
    for (; i < BRICK_COLS * BRICK_ROWS; i++) {
        brickGrid[i] = true
        bricksLeft++;
    }
}


function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}


function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}


function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}


function colorText(showWords, textX, textY, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillText(showWords, textX, textY);
}
