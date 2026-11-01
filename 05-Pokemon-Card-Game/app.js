const POKEMON = [
    { id: 25, name: 'Pikachu', type: 'Electric' },
    { id: 4, name: 'Charmander', type: 'Fire' },
    { id: 1, name: 'Bulbasaur', type: 'Grass/Poison' },
    { id: 7, name: 'Squirtle', type: 'Water' }
];

const BACK_IMAGE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/0.png';

let cards = [];
let flippedCards = [];
let matchedCards = [];
let moves = 0;
let timer = 0;
let timerInterval = null;
let gameStarted = false;
let lockBoard = false;

const gameBoard = document.getElementById('game-board');
const movesEl = document.getElementById('moves');
const timerEl = document.getElementById('timer');
const playAgainBtn = document.getElementById('play-again');

function initGame() {
    cards = [...POKEMON, ...POKEMON];
    shuffle(cards);
    matchedCards = [];
    flippedCards = [];
    moves = 0;
    timer = 0;
    gameStarted = false;
    lockBoard = false;
    movesEl.textContent = '0';
    timerEl.textContent = '0:00';
    playAgainBtn.hidden = true;
    clearInterval(timerInterval);
    renderBoard();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderBoard() {
    gameBoard.innerHTML = '';
    cards.forEach((pokemon, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.pokemonId = pokemon.id;

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" alt="${pokemon.name}">
                    <h3>${pokemon.name}</h3>
                    <p>Type: ${pokemon.type}</p>
                </div>
                <div class="card-back">
                    <img src="${BACK_IMAGE}" alt="Card Back">
                </div>
            </div>
        `;

        card.addEventListener('click', () => handleCardClick(card, index));
        gameBoard.appendChild(card);
    });
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
        flippedCards = [];
        lockBoard = false;

        if (matchedCards.length === cards.length) {
            endGame();
        }
    } else {
        setTimeout(() => {
            first.card.classList.remove('flipped');
            second.card.classList.remove('flipped');
            flippedCards = [];
            lockBoard = false;
        }, 1000);
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    playAgainBtn.hidden = false;
}

playAgainBtn.addEventListener('click', initGame);

initGame();