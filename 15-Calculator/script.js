let expression = "";

const display = document.querySelector("#display");

const numbers = document.querySelectorAll(".number");
const signs = document.querySelectorAll(".sign");
const clear = document.querySelector("#clear");
const equal = document.querySelector(".equal");

numbers.forEach(button => {
    button.addEventListener("click", () => {
        expression += button.dataset.number;
        display.value = expression;
    });
});

signs.forEach(button => {
    button.addEventListener("click", () => {

        if(button.id === "clear") return;

        expression += button.dataset.sign;
        display.value = expression;
    });
});

clear.addEventListener("click", () => {
    expression = "";
    display.value = "";
});

equal.addEventListener("click", () => {
    try{
        const answer = eval(expression);
        display.value = answer;
        expression = answer.toString();
    }
    catch(error){
        display.value = "Error";
        expression = "";
    }
});