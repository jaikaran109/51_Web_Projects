const ans = document.querySelector('#res');
const btn = document.querySelector('#calc-btn');
const clearHistoryBtn = document.querySelector('#clear-history');
const historyList = document.querySelector('#history-list');

const WHO_CATEGORIES = [
    { max: 16, label: 'Severe Thinness', class: 'category-severe-thinness' },
    { max: 17, label: 'Moderate Thinness', class: 'category-moderate-thinness' },
    { max: 18.5, label: 'Mild Thinness', class: 'category-mild-thinness' },
    { max: 25, label: 'Normal', class: 'category-normal' },
    { max: 30, label: 'Overweight', class: 'category-overweight' },
    { max: 35, label: 'Obese Class I', class: 'category-obese-I' },
    { max: 40, label: 'Obese Class II', class: 'category-obese-II' },
    { max: Infinity, label: 'Obese Class III', class: 'category-obese-III' }
];

function getBMICategory(bmi) {
    for (const cat of WHO_CATEGORIES) {
        if (bmi < cat.max) return cat;
    }
    return WHO_CATEGORIES[WHO_CATEGORIES.length - 1];
}

function validateInput(value, fieldName) {
    if (value === '' || value === null || value === undefined) {
        return `${fieldName} is required`;
    }
    const num = Number(value);
    if (isNaN(num)) {
        return `${fieldName} must be a valid number`;
    }
    if (num <= 0) {
        return `${fieldName} must be greater than 0`;
    }
    return null;
}

function parseHeight(value, unit) {
    if (unit === 'm') {
        return Number(value);
    } else if (unit === 'cm') {
        return Number(value) / 100;
    } else if (unit === 'ft/in') {
        const parts = value.split("'");
        if (parts.length !== 2) {
            throw new Error('Height in ft/in must be in format like 5\'11"');
        }
        const feet = Number(parts[0]);
        const inches = Number(parts[1].replace('"', ''));
        if (isNaN(feet) || isNaN(inches)) {
            throw new Error('Invalid feet/inches format');
        }
        return (feet * 0.3048) + (inches * 0.0254);
    }
    return Number(value);
}

function saveToHistory(record) {
    const history = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
    history.unshift(record);
    if (history.length > 50) history.pop();
    localStorage.setItem('bmiHistory', JSON.stringify(history));
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
    renderHistory(history);
}

function renderHistory(history) {
    if (history.length === 0) {
        historyList.innerHTML = '<div class="history-empty">No calculations yet</div>';
        return;
    }
    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-item-info">
                <span class="history-item-bmi">BMI: ${item.bmi}</span>
                <span class="history-item-details">${item.weight} ${item.wtUnit} â€¢ ${item.height} ${item.htUnit} â€¢ ${new Date(item.timestamp).toLocaleString()}</span>
            </div>
            <span class="history-item-category ${item.categoryClass}">${item.categoryLabel}</span>
        </div>
    `).join('');
}

function clearHistory() {
    localStorage.removeItem('bmiHistory');
    renderHistory([]);
}

btn.addEventListener('click', function() {
    const weightInput = document.getElementById('wt').value;
    const wtUnit = document.getElementById('wt-unit').value;
    const heightInput = document.getElementById('ht').value;
    const htUnit = document.getElementById('ht-unit').value;

    const weightError = validateInput(weightInput, 'Weight');
    if (weightError) {
        ans.innerHTML = `<div class="error-message">${weightError}</div>`;
        return;
    }

    const heightError = validateInput(heightInput, 'Height');
    if (heightError) {
        ans.innerHTML = `<div class="error-message">${heightError}</div>`;
        return;
    }

    let weight = Number(weightInput);
    if (wtUnit === 'lbs') {
        weight = weight * 0.453592;
    }

    let height;
    try {
        height = parseHeight(heightInput, htUnit);
    } catch (e) {
        ans.innerHTML = `<div class="error-message">${e.message}</div>`;
        return;
    }

    if (height <= 0) {
        ans.innerHTML = '<div class="error-message">Height must be greater than 0</div>';
        return;
    }

    const bmi = weight / (height * height);
    const bmiRounded = Math.round(bmi * 10) / 10;
    const category = getBMICategory(bmi);

    ans.innerHTML = `
        <span class="bmi-value">${bmiRounded}</span>
        <span class="bmi-category ${category.class}">${category.label}</span>
    `;

    const record = {
        bmi: bmiRounded,
        categoryLabel: category.label,
        categoryClass: category.class,
        weight: weightInput,
        wtUnit: wtUnit,
        height: heightInput,
        htUnit: htUnit,
        timestamp: Date.now()
    };
    saveToHistory(record);
    loadHistory();
});

clearHistoryBtn.addEventListener('click', clearHistory);

loadHistory();
