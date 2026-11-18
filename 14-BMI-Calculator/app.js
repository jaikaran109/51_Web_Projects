const form = document.querySelector('#bmi-form');
const result = document.querySelector('#res');
const weightInput = document.querySelector('#wt');
const weightUnit = document.querySelector('#wt-unit');
const heightInput = document.querySelector('#ht');
const heightUnit = document.querySelector('#ht-unit');
const weightError = document.querySelector('#wt-error');
const heightError = document.querySelector('#ht-error');
const clearHistoryButton = document.querySelector('#clear-history');
const historyList = document.querySelector('#history-list');
const historyStatus = document.querySelector('#history-status');
const HISTORY_KEY = 'bmiHistory';
const MAX_HISTORY_ITEMS = 50;
// Broad sanity bounds for adult BMI measurements, applied after unit conversion.
const MIN_WEIGHT_KG = 10;
const MAX_WEIGHT_KG = 500;
const MIN_HEIGHT_METERS = 0.5;
const MAX_HEIGHT_METERS = 2.5;

let historyRecords = [];

function getBMICategory(bmi) {
    if (bmi < 18.5) {
        return { label: 'Underweight', className: 'category-underweight' };
    }
    if (bmi < 25) {
        return { label: 'Normal weight', className: 'category-normal' };
    }
    if (bmi < 30) {
        return { label: 'Overweight', className: 'category-overweight' };
    }
    return { label: 'Obesity', className: 'category-obesity' };
}

function setFieldError(input, errorElement, message) {
    errorElement.textContent = message;
    if (message) {
        input.setAttribute('aria-invalid', 'true');
    } else {
        input.removeAttribute('aria-invalid');
    }
}

function validatePositiveNumber(value, fieldName) {
    if (!value.trim()) {
        return { error: `${fieldName} is required.`, number: null };
    }
    const number = Number(value);
    if (!Number.isFinite(number)) {
        return { error: `${fieldName} must be a valid number.`, number: null };
    }
    if (number <= 0) {
        return { error: `${fieldName} must be greater than 0.`, number: null };
    }
    return { error: '', number };
}

function parseHeight(value, unit) {
    if (unit === 'm' || unit === 'cm') {
        const parsedHeight = validatePositiveNumber(value, 'Height');
        if (parsedHeight.error) {
            return { error: parsedHeight.error, meters: null };
        }
        return {
            error: '',
            meters: unit === 'cm' ? parsedHeight.number / 100 : parsedHeight.number
        };
    }

    const feetAndInches = value.match(/^\s*(\d+)\s*'\s*(\d+(?:\.\d+)?)\s*"?\s*$/);
    if (!feetAndInches) {
        return {
            error: value.trim()
                ? 'Enter height as feet and inches, for example 5\'11".'
                : 'Height is required.',
            meters: null
        };
    }

    const feet = Number(feetAndInches[1]);
    const inches = Number(feetAndInches[2]);
    if (!Number.isFinite(feet) || !Number.isFinite(inches) || inches >= 12) {
        return { error: 'Enter inches as a value from 0 to less than 12.', meters: null };
    }
    const meters = (feet * 0.3048) + (inches * 0.0254);
    if (meters <= 0) {
        return { error: 'Height must be greater than 0.', meters: null };
    }
    return { error: '', meters };
}

function createGauge(bmi) {
    const gauge = document.createElement('div');
    gauge.className = 'bmi-gauge';
    gauge.setAttribute('role', 'img');
    gauge.setAttribute('aria-label', `BMI gauge: ${getBMICategory(bmi).label}`);

    const track = document.createElement('div');
    track.className = 'bmi-gauge-track';

    const marker = document.createElement('span');
    marker.className = 'bmi-gauge-marker';
    marker.style.left = `${Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100))}%`;
    track.append(marker);
    gauge.append(track);

    const labels = document.createElement('div');
    labels.className = 'bmi-gauge-labels';
    [
        { label: '10', position: 0 },
        { label: '18.5', position: (8.5 / 30) * 100 },
        { label: '25', position: 50 },
        { label: '30', position: (20 / 30) * 100 },
        { label: '40+', position: 100 }
    ].forEach(({ label, position }) => {
        const span = document.createElement('span');
        span.textContent = label;
        span.style.left = `${position}%`;
        labels.append(span);
    });
    gauge.append(labels);
    return gauge;
}

function displayResult(bmi, category) {
    result.replaceChildren();

    const value = document.createElement('span');
    value.className = 'bmi-value';
    value.textContent = bmi.toFixed(2);

    const categoryBadge = document.createElement('span');
    categoryBadge.className = `bmi-category ${category.className}`;
    categoryBadge.textContent = category.label;

    result.append(value, categoryBadge, createGauge(bmi));
}

function normalizeHistoryRecord(item) {
    if (!item || typeof item !== 'object') {
        return null;
    }
    const bmi = Number(item.bmi);
    const timestamp = Number(item.timestamp);
    const weight = typeof item.weight === 'string' ? item.weight : '';
    const height = typeof item.height === 'string' ? item.height : '';
    if (!Number.isFinite(bmi) || bmi <= 0 || !Number.isFinite(timestamp) ||
        !weight || !height || !Number.isFinite(new Date(timestamp).getTime())) {
        return null;
    }

    const weightDisplay = item.wtUnit ? `${weight} ${item.wtUnit}` : weight;
    const heightDisplay = item.htUnit ? `${height} ${item.htUnit}` : height;
    return {
        bmi,
        category: getBMICategory(bmi).label,
        weight: weightDisplay,
        height: heightDisplay,
        timestamp
    };
}

function renderHistory() {
    historyList.replaceChildren();
    if (historyRecords.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'history-empty';
        emptyMessage.textContent = 'No calculations yet';
        historyList.append(emptyMessage);
        return;
    }

    historyRecords.forEach((item) => {
        const entry = document.createElement('div');
        entry.className = 'history-item';

        const info = document.createElement('div');
        info.className = 'history-item-info';

        const bmi = document.createElement('span');
        bmi.className = 'history-item-bmi';
        bmi.textContent = `BMI: ${item.bmi.toFixed(2)}`;

        const details = document.createElement('span');
        details.className = 'history-item-details';
        details.textContent = `${item.weight} • ${item.height} • ${new Date(item.timestamp).toLocaleString()}`;

        const category = document.createElement('span');
        category.className = `history-item-category ${getBMICategory(item.bmi).className}`;
        category.textContent = item.category;

        info.append(bmi, details);
        entry.append(info, category);
        historyList.append(entry);
    });
}

function loadHistory() {
    try {
        const storedHistory = localStorage.getItem(HISTORY_KEY);
        if (storedHistory === null) {
            historyRecords = [];
            renderHistory();
            return;
        }

        const parsedHistory = JSON.parse(storedHistory);
        if (!Array.isArray(parsedHistory)) {
            throw new Error('Saved history is not a list.');
        }
        historyRecords = parsedHistory
            .map(normalizeHistoryRecord)
            .filter(Boolean)
            .slice(0, MAX_HISTORY_ITEMS);
        if (historyRecords.length !== parsedHistory.length) {
            historyStatus.textContent = 'Some saved history entries were invalid and have been skipped.';
        }
        renderHistory();
    } catch {
        historyRecords = [];
        historyStatus.textContent = 'Saved history could not be read. Clear history to reset it.';
        renderHistory();
    }
}

function saveToHistory(record) {
    const savedRecord = normalizeHistoryRecord(record);
    if (!savedRecord) {
        historyStatus.textContent = 'This calculation could not be saved to browser history.';
        return;
    }
    historyRecords.unshift(savedRecord);
    historyRecords = historyRecords.slice(0, MAX_HISTORY_ITEMS);
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(historyRecords));
        historyStatus.textContent = '';
    } catch {
        historyStatus.textContent = 'This calculation could not be saved to browser history.';
    }
    renderHistory();
}

