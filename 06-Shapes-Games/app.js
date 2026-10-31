const GAME_DURATION = 30;
const SHAPES = ["square", "diamond", "circle"];
const BEST_SCORE_KEY = "shapes-game-best-score";

const timerElement = document.querySelector("#timer");
const scoreElement = document.querySelector("#score");
const bestScoreElement = document.querySelector("#best-score");
const targetElement = document.querySelector("#target");
const feedbackElement = document.querySelector("#feedback");
const statusElement = document.querySelector("#game-status");
const startButton = document.querySelector("#start-button");
const shapeButtons = document.querySelectorAll("[data-shape]");

let score = 0;
let timeLeft = GAME_DURATION;
let targetShape = null;
let timerId = null;
let deadlineAt = 0;
let isPlaying = false;

const readBestScore = () => {
    try {
        return Number.parseInt(localStorage.getItem(BEST_SCORE_KEY), 10) || 0;
    } catch {
        return 0;
    }
};

const saveBestScore = (value) => {
    try {
        localStorage.setItem(BEST_SCORE_KEY, String(value));
    } catch {
        feedbackElement.textContent = "Your browser could not save the best score.";
    }
};

let bestScore = readBestScore();
bestScoreElement.textContent = bestScore;

const setShapesEnabled = (enabled) => {
    shapeButtons.forEach((button) => {
        button.disabled = !enabled;
    });
};

const chooseTarget = () => {
    const choices = SHAPES.filter((shape) => shape !== targetShape);
    targetShape = choices[Math.floor(Math.random() * choices.length)];
    targetElement.textContent = targetShape;
};

const updateScore = () => {
    scoreElement.textContent = score;

    if (score > bestScore) {
        bestScore = score;
        bestScoreElement.textContent = bestScore;
        saveBestScore(bestScore);
    }
};

const finishGame = () => {
    if (!isPlaying) {
        return;
    }

    window.clearInterval(timerId);
    timerId = null;
    isPlaying = false;
    setShapesEnabled(false);
    targetElement.textContent = "Time's up!";
    feedbackElement.textContent = `You scored ${score} point${score === 1 ? "" : "s"}. Try again!`;
    startButton.disabled = false;
    startButton.textContent = "Play again";
    statusElement.textContent = `Game over. Your score is ${score}.`;
};

const startGame = () => {
    window.clearInterval(timerId);
    score = 0;
    timeLeft = GAME_DURATION;
    deadlineAt = Date.now() + GAME_DURATION * 1000;
    targetShape = null;
    isPlaying = true;

    scoreElement.textContent = score;
    timerElement.textContent = `${timeLeft}s`;
    feedbackElement.textContent = "Tap the matching shape to score a point.";
    startButton.disabled = true;
    startButton.textContent = "Game in progress";
    setShapesEnabled(true);
    chooseTarget();
    statusElement.textContent = `Game started. Find the ${targetShape}.`;

    timerId = window.setInterval(() => {
        timeLeft = Math.max(0, Math.ceil((deadlineAt - Date.now()) / 1000));
        timerElement.textContent = `${timeLeft}s`;

        if (timeLeft === 0) {
            finishGame();
        }
    }, 250);
};

const handleShapeClick = (event) => {
    if (!isPlaying) {
        return;
    }

    if (Date.now() >= deadlineAt) {
        timeLeft = 0;
        timerElement.textContent = "0s";
        finishGame();
        return;
    }

    const selectedShape = event.currentTarget.dataset.shape;

    if (selectedShape !== targetShape) {
        feedbackElement.textContent = "Not quite. Keep looking for the target shape.";
        statusElement.textContent = `That was the ${selectedShape}. Find the ${targetShape}.`;
        return;
    }

    score += 1;
    updateScore();
    feedbackElement.textContent = "Correct! Find the next shape.";
    chooseTarget();
    statusElement.textContent = `Correct. Your score is ${score}. Find the ${targetShape}.`;
};

shapeButtons.forEach((button) => {
    button.disabled = true;
    button.addEventListener("click", handleShapeClick);
});

startButton.addEventListener("click", startGame);
setShapesEnabled(false);
