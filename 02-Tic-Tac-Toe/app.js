let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let scoreO = document.querySelector("#score-o");
let scoreX = document.querySelector("#score-x");
let scoreDraw = document.querySelector("#score-draw");
let modeSelect = document.querySelector("#mode");

let turnO = true; // playerx , playerO
let count = 0;
let scoreCountPlayerO=0;
let scoreCountPlayerX=0;
let scoreCountDraws=0;
let gameOver = false;
const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],  // winnig patterns
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
];

scoreCountPlayerO=Number(localStorage.getItem("PlayerO")) || 0;
scoreCountPlayerX=Number(localStorage.getItem("PlayerX")) || 0;
scoreO.textContent=localStorage.getItem("PlayerO") || "0";
scoreX.textContent=localStorage.getItem("PlayerX") || "0";
scoreCountDraws=Number(localStorage.getItem("Draws")) || 0;
scoreDraw.textContent=scoreCountDraws;
modeSelect.value = localStorage.getItem("Mode") === "computer" ? "computer" : "two";


const resetGame = () => {
    turnO = true;
    count = 0;
    gameOver = false;
    enableBoxes();
    scoreCountPlayerO=0;
    scoreCountPlayerX=0;
    scoreCountDraws=0;
    localStorage.setItem("PlayerO",String(scoreCountPlayerO));
    localStorage.setItem("PlayerX",String(scoreCountPlayerX));
    localStorage.setItem("Draws",String(scoreCountDraws));
    scoreDraw.textContent=scoreCountDraws;
    scoreO.textContent=localStorage.getItem("PlayerO");
    scoreX.textContent=localStorage.getItem("PlayerX");
    msgContainer.classList.add("hide");
};



const playMove = (box) => {
    box.innerText = turnO ? "O" : "X";
    turnO = !turnO;
    box.disabled = true;  // agr box ek baar click ho jaye to usko dubara na click kr paye
    count++;
    let isWinner = checkWinner();
    if (count === 9 && !isWinner) {
        gameDraw();
    }
};

const vsComputer = () => modeSelect.value === "computer";

// Finds a cell that completes a line for `mark`, or -1.
const findLineCell = (mark) => {
    for (let [a, b, c] of winPatterns) {
        let line = [a, b, c];
        let marks = line.filter((i) => boxes[i].innerText === mark);
        let empty = line.filter((i) => boxes[i].innerText === "");
        if (marks.length === 2 && empty.length === 1) {
            return empty[0];
        }
    }
    return -1;
};

const computerMove = () => {
    if (gameOver) return;
    let empty = [];
    boxes.forEach((b, i) => { if (b.innerText === "") empty.push(i); });
    let pick = findLineCell("X");
    if (pick === -1) pick = findLineCell("O");
    if (pick === -1 && empty.includes(4)) pick = 4;
    if (pick === -1) pick = empty[Math.floor(Math.random() * empty.length)];
    playMove(boxes[pick]);
};

boxes.forEach((box) => {
    box.addEventListener("click",() => {
        if (gameOver || (vsComputer() && !turnO)) return;
        playMove(box);
        if (vsComputer() && !gameOver) {
            setTimeout(computerMove, 300);
        }
    });
});

modeSelect.addEventListener("change", () => {
    localStorage.setItem("Mode", modeSelect.value);
    startNewRound();
});


const gameDraw = () => {
    gameOver = true;
    scoreCountDraws++;
    scoreDraw.textContent = scoreCountDraws;
    localStorage.setItem("Draws", String(scoreCountDraws));
    msg.innerText = `Game was a Draw.`;
    msgContainer.classList.remove("hide"); 
    disableBoxes();
};

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
        box.classList.remove("win");
    }
};


const showWinner = (winner) => {
    gameOver = true;
    msg.innerText = `Congratulations, Winner is ${winner}`;
    if(winner==="O"){
        scoreCountPlayerO++;
        scoreO.textContent=scoreCountPlayerO;
        localStorage.setItem("PlayerO",String(scoreCountPlayerO));
        scoreO.textContent=localStorage.getItem("PlayerO");
   
    }
    if(winner==="X"){
        scoreCountPlayerX++;
        scoreX.textContent=scoreCountPlayerX;
        localStorage.setItem("PlayerX",String(scoreCountPlayerX));
        scoreX.textContent=localStorage.getItem("PlayerX");
    }
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1val = boxes[pattern[0]].innerText;
        let pos2val = boxes[pattern[1]].innerText;
        let pos3val = boxes[pattern[2]].innerText;  // boxes me konse position pe konsi value h
        
        if(pos1val != "" && pos2val != "" && pos3val != ""){
            if(pos1val === pos2val && pos2val === pos3val){
                boxes[pattern[0]].classList.add("win");
                boxes[pattern[1]].classList.add("win");
                boxes[pattern[2]].classList.add("win");
                showWinner(pos1val);
                return true;
            }
        }
    }
    return false;
};


const startNewRound = () => {
    turnO = true;
    count = 0;
    gameOver = false;
    enableBoxes();
    msgContainer.classList.add("hide");
};

newGameBtn.addEventListener("click", startNewRound);
resetBtn.addEventListener("click", resetGame);
