let expression = "";

const display = document.querySelector("#display");
+= button.dataset.sign;
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
