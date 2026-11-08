let expression = "";

const display = document.querySelector("#display");

const numbers = document.querySelectorAll(".number");
const signs = document.querySelectorAll(".sign");
const clear = document.querySelector("#clear");
const equal = document.querySelector(".equal");
const backspace = document.querySelector("#backspace");


localStorage.setItem("output-status","not-generated");

numbers.forEach(button => {
    button.addEventListener("click", () => {
            if(localStorage.getItem("output-status")==="generated"){
            clearAll();
            localStorage.setItem("output-status","not-generated");
        }
        expression += button.dataset.number;
        display.value = expression;
    });
});

signs.forEach(button => {
    button.addEventListener("click", () => {
        localStorage.setItem("output-status","not-generated");
        if (button.id === "clear" || button.id === "backspace") return;

        expression += button.dataset.sign;
        display.value = expression;
    });
});

clear.addEventListener("click", () => {
    clearAll();
});

function clearAll(){
    expression = "";
    display.value = "";
    localStorage.setItem("output-status","not-generated");
}

backspace.addEventListener("click", () => {
    localStorage.setItem("output-status","not-generated");
    expression = expression.slice(0, -1);
    display.value = expression;
});

function calculate() {
    if (!expression) return;

    try {
        const answer = eval(expression);

        if (!Number.isFinite(answer)) {
            display.value = "Cannot divide by zero";
            expression = "";
            return;
        }

        display.value = answer;
        expression = answer.toString();
        localStorage.setItem("output-status","generated");
    } catch (error) {
        display.value = "Error";
        expression = "";
    }
}

equal.addEventListener("click", calculate);

document.addEventListener("keydown", event => {
    
    if (/^[0-9.]$/.test(event.key)) {
        if(localStorage.getItem("output-status")==="generated"){
            clearAll();
            localStorage.setItem("output-status","not-generated");
        }
        expression += event.key;
        display.value = expression;
        return;
    }

    if (["+", "-", "*", "/"].includes(event.key)) {
        localStorage.setItem("output-status","not-generated");
        expression += event.key;
        display.value = expression;
        return;
    }

    if (event.key === "Enter") {
        event.preventDefault();
        calculate();
        return;
    }

    if (event.key === "Escape") {
        expression = "";
        display.value = "";
        localStorage.setItem("output-status","not-generated");
        return;
    }

    if (event.key === "Backspace") {
        localStorage.setItem("output-status","not-generated");
        expression = expression.slice(0, -1);
        display.value = expression;
    }
});