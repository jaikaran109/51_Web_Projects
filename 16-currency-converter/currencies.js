// Currency data used by app.js.
//
// OFFLINE_RATES is the last resort when the live API cannot be reached and nothing has been
// cached in the browser yet. It is a snapshot, so the numbers are approximate: units of each
// currency per 1 USD, taken from https://open.er-api.com/v6/latest/USD on 2026-11-02.
// Update the values and the date together when refreshing the snapshot.

const OFFLINE_RATES_DATE = "2026-11-02";

const OFFLINE_RATES = {
    USD: 1,
    EUR: 0.896073,
    GBP: 0.746906,
    INR: 95.082494,
    JPY: 157.532149,
    AUD: 1.422744,
    CAD: 1.396839,
    CHF: 0.824534,
    CNY: 6.660856,
    SGD: 1.278048,
    AED: 3.6725,
};

const CURRENCIES = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
    { code: "AED", name: "UAE Dirham", symbol: "AED" },
];

// Rates for any base currency, derived from the USD snapshot above.
function offlineRatesFor(base) {
    const baseRate = OFFLINE_RATES[base];
    if (!baseRate) return null;

    const rates = {};
    for (const code of Object.keys(OFFLINE_RATES)) {
        rates[code] = OFFLINE_RATES[code] / baseRate;
    }
    return rates;
}
