let userScore = 0;
let compScore = 0;

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");

const userScorePara = document.querySelector("#user-score");
const compScorePara = document.querySelector("#computer-score");

const resestBtn=document.querySelector("#reset-btn");
resestBtn.addEventListener('click',(e)=>{
     userScore = 0;
compScore = 0;

    userScorePara.textContent=0;
    compScorePara.textContent=0;
    msg.textContent="Pick your Move !";
    msg.classList.remove("win", "lose");
    msg.classList.add("default-msg-style");
})

const genCompChoice = () => {
    const options = ["rock", "paper", "scissors"];
    const randIdx = Math.floor(Math.random() * 3);
    return options[randIdx];
};


const setMsgState = (state) => {
    msg.classList.remove("win", "lose");
    if (state) msg.classList.add(state);
};

const drawGame = () => {
    msg.innerText = "Game was Draw. Play again.";
    setMsgState(null);
};

const showWinner = (userWin, userChoice, compChoice) => {
    if (userWin) {
        userScore++;
        userScorePara.innerText = userScore;
        msg.innerText = `You win! Your ${userChoice} beats ${compChoice}`;
        setMsgState("win");
    } else {
        compScore++;
        compScorePara.innerText = compScore;
        msg.innerText = `You lost. ${compChoice} beats your ${userChoice}`;
        setMsgState("lose");
    }
};

const playGame = (userChoice) => {
    //Generate computer choice
    const compChoice = genCompChoice();

    if (userChoice === compChoice) {
        //Draw Game
        drawGame();
    } else {
        let userWin = true;
        if (userChoice === "rock") {
            //scissors, paper
            userWin = compChoice === "paper" ? false : true;
        } else if (userChoice === "paper") {
            //rock, scissors
            userWin = compChoice === "scissors" ? false : true;
        } else {
            //rock, paper
            userWin = compChoice === "rock" ? false : true;
        }
        showWinner(userWin, userChoice, compChoice);
    }
};

choices.forEach((choice) => {
    choice.addEventListener("click", () => {
        const userChoice = choice.getAttribute("id");
        playGame(userChoice);
    });
});



const keyMap = { r: "rock", p: "paper", s: "scissors" };

// Briefly highlights the circle so keyboard players get visual feedback
const flashChoice = (choiceId) => {
    const el = document.querySelector(`#${choiceId}`);
    el.classList.add("key-pressed");
    setTimeout(() => el.classList.remove("key-pressed"), 150);
};

document.addEventListener("keydown", (e) => {
    // Ignore browser shortcuts (e.g. Ctrl+R to reload) and held-down keys
    if (e.ctrlKey || e.metaKey || e.altKey || e.repeat || !e.key) return;

    // Don't hijack typing if an input is ever added to the page
    if (e.target.closest("input, textarea, select, [contenteditable]")) return;

    const choice = keyMap[e.key.toLowerCase()];
    if (choice) {
        flashChoice(choice);
        playGame(choice);
    }
});



const themeToggle = document.querySelector("#theme-toggle");
const root = document.documentElement;

const applyTheme = (theme, save = false) => {
    root.setAttribute("data-theme", theme);

    const isDark = theme === "dark";
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );

    if (save) {
        try {
            localStorage.setItem("theme", theme);
        } catch (e) {
            
        }
    }
};


applyTheme(root.getAttribute("data-theme") || "light");

themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next, true);
});