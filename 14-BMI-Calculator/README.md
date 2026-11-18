# 14-BMI-Calculator

# BMI Calculator

## Overview
BMI Calculator is a web-based application that calculates Body Mass Index using height and weight values. It demonstrates how JavaScript can process user input and display calculated results dynamically.

## Live Demo
Not currently published.

## Source Code
https://github.com/jaikaran109/51_Web_Projects/tree/main/14-BMI-Calculator

## Features
- Height and weight inputs with metric and imperial unit options.
- Positive, numeric measurement validation with inline accessible feedback.
- BMI classification using WHO adult categories and a dynamically positioned, color-coded gauge.
- Calculation history saved in browser localStorage, with an option to clear it.
- Responsive calculator interface.

## Technologies Used
- HTML5
- CSS3
- JavaScript

## BMI Formula

BMI is calculated using the following formula:

BMI = Weight (kg) / Height (m)²

## Input Validation

- Weight must be between 10 and 500 kg, inclusive.
- Height must be between 0.5 and 2.5 metres, inclusive.
- Imperial measurements are converted to metric units before these limits are checked.
- Invalid inputs display inline validation messages and are not saved to calculation history.

## BMI Categories

BMI categories follow standard adult classifications and are intended for adults only. They are not intended for interpreting BMI in children or teenagers.

## Project Structure
- HTML file – Calculator interface.
- CSS file – Application styling.
- JavaScript file – BMI calculation logic.

## How to Run
1. Clone the repository.
2. Open the `14-BMI-Calculator` folder.
3. Locate `index.html`.
4. Open it in a browser.
5. Enter your height and weight.
6. Calculate and view the BMI result.

## Learning Outcomes
- JavaScript mathematical operations.
- Reading user input.
- DOM manipulation.
- Form validation.

## Author
Jai Karan Gupta

## Contributing
Contributions are welcome. Fork the repository and submit a Pull Request.
