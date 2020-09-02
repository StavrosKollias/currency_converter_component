function getCurrencyComponent() {
    const component = document.getElementById("currency-component");
    if (component) {
        return component;
    } else {
        alert("No component Found ");
        return undefined;
    }
}

async function generateCurrencyComponent() {
    const currencyComponent = getCurrencyComponent();
    // createHTMLElement(type, id, className, innerText, innerHTML);
    const inputContainer = createHTMLElement("div", null, "input-container", null, null);
    const buttonReverse = createHTMLElement("button", "reverse-button", "reverse-button", null, '<i class="fas fa-exchange-alt"></i>');
    buttonReverse.addEventListener("click", () => { handleSwitchCurrenciesButtonClick(currencyComponent) });
    const label = createHTMLElement("label", "input-label", "input-label", "Amount", null);
    const inputAmount = createHTMLElement("input", "input-amount", "currency-input", null, null);
    inputAmount.placeholder = "Enter Amount";
    inputAmount.value = "100";
    inputAmount.addEventListener("input", (e) => {
        hadleAmountInput(e.target);
    });
    inputContainer.appendChild(label);
    inputContainer.appendChild(inputAmount);
    inputContainer.appendChild(buttonReverse);
    const rates = await getExchangeRatesFromApi("GBP");
    const currencyNames = await getCurrencyNamesFromApi();
    // generateSelectionElement(rates, currencyNames, selectedCurrency, selectId, inputSearchId, listId)
    const selectCurrency = generateSelectionElement(rates, currencyNames, 1, "currency-amount-select", "search-currency-input-amount", "currency-amount-list");
    const selectCurrencyConvert = generateSelectionElement(rates, currencyNames, 4, "currency-convert-select", "search-currency-input-convert", "currency-convert-list");
    const convertButton = createHTMLElement("button", "convert-button", "convert-button", "Convert", null);
    convertButton.addEventListener("click", handleConvertButtonClick);
    const errorMessage = createHTMLElement("p", "error-msg", "error-msg", null, null);
    const resultMessage = createHTMLElement("p", "result-converter", "result-converter", null, null);
    const timeContainer = createHTMLElement("div", null, "counter-container", null, null);
    const textContainer = createHTMLElement("div", "text-time-container", "time-container", null, null);
    const textTimeDisplay = createHTMLElement("span", "text-time-display", "time", "Expires in: ", null, null, null);
    const minutesContainer = createHTMLElement("div", "minutes-container", "time-container", null, null);
    const minutesDisplay = createHTMLElement("span", "minutes-display", "time", null, null, null, null);
    const secondsContainer = createHTMLElement("div", "seconds-container", "time-container", null, null);
    const secondsDisplay = createHTMLElement("span", "seconds-display", "time", null, null);
    textContainer.appendChild(textTimeDisplay);
    minutesContainer.appendChild(minutesDisplay);
    secondsContainer.appendChild(secondsDisplay);
    timeContainer.appendChild(textContainer);
    timeContainer.appendChild(minutesContainer);
    timeContainer.appendChild(secondsContainer);
    currencyComponent.appendChild(inputContainer);
    currencyComponent.appendChild(selectCurrency);
    currencyComponent.appendChild(selectCurrencyConvert);
    currencyComponent.appendChild(errorMessage);
    currencyComponent.appendChild(resultMessage);
    currencyComponent.appendChild(timeContainer);
    currencyComponent.appendChild(convertButton);
    inputAmount.focus();
}

var expiryTimer;
generateCurrencyComponent();

async function handleConvertButtonClick() {
    clearInterval(expiryTimer);
    const currencyComponent = getCurrencyComponent();
    const selectedCurrency1 = currencyComponent.querySelector("#currency-amount-select").children[1].innerText;
    const selectedCurrency2 = currencyComponent.querySelector("#currency-convert-select").children[1].innerText;
    const inputAmountValue = currencyComponent.querySelector("#input-amount").value;
    const isNotValid = validateString(inputAmountValue);
    var value = inputAmountValue;
    const includesComma = value.includes(",");
    const lastIndexOfComma = value.lastIndexOf(",");
    const thousandsCheck = lastIndexOfComma - value.length - 1 == 3;
    includesComma && !thousandsCheck ? value = value.replace(",", "") : value;
    includesComma && !thousandsCheck ? currencyComponent.querySelector("#input-amount").value = value : false;
    const resultCoverter = currencyComponent.querySelector(".result-converter");
    const rates = await getExchangeRatesFromApi(selectedCurrency1);
    var convertedValue = Number(value) * rates[selectedCurrency2];
    resultCoverter.innerText = value + " " + selectedCurrency1 + " is equivalent to " + convertedValue.toFixed(4) + " " + selectedCurrency2;
    startExpiryTimer(10, 0);
    updateTimeElements(0, 10, 0, 0);
    resultCoverter.classList.add("active-result");
    document.querySelector(".counter-container").classList.add("active-timer");
}

function validateString(value) {
    const dotsCkeck = value.replace(/[^.]/g, "").length;
    const commasCkeck = value.replace(/[^,]/g, "").length;
    const overflowCommasDecimal = dotsCkeck > 1 && commasCkeck > 1 || dotsCkeck > 1 || commasCkeck > 1;
    const letters = value.replace(",", "").replace(".", "").replace(/[0-9]+/g, "");
    const includesString = value.includes(letters);
    var isValid = includesString && letters.length > 0;
    isValid = isValid && overflowCommasDecimal || isValid || overflowCommasDecimal;
    return isValid;
}

function hadleAmountInput(element) {
    const isVisible = validateString(element.value);
    var value = element.value.replace(",", '').replace(".", "");
    isVisible ? value = element.value : value;
    const convertButton = document.querySelector(".convert-button");
    !isVisible && value ? convertButton.disabled = false : convertButton.disabled = true;
    setErrorMessageVisibility(isVisible, value, element);
}

function setErrorMessageVisibility(isVisible, value, inputElement) {
    const errorMessage = document.querySelector(".error-msg");
    if (isVisible) {
        inputElement.classList.add("error-input");
        errorMessage.innerText = `${value} is not a valid number`;
        errorMessage.classList.add("active-error");
    } else {
        if (value) {
            errorMessage.classList.remove("active-error");
            inputElement.classList.remove("error-input");
            errorMessage.innerText = "";
        } else {
            inputElement.classList.add("error-input");
            errorMessage.classList.add("active-error");
            errorMessage.innerText = "Reuired Amount";
        }

    }
}

function handleSwitchCurrenciesButtonClick() {
    const currencyComponent = getCurrencyComponent();
    const selectedCurrency1 = currencyComponent.querySelector("#currency-amount-select");
    const activeSelection = selectedCurrency1.querySelector(".selected-currency");
    activeSelection.classList.remove("selected-currency");
    const selectedCurrency2 = currencyComponent.querySelector("#currency-convert-select");
    const activeSelection2 = selectedCurrency2.querySelector(".selected-currency");
    activeSelection2.classList.remove("selected-currency");
    selectedCurrency1.children[0].src = activeSelection2.children[0].src;
    selectedCurrency1.children[1].innerText = activeSelection2.children[1].innerText;
    selectedCurrency1.children[2].innerText = activeSelection2.children[2].innerText;
    selectedCurrency1.querySelector(`.${activeSelection2.children[1].innerText}`).classList.add("selected-currency");
    selectedCurrency2.children[0].src = activeSelection.children[0].src;
    selectedCurrency2.children[1].innerText = activeSelection.children[1].innerText;
    selectedCurrency2.children[2].inn = activeSelection.children[2].innerText;
    selectedCurrency2.querySelector(`.${activeSelection.children[1].innerText}`).classList.add("selected-currency");
}

async function getExchangeRatesFromApi(currency) {
    var response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);
    if (response.ok) {
        let json = await response.json();
        return json.rates;
    } else {
        alert("HTTP Request Error: " + response.status);
        return {};
    }
}

async function getCurrencyNamesFromApi() {
    var response = await fetch(`https://openexchangerates.org/api/currencies.json`);
    if (response.ok) {
        let json = await response.json();
        return json;
    } else {
        alert("HTTP Request Error: " + response.status);
        return {};
    }
}

function createHTMLElement(type, id, className, innerText, innerHTML) {
    const element = document.createElement(type);
    element.className = className;
    if (id) element.id = id;
    if (innerText) element.innerText = innerText;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

function startExpiryTimer(minutes, seconds) {
    const currencyComponent = getCurrencyComponent();
    var counterMinutes = 0;
    var counterSeconds = 0;
    expiryTimer = setInterval(() => {
        counterSeconds++;
        if (seconds == 0) {
            if (minutes == 0) {
                clearInterval(expiryTimer);
                currencyComponent.querySelector(".counter-container").classList.remove("active-timer");
                currencyComponent.querySelector("#result-converter").classList.remove("active-result");
            };
            minutes--;
            seconds = 59;
            counterMinutes++;
        } else {
            seconds--;
        }
        updateTimeElements(counterMinutes, minutes, counterSeconds, seconds);
    }, 1000);
}

function updateTimeElements(counterMinutes, minutes, counterSeconds, seconds) {
    const currencyComponent = getCurrencyComponent();
    const minutesElement = currencyComponent.querySelector("#minutes-display");
    const secondsElement = currencyComponent.querySelector("#seconds-display");
    if (minutesElement.innerText != minutes + "'") minutesElement.style.transform = `translate(-50%,-50%) rotate(${180 * counterMinutes}deg) scale(${Math.pow(-1, counterMinutes)},${Math.pow(-1, counterMinutes)}) `;
    if (secondsElement.innerText != seconds + '"') secondsElement.style.transform = `translate(-50%,-50%) rotate(${180 * counterSeconds}deg) scale(${Math.pow(-1, counterSeconds)},${Math.pow(-1, counterSeconds)})`;
    minutesElement.innerText = minutes + "'";
    secondsElement.innerText = seconds + '"';
}