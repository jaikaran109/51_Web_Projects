let expression = "";

const display = document.querySelector("#display");

const numbers = document.querySelectorAll(".number");
const signs = document.querySelectorAll(".sign");
const clear = document.querySelector("#clear");
const equal = document.querySelector(".equal");
const backspace = document.querySelector("#backspace");


let operatorStatus=false;
let operatorUsage=false;

numbers.forEach(button => {
    button.addEventListener("click", () => {
            if(operatorStatus){
            clearAll();
            operatorStatus=false;
        }
        operatorUsage=true;
        expression += button.dataset.number;
        display.value = expression;
    });
});

signs.forEach(button => {
    button.addEventListener("click", () => {
        operatorStatus=false;
        if (button.id === "clear" || button.id === "backspace") return;
if(operatorUsage){
 expression += button.dataset.sign;
        display.value = expression;
        operatorUsage=false;
        }
       
    });
});

clear.addEventListener("click", () => {
    clearAll();
});

function clearAll(){
    expression = "";
    display.value = "";
    operatorStatus=false;
    operatorUsage=false;
}

backspace.addEventListener("click", () => {
    operatorStatus=false;
    expression = expression.slice(0, -1);
    if(expression==="")
         operatorUsage=false;
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
        operatorStatus=true;
    } catch (error) {
        display.value = "Error";
        expression = "";
    }
}

equal.addEventListener("click", calculate);

document.addEventListener("keydown", event => {
    
    if (/^[0-9.]$/.test(event.key)) {
        if(operatorStatus){
            clearAll();
            operatorStatus=false;
        }
        operatorUsage=true;
        expression += event.key;
        display.value = expression;
        return;
    }

    if (["+", "-", "*", "/"].includes(event.key)) {
        operatorStatus=false;
        if(operatorUsage){
expression += event.key;
        display.value = expression;
        operatorUsage=false;
        return;
        }
        
    }

    if (event.key === "Enter") {
        event.preventDefault();
        calculate();
        return;
    }

    if (event.key === "Escape") {
        expression = "";
        display.value = "";
        operatorStatus=false;
        return;
    }

    if (event.key === "Backspace") {
        operatorStatus=false;
        expression = expression.slice(0, -1);
        if(expression==="")
         operatorUsage=false;
        display.value = expression;
    }
});