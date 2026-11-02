# Currency Converter

A currency converter built with vanilla JavaScript, HTML and CSS. It uses live exchange rates and keeps working when the network or the rates service is unavailable.

## 📋 Description

Pick two currencies, type an amount, and the converted amount appears straight away. Live rates are loaded in the background; if they cannot be reached, the converter falls back to the rates it saved earlier, and then to a built-in snapshot, and says which one it is using.

## ✨ Features

- **Live rates, no API key**: uses the free Exchange Rate API open endpoint, so there is no credential in the source code
- **Works offline**: live rates, then rates saved in the browser (with their age), then a built-in snapshot (clearly marked as approximate)
- **11 currencies**: USD, EUR, GBP, INR, JPY, AUD, CAD, CHF, CNY, SGD, AED
- **One-click swap**: the swap button flips the two currencies and recalculates
- **Instant first paint**: converts from saved or built-in rates immediately, then updates when live rates arrive
- **Accessible**: labelled controls, a live status message, and errors announced to screen readers
- **Responsive glass-style UI**, with reduced-motion support
- **No dependencies**: no frameworks, libraries or build step

## 🛠️ Technologies Used

- **HTML5**: Markup and structure
- **CSS3**: Styling, Flexbox, frosted-glass effect (`backdrop-filter`)
- **JavaScript (ES6)**: Conversion logic, `fetch`, `localStorage`
- **[Exchange Rate API](https://www.exchangerate-api.com)** (open endpoint): exchange rate data

## 📦 Installation

No dependencies or build steps required. Open `index.html` in a modern browser.

```bash
git clone https://github.com/jaikaran109/51_Web_Projects.git
cd 51_Web_Projects/16-Currency-Converter
```

## 🚀 Usage

1. Open `index.html` in any modern web browser
2. Choose the currency to convert **from** in the first dropdown
3. Choose the currency to convert **to** in the second dropdown
4. Type an amount in the left input; the result appears on the right
5. Use the swap button (⇄) to reverse the two currencies
6. The line under the inputs shows the rate, and the small line below it says where the rate came from

**Example**: convert 100 USD to INR: pick USD and INR, type `100`.

## 🔌 Where the rates come from

```
GET https://open.er-api.com/v6/latest/{BASE_CURRENCY}
```

The open endpoint needs no key. It is rate limited and updated about once a day, so the converter only asks for new rates when you change the "from" currency (or swap), not on every keystroke. The service asks for attribution, which is shown at the bottom of the page.

The converter uses the first of these that works, and tells you which one:

| Source | When | Status line says |
|---|---|---|
| Live | the request succeeds within 8 seconds | `Live rate, updated <date and time>` |
| Saved | the request fails and this browser has rates saved from before | `Offline: using rates saved <age> ago` |
| Built-in | the request fails and nothing was saved | `Offline: approximate built-in rates from <date>` |

The built-in snapshot lives in `currencies.js` (`OFFLINE_RATES` and `OFFLINE_RATES_DATE`). Update the numbers and the date together to refresh it.

## 📁 Project Structure

```
16-Currency-Converter/
├── index.html          # HTML markup
├── currencies.js       # Currency list and the built-in offline rates
├── app.js              # Loading rates, caching, conversion, swap
├── style.css           # Styling and layout
└── README.md           # Project documentation
```

## 💻 How It Works

1. **Setup**: `app.js` fills the dropdowns from the list in `currencies.js`
2. **Instant result**: it converts at once from saved or built-in rates
3. **Live rates**: it requests rates for the "from" currency and replaces the result when they arrive
4. **Fallbacks**: if the request fails or times out it uses the saved rates, then the built-in ones
5. **Amount changes**: typing an amount only recalculates from the rates already loaded
6. **Stale answers**: if you change currency while a request is running, the older answer is ignored

## 🎨 Styling

- **Look**: a frosted-glass card (`backdrop-filter: blur`) over a teal and indigo gradient
- **Typography**: Courier New font family
- **Layout**: Flexbox, stacks vertically on narrow screens
- **Motion**: the swap button turns when pressed; disabled for users who prefer reduced motion

## 🚨 Important Notes

- The first visit offline shows the built-in approximate rates, not live ones, and says so
- Rates are indicative only, not for financial decisions
- Works in current Chrome, Firefox, Safari and Edge
- An API key used to be hard-coded in `app.js` in earlier versions of this project. It has been removed, but it remains in the git history, so the owner of that key should rotate it.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest improvements
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Created as a learning project for web development.

---
