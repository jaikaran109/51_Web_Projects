# Currency Converter

A real-time currency converter web application that allows users to convert between multiple global currencies using live exchange rates.

## 📋 Description

Currency Converter is a lightweight, user-friendly web application built with vanilla JavaScript, HTML, and CSS. It provides instant currency conversion between 7 major currencies with real-time exchange rates fetched from the ExchangeRate API.

## ✨ Features

- **Real-time Conversion**: Get accurate, live exchange rates updated instantly
- **Multiple Currencies**: Support for 7 major currencies:
  - USD (US Dollar)
  - EUR (Euro)
  - GBP (British Pound)
  - INR (Indian Rupee)
  - CAD (Canadian Dollar)
  - AUD (Australian Dollar)
  - JPY (Japanese Yen)
- **Bidirectional Conversion**: Convert from any currency to any other currency
- **Responsive UI**: Clean, intuitive interface with real-time updates
- **No Dependencies**: Built with vanilla JavaScript - no frameworks or libraries required
- **Live Exchange Rate Display**: Shows current exchange rate between selected currencies

## 🛠️ Technologies Used

- **HTML5**: Markup and structure
- **CSS3**: Styling and layout (Flexbox)
- **JavaScript (ES6)**: Core functionality and API integration
- **ExchangeRate API**: Real-time currency exchange data
- **Fetch API**: HTTP requests for currency data

## 📦 Installation

1. Clone the repository or download the project files:
   ```bash
   git clone https://github.com/yourusername/currency-converter.git
   cd currency-converter
   ```

2. No dependencies or build steps required! Simply open `index.html` in your web browser.

## 🚀 Usage

1. Open `index.html` in any modern web browser
2. Select your source currency from the first dropdown
3. Select your target currency from the second dropdown
4. Enter the amount you want to convert in the input field
5. The converted amount will automatically display in the right input field
6. The current exchange rate is shown below the inputs

**Example**: Convert $100 USD to INR
- Select USD from the first dropdown
- Select INR from the second dropdown
- Enter "100" in the input field
- View the conversion result instantly

## 🔌 API Configuration

This project uses the **ExchangeRate API** for real-time currency conversion.

**Current Endpoint**:
```
https://v6.exchangerate-api.com/v6/{API_KEY}/latest/{CURRENCY_CODE}
```

To use your own API key:
1. Sign up at [exchangerate-api.com](https://www.exchangerate-api.com)
2. Replace the API key in `app.js` (line with the fetch URL) with your own

## 📁 Project Structure

```
currency-converter/
├── index.html          # HTML markup
├── app.js             # JavaScript logic and API calls
├── style.css          # Styling and layout
└── README.md          # Project documentation
```

## 💻 How It Works

1. **DOM Element Selection**: The script selects all necessary HTML elements using `getElementById()`
2. **Event Listeners**: Listens for changes in currency selection or input values
3. **API Fetch**: When changes occur, fetches current exchange rates from the API
4. **Data Processing**: Converts JSON response to readable format
5. **Real-time Update**: Displays updated conversion rates and calculated values

## 🎨 Styling

- **Color Scheme**: Bright yellow background with dark cyan converter container
- **Typography**: Courier New font family for consistent styling
- **Layout**: Flexbox-based responsive design
- **Rounded Corners**: Modern aesthetic with 40px border radius

## 🚨 Important Notes

- Requires an active internet connection for API calls
- Exchange rates are fetched in real-time and may vary
- The API key in the project is for demonstration purposes; consider using your own for production
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)

## 📝 Browser Compatibility

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Microsoft Edge (Latest)

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

**Happy Converting! 💱**