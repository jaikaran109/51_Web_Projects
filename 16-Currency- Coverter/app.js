
// These 5 lines is to select the elements from out HTML
// Here i use getElementById but i prefer you to use .querySelector - by using . or # bcz getElementById method is very old

const currencyFirstE1 = document.getElementById("currency-first");  

const worthFirstE1 = document.getElementById("worth-first");

const currencySecondE1 = document.getElementById("currency-second");

const worthSecondE1 = document.getElementById("worth-second");

const exchangeRateE1 = document.getElementById("exchange-rate");


updateRate()  // -- see the magic on screen , when the page refresh then it call the funtion and give the current values like it changes 1 USD = 94.70 INR but if i comment this then current value disappear and the default value that i have write on my html will show

function updateRate(){
    // console.log("changed");-- it is working - check in console
    fetch(
        `https://v6.exchangerate-api.com/v6/a1b034aa337f86a397c8908c/latest/${currencyFirstE1.value}`   // --  if fetch the API
    )
    .then((res) => res.json())  // Converts the raw data to JSON
    .then((data) => {
        const rate = data.conversion_rates[currencySecondE1.value];
        console.log(rate);   // fit this data according to our HTML code
        exchangeRateE1.innerText = `1 ${currencyFirstE1.value} = ${rate + " " + currencySecondE1.value}`;

    worthSecondE1.value = (worthFirstE1.value * rate).toFixed(2)   
    });
}

// let me check my code 


currencyFirstE1.addEventListener("change",updateRate);  // when value of First currency changes then immediately (i forgot the spelling - LOL 😂 -- Now it comes on EGO let me check on google) , it calls the update funct and show the updated value

currencySecondE1.addEventListener("change",updateRate);  // same here

worthFirstE1.addEventListener("input",updateRate); // same here


// NOTE
// currencyFirstE1 -- means the first selector
// currencySecondE1 -- means the second selector
// worthFirstE1 -- means the input value of first selector





// Syntax to get the API
// fetch('https://api.example.com/data')
//   .then(response => response.json()) // Converts the raw data to JSON
//   .then(data => console.log(data))    // Processes your data
//   .catch(error => console.error('Error:', error));
