let expression = "";

const display = document.querySelector("#display");

const numbers = document.querySelectorAll(".number");
const signs = document.querySelectorAll(".sign");
const clear = document.querySelector("#clear");
const equal = document.querySelector(".equal");
const backspace = document.querySelector("#backspace");

numbers.forEach(button => {
    button.addEventListener("click", () => {
        expression += button.dataset.number;
        display.value = expression;
    });
});

signs.forEach(button => {
    button.addEventListener("click", () => {
        if (button.id === "clear" || button.id === "backspace") return;

        expression += button.dataset.sign;
        display.value = expression;
    });
});

clear.addEventListener("click", () => {
    expression = "";
    display.value = "";
});

backspace.addEventListener("click", () => {
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
    } catch (error) {
        display.value = "Error";
        expression = "";
    }
}

equal.addEventListener("click", calculate);

document.addEventListener("keydown", event => {
    if (/^[0-9.]$/.test(event.key)) {
        expression += event.key;
        display.value = expression;
        return;
    }

    if (["+", "-", "*", "/"].includes(event.key)) {
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
        return;
    }

    if (event.key === "Backspace") {
        expression = expression.slice(0, -1);
        display.value = expression;
    }
});