function clearHistory() {
    try {
        localStorage.removeItem(HISTORY_KEY);
        historyRecords = [];
        historyStatus.textContent = '';
        renderHistory();
    } catch {
        historyStatus.textContent = 'History could not be cleared from browser storage.';
    }
}

weightInput.addEventListener('input', () => setFieldError(weightInput, weightError, ''));
heightInput.addEventListener('input', () => setFieldError(heightInput, heightError, ''));
weightUnit.addEventListener('change', () => setFieldError(weightInput, weightError, ''));
heightUnit.addEventListener('change', () => setFieldError(heightInput, heightError, ''));

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const weightResult = validatePositiveNumber(weightInput.value, 'Weight');
    const heightResult = parseHeight(heightInput.value, heightUnit.value);
    setFieldError(weightInput, weightError, weightResult.error);
    setFieldError(heightInput, heightError, heightResult.error);
    result.replaceChildren();

    if (weightResult.error || heightResult.error) {
        return;
    }

    const weightInKg = weightUnit.value === 'lbs'
        ? weightResult.number * 0.453592
        : weightResult.number;
    if (weightInKg < MIN_WEIGHT_KG || weightInKg > MAX_WEIGHT_KG) {
        setFieldError(weightInput, weightError, `Weight must be between ${MIN_WEIGHT_KG} and ${MAX_WEIGHT_KG} kg (or the equivalent in pounds).`);
    }
    if (heightResult.meters < MIN_HEIGHT_METERS || heightResult.meters > MAX_HEIGHT_METERS) {
        setFieldError(heightInput, heightError, `Height must be between ${MIN_HEIGHT_METERS} and ${MAX_HEIGHT_METERS} m (or the equivalent in the selected unit).`);
    }
    if (weightError.textContent || heightError.textContent) {
        return;
    }

    const bmi = weightInKg / (heightResult.meters * heightResult.meters);
    if (!Number.isFinite(bmi) || bmi <= 0) {
        setFieldError(weightInput, weightError, 'Enter measurements within a usable range.');
        setFieldError(heightInput, heightError, 'Enter measurements within a usable range.');
        return;
    }

    const category = getBMICategory(bmi);
    displayResult(bmi, category);
    saveToHistory({
        bmi,
        weight: `${weightInput.value.trim()} ${weightUnit.value === 'kgs' ? 'kg' : 'lbs'}`,
        height: `${heightInput.value.trim()} ${heightUnit.value}`,
        timestamp: Date.now()
    });
});

clearHistoryButton.addEventListener('click', clearHistory);

loadHistory();
