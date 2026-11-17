// Currency Converter
//
// Rates come from the free Exchange Rate API (no key needed). Order of preference:
//   1. live rates from the API,
//   2. the last rates saved in this browser (localStorage), with their age shown,
//   3. the built-in snapshot in currencies.js, marked as approximate.
// The page converts straight away from whatever it already has and updates when live rates arrive.

const currencyFirstE1 = document.getElementById("currency-first");
const worthFirstE1 = document.getElementById("worth-first");
const currencySecondE1 = document.getElementById("currency-second");
const worthSecondE1 = document.getElementById("worth-second");
const exchangeRateE1 = document.getElementById("exchange-rate");
const statusE1 = document.getElementById("status");
const errorMessageE1 = document.getElementById("error-message");
const swapButtonE1 = document.getElementById("swap-button");

const API_URL = "https://open.er-api.com/v6/latest/";
const CACHE_PREFIX = "currencyRates:v1:";
const REQUEST_TIMEOUT_MS = 8000;
const MEMORY_TTL_MS = 10 * 60 * 1000;

// Rates already loaded in this session, so typing an amount never triggers a request.
const memory = {};
let requestId = 0;

function fillCurrencySelect(select, selected) {
    for (const currency of CURRENCIES) {
        const option = document.createElement("option");
        option.value = currency.code;
        option.textContent = `${currency.code} - ${currency.name}`;
        select.appendChild(option);
    }
    select.value = selected;
}

fillCurrencySelect(currencyFirstE1, "USD");
fillCurrencySelect(currencySecondE1, "INR");

function cacheKey(base) {
    return CACHE_PREFIX + base;
}

function readCache(base) {
    try {
        const saved = JSON.parse(localStorage.getItem(cacheKey(base)));
        if (saved && saved.rates && typeof saved.fetchedAt === "number") {
            return saved;
        }
    } catch (error) {
        // Storage can be blocked or hold something unreadable: act as if nothing was saved.
    }
    return null;
}

function writeCache(base, entry) {
    try {
        localStorage.setItem(cacheKey(base), JSON.stringify(entry));
    } catch (error) {
        // Private mode or a full disk: conversion still works, it just will not be remembered.
    }
}

async function fetchLiveRates(base) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(API_URL + encodeURIComponent(base), { signal: controller.signal });
        if (!response.ok) {
            throw new Error(`Rates request failed (${response.status})`);
        }

        const data = await response.json();
        if (data.result !== "success" || !data.rates || typeof data.rates !== "object") {
            throw new Error("Unexpected response from the rates service");
        }

        return {
            rates: data.rates,
            fetchedAt: Date.now(),
            updatedAt: data.time_last_update_unix ? data.time_last_update_unix * 1000 : Date.now(),
        };
    } finally {
        clearTimeout(timer);
    }
}

// Returns { rates, source, at } where source is "live", "saved" or "offline".
async function loadRates(base) {
    const inMemory = memory[base];
    if (inMemory && Date.now() - inMemory.fetchedAt < MEMORY_TTL_MS) {
        return { rates: inMemory.rates, source: "live", at: inMemory.updatedAt };
    }

    try {
        const live = await fetchLiveRates(base);
        memory[base] = live;
        writeCache(base, live);
        return { rates: live.rates, source: "live", at: live.updatedAt };
    } catch (error) {
        console.warn("Live rates unavailable:", error.message);
    }

    const saved = readCache(base);
    if (saved) {
        return { rates: saved.rates, source: "saved", at: saved.fetchedAt };
    }

    return { rates: offlineRatesFor(base), source: "offline", at: null };
}

function formatRate(rate) {
    const digits = rate < 1 ? 6 : 4;
    return rate.toLocaleString(undefined, { maximumFractionDigits: digits });
}

function formatAge(timestamp) {
    const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 48) return `${hours} h ago`;
    return `${Math.round(hours / 24)} days ago`;
}

function describeSource(source, at) {
    if (source === "live") {
        return `Live rate, updated ${new Date(at).toLocaleString()}`;
    }
    if (source === "saved") {
        return `Offline: using rates saved ${formatAge(at)}`;
    }
    return `Offline: approximate built-in rates from ${OFFLINE_RATES_DATE}`;
}

function readAmount() {
    const raw = worthFirstE1.value.trim();
    if (raw === "") return { error: "Enter an amount to convert." };

    const amount = Number(raw);
    if (!Number.isFinite(amount) || amount < 0) {
        return { error: "Enter an amount of 0 or more." };
    }
    return { amount };
}

function showResult(rates, source, at) {
    const first = currencyFirstE1.value;
    const second = currencySecondE1.value;
    const rate = rates && rates[second];

    if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) {
        worthSecondE1.value = "";
        exchangeRateE1.innerText = "Exchange rate unavailable";
        errorMessageE1.innerText = `No rate is available for ${first} to ${second}.`;
        statusE1.innerText = "";
        return;
    }

    exchangeRateE1.innerText = `1 ${first} = ${formatRate(rate)} ${second}`;
    statusE1.innerText = describeSource(source, at);

    const parsed = readAmount();
    if (parsed.error) {
        worthSecondE1.value = "";
        errorMessageE1.innerText = parsed.error;
        return;
    }

    errorMessageE1.innerText = "";
    worthSecondE1.value = (parsed.amount * rate).toFixed(2);
}

// Convert right away from what is already known, then replace it with fresher rates if they arrive.
async function updateRate() {
    const current = ++requestId;
    const base = currencyFirstE1.value;

    const known = memory[base];
    if (known) {
        showResult(known.rates, "live", known.updatedAt);
    } else {
        const saved = readCache(base);
        if (saved) {
            showResult(saved.rates, "saved", saved.fetchedAt);
        } else {
            showResult(offlineRatesFor(base), "offline", null);
        }
    }

    const result = await loadRates(base);

    // A newer change (another currency, a swap) has started: drop this answer.
    if (current !== requestId) return;
    showResult(result.rates, result.source, result.at);
}

// The amount only needs the rates already loaded, so it never starts a request.
function updateAmount() {
    const base = currencyFirstE1.value;
    const known = memory[base];
    const saved = known ? null : readCache(base);

    if (known) {
        showResult(known.rates, "live", known.updatedAt);
    } else if (saved) {
        showResult(saved.rates, "saved", saved.fetchedAt);
    } else {
        showResult(offlineRatesFor(base), "offline", null);
    }
}

function swapCurrencies() {
    const first = currencyFirstE1.value;
    currencyFirstE1.value = currencySecondE1.value;
    currencySecondE1.value = first;

    swapButtonE1.classList.toggle("flipped");
    updateRate();
}

currencyFirstE1.addEventListener("change", updateRate);
currencySecondE1.addEventListener("change", updateRate);
worthFirstE1.addEventListener("input", updateAmount);
swapButtonE1.addEventListener("click", swapCurrencies);

updateRate();
