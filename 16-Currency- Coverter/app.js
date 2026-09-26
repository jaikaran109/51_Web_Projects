// Select elements from HTML
const currencyFirstE1 = document.getElementById("currency-first");
const worthFirstE1 = document.getElementById("worth-first");

const currencySecondE1 = document.getElementById("currency-second");
const worthSecondE1 = document.getElementById("worth-second");

const exchangeRateE1 = document.getElementById("exchange-rate");
const errorMessageE1 = document.getElementById("error-message");

const CACHE_KEY = "currencyExchangeRates";

updateRate();

async function updateRate() {
    const firstCurrency = currencyFirstE1.value;
    const secondCurrency = currencySecondE1.value;
    const amount = Number(worthFirstE1.value);

    errorMessageE1.innerText = "";

    try {
        const response = await fetch(
            `https://v6.exchangerate-api.com/v6/a1b034aa337f86a397c8908c/latest/${firstCurrency}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch exchange rates");
        }

        const data = await response.json();

        if (!data.conversion_rates) {
            throw new Error("Invalid exchange rate data");
        }

        // Save latest successful rates to localStorage
        localStorage.setItem(
            `${CACHE_KEY}-${firstCurrency}`,
            JSON.stringify(data)
        );

        convertCurrency(data, firstCurrency, secondCurrency, amount);

    } catch (error) {
        console.error("Currency API error:", error);

        // Try cached data
        const cachedData = localStorage.getItem(
            `${CACHE_KEY}-${firstCurrency}`
        );

        if (cachedData) {
            const data = JSON.parse(cachedData);

            convertCurrency(data, firstCurrency, secondCurrency, amount);

            errorMessageE1.innerText =
                "Using previously saved exchange rates.";
        } else {
            worthSecondE1.value = "";
            exchangeRateE1.innerText = "Exchange rate unavailable";

            errorMessageE1.innerText =
                "Unable to fetch exchange rates. Please try again.";
        }
    }
}

function convertCurrency(data, firstCurrency, secondCurrency, amount) {
    const rate = data.conversion_rates[secondCurrency];

    if (!rate) {
        throw new Error("Exchange rate not available");
    }

    exchangeRateE1.innerText =
        `1 ${firstCurrency} = ${rate} ${secondCurrency}`;

    worthSecondE1.value = (amount * rate).toFixed(2);
}


// Update when first currency changes
currencyFirstE1.addEventListener("change", updateRate);

// Update when second currency changes
currencySecondE1.addEventListener("change", updateRate);

// Update when amount changes
worthFirstE1.addEventListener("input", updateRate);