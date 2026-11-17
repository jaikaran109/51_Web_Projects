const POKEMON = [
    { id: 25, name: 'Pikachu', type: 'Electric' },
    { id: 4, name: 'Charmander', type: 'Fire' },
    { id: 1, name: 'Bulbasaur', type: 'Grass/Poison' },
    { id: 7, name: 'Squirtle', type: 'Water' }
];

let cards = [];
let flippedCards = [];
let matchedCards = [];
let moves = 0;
let timerInterval = null;
let gameStarted = false;
let lockBoard = false;
let startTime = null;

const gameBoard = document.getElementById('game-board');
const movesEl = document.getElementById('moves');
const timerEl = document.getElementById('timer');
const playAgainBtn = document.getElementById('play-again');
const winMessage = document.getElementById('win-message');
const bestMoves = document.getElementById('best-moves');
const bestTime = document.getElementById('best-time');
const bestScore = document.getElementById('best-score');

function initGame() {
    cards = [...POKEMON, ...POKEMON];
    shuffle(cards);
    matchedCards = [];
    flippedCards = [];
    moves = 0;
    gameStarted = false;
    lockBoard = false;
    startTime = null;
    movesEl.textContent = '0';
    timerEl.textContent = '0:00';
    playAgainBtn.hidden = true;
    winMessage.hidden = true;
    clearInterval(timerInterval);
    renderBoard();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createCardElement(pokemon, index) {
    const card = document.createElement('button');
    card.className = 'card';
    card.dataset.index = index;
    card.dataset.pokemonId = pokemon.id;
    card.setAttribute('type', 'button');
    card.setAttribute('aria-label', 'Card face down');
    card.setAttribute('aria-pressed', 'false');

    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';

    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    cardFront.setAttribute('aria-hidden', 'true');

    const img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
    img.alt = pokemon.name;
    img.width = 120;
    img.height = 120;

    const h3 = document.createElement('h3');
    h3.textContent = pokemon.name;

    const p = document.createElement('p');
    p.textContent = `Type: ${pokemon.type}`;

    cardFront.appendChild(img);
    cardFront.appendChild(h3);
    cardFront.appendChild(p);

    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.setAttribute('aria-hidden', 'true');

    const backImg = document.createElement('img');
    backImg.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
    backImg.alt = '';
    backImg.width = 80;
    backImg.height = 80;

    cardBack.appendChild(backImg);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.addEventListener('click', () => handleCardClick(card, index));
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick(card, index);
        }
    });

    return card;
}

function renderBoard() {
    gameBoard.innerHTML = '';
    cards.forEach((pokemon, index) => {
        const card = createCardElement(pokemon, index);
        gameBoard.appendChild(card);
    });
}

function updateCardAccessibility(card, isFlipped, isMatched) {
    if (isFlipped || isMatched) {
        card.setAttribute('aria-label', `Card face up, ${card.querySelector('.card-front h3').textContent}`);
        card.setAttribute('aria-pressed', 'true');
        card.querySelector('.card-front').setAttribute('aria-hidden', 'false');
        card.querySelector('.card-back').setAttribute('aria-hidden', 'true');
    } else {
        card.setAttribute('aria-label', 'Card face down');
        card.setAttribute('aria-pressed', 'false');
        card.querySelector('.card-front').setAttribute('aria-hidden', 'true');
        card.querySelector('.card-back').setAttribute('aria-hidden', 'false');
    }
}

function handleCardClick(card, index) {
    if (lockBoard) return;
    if (card.classList.contains('flipped')) return;
    if (matchedCards.includes(index)) return;

    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    card.classList.add('flipped');
    updateCardAccessibility(card, true, false);
    flippedCards.push({ card, index });

    if (flippedCards.length === 2) {
        lockBoard = true;
        moves++;
        movesEl.textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [first, second] = flippedCards;
    const isMatch = cards[first.index].id === cards[second.index].id;

    if (isMatch) {
        matchedCards.push(first.index, second.index);
        first.card.classList.add('matched');
        second.card.classList.add('matched');
        updateCardAccessibility(first.card, true, true);
        updateCardAccessibility(second.card, true, true);
        flippedCards = [];
        lockBoard = false;

        if (matchedCards.length === cards.length) {
            endGame();
        }
    } else {
        setTimeout(() => {
            first.card.classList.remove('flipped');
            second.card.classList.remove('flipped');
            updateCardAccessibility(first.card, false, false);
            updateCardAccessibility(second.card, false, false);
            flippedCards = [];
            lockBoard = false;
        }, 1000);
    }
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function initRecords(){
    bestMoves.textContent=localStorage.getItem("best-moves")|| "0";
bestTime.textContent = localStorage.getItem("best-time") || "0:00";
bestScore.textContent=localStorage.getItem("best-score")|| "0";
if(bestMoves.textContent==="0")
    localStorage.setItem("best-moves","0");
if(bestTime.textContent==="0")
    localStorage.setItem("best-time","0");
if(bestScore.textContent==="0")
    localStorage.setItem("best-score","0");
}

initRecords();

function endGame() {
    clearInterval(timerInterval);
    playAgainBtn.hidden = false;
    winMessage.hidden = false;
    winMessage.textContent = `You won in ${moves} moves and ${timerEl.textContent}!`;
    if(Number(`${moves}`)>=Number(localStorage.getItem("best-moves"))){
bestMoves.textContent=`${moves}`;
localStorage.setItem("best-moves",bestMoves.textContent);
    }
    
    
   let elapsedSeconds = Math.max(
    1,
    Math.floor((Date.now() - startTime) / 1000)
);

const previousBestTime = Number(
    localStorage.getItem("best-time-seconds")
) || Infinity;

if (elapsedSeconds < previousBestTime) {
    localStorage.setItem("best-time-seconds", elapsedSeconds);

    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    bestTime.textContent =
        `${minutes}:${seconds.toString().padStart(2, "0")}`;

    localStorage.setItem("best-time", bestTime.textContent);
}
    elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
if(elapsedSeconds===0){
 elapsedSeconds = Math.max(
    1,
    Math.floor((Date.now() - startTime) / 1000)
);
}
let score = Math.round(10000 / (moves * elapsedSeconds));
if(score>=Number(localStorage.getItem("best-score"))){
bestScore.textContent = score;
localStorage.setItem("best-score",bestScore.textContent);
}

    winMessage.setAttribute('role', 'status');
    winMessage.setAttribute('aria-live', 'polite');
}

playAgainBtn.addEventListener('click', initGame);

initGame();