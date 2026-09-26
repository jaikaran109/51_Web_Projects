const currencyFirstE1 = document.getElementById("currency-first");
const worthFirstE1 = document.getElementById("worth-first");
const currencySecondE1 = document.getElementById("currency-second");
const worthSecondE1 = document.getElementById("worth-second");
const exchangeRateE1 = document.getElementById("exchange-rate");
const errorMessageE1 = document.getElementById("error-message");

const CACHE_KEY = "currencyExchangeRates";
let requestId = 0;

updateRate();

async function updateRate() {
    const currentRequestId = ++requestId;

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

        // Ignore this response if a newer request has started.
        if (currentRequestId !== requestId) {
            return;
        }

        // Save latest successful rates to localStorage.
        try {
            localStorage.setItem(
                `${CACHE_KEY}-${firstCurrency}`,
                JSON.stringify(data)
            );
        } catch (storageError) {
            console.warn("Unable to cache exchange rates:", storageError);
        }

        convertCurrency(data, firstCurrency, secondCurrency, amount);
    } catch (error) {
        console.error("Currency API error:", error);

        // Ignore errors from an outdated request.
        if (currentRequestId !== requestId) {
            return;
        }

        let cachedData = null;

        try {
            cachedData = localStorage.getItem(
                `${CACHE_KEY}-${firstCurrency}`
            );
        } catch (storageError) {
            console.warn("Unable to read cached exchange rates:", storageError);
        }

        if (cachedData) {
            try {
                const data = JSON.parse(cachedData);

                if (
                    data.conversion_rates &&
                    currentRequestId === requestId
                ) {
                    convertCurrency(
                        data,
                        firstCurrency,
                        secondCurrency,
                        amount
                    );

                    errorMessageE1.innerText =
                        "Using previously saved exchange rates.";
                    return;
                }
            } catch (cacheError) {
                console.warn("Invalid cached exchange rates:", cacheError);
            }
        }

        worthSecondE1.value = "";
        exchangeRateE1.innerText = "Exchange rate unavailable";
        errorMessageE1.innerText =
            "Unable to fetch exchange rates. Please try again.";
    }
}

function convertCurrency(data, firstCurrency, secondCurrency, amount) {
    const rate = data.conversion_rates[secondCurrency];

    if (
        typeof rate !== "number" ||
        !Number.isFinite(rate) ||
        rate <= 0
    ) {
        throw new Error("Exchange rate not available");
    }

    exchangeRateE1.innerText =
        `1 ${firstCurrency} = ${rate} ${secondCurrency}`;

    worthSecondE1.value = (amount * rate).toFixed(2);
}

currencyFirstE1.addEventListener("change", updateRate);
currencySecondE1.addEventListener("change", updateRate);
worthFirstE1.addEventListener("input", updateRate);