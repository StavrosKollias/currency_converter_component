function getCurrencyComponent() {
    const component = document.getElementById("curency-component");
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
    const selectCurrency = generateSelectionElement(rates, currencyNames, 1, "curency-amount-select", "search-currency-input-amount", "currency-amount-list");
    const selectCurrencyConvert = generateSelectionElement(rates, currencyNames, 4, "curency-convert-select", "search-currency-input-convert", "currency-convert-list");
    const convertButton = createHTMLElement("button", "convert-button", "convert-button", "Convert", null);
    convertButton.addEventListener("click", handleConvertButtonClick);
    convertButton.disabled = true;
    const errorMsg = createHTMLElement("p", "error-msg", "error-msg", null, null);
    const resultMsg = createHTMLElement("p", "result-converter", "result-converter", null, null);
    const timeContainer = createHTMLElement("div", null, "counter-container", null, null);
    const textContainer = createHTMLElement("div", "time-text-container", "time-container", null, null);
    const textDisplay = createHTMLElement("span", "text-display", "time", "Expires in: ", null, null, null);
    const minutesContainer = createHTMLElement("div", "minutes-container", "time-container", null, null);
    const minutesDisplay = createHTMLElement("span", "minutes-display", "time", null, null, null, null);
    const secondsContainer = createHTMLElement("div", "seconds-container", "time-container", null, null);
    const secondsDisplay = createHTMLElement("span", "seconds-display", "time", null, null);
    textContainer.appendChild(textDisplay);
    minutesContainer.appendChild(minutesDisplay);
    secondsContainer.appendChild(secondsDisplay);
    timeContainer.appendChild(textContainer);
    timeContainer.appendChild(minutesContainer);
    timeContainer.appendChild(secondsContainer);
    currencyComponent.appendChild(inputContainer);
    currencyComponent.appendChild(selectCurrency);
    currencyComponent.appendChild(selectCurrencyConvert);
    currencyComponent.appendChild(errorMsg);
    currencyComponent.appendChild(resultMsg);
    currencyComponent.appendChild(timeContainer);
    currencyComponent.appendChild(convertButton);
    selectCurrencyConvert.selectedIndex = 3;
    hadleAmountInput(inputAmount);
}

var expiryTimer;
generateCurrencyComponent();

async function handleConvertButtonClick() {
    const currencyComponent = getCurrencyComponent();
    const selectedCurency1 = currencyComponent.querySelector("#curency-amount-select").children[1].innerText;
    const selectedCurency2 = currencyComponent.querySelector("#curency-convert-select").children[1].innerText;
    const inputAmountValue = currencyComponent.querySelector("#input-amount").value;
    const resultCoverter = currencyComponent.querySelector(".result-converter");
    clearInterval(expiryTimer);
    const rates = await getExchangeRatesFromApi(selectedCurency1);
    var convertedValue = Number(inputAmountValue) * rates[selectedCurency2];
    resultCoverter.innerText = inputAmountValue + " " + selectedCurency1 + " is equivalent to " + convertedValue.toFixed(4) + " " + selectedCurency2;
    startExpiryTimer(10, 0);
    updateTimeElements(0, 10, 0, 0);
    resultCoverter.classList.add("active-result");
    document.querySelector(".counter-container").classList.add("active-timer");
}

function hadleAmountInput(element) {
    const value = element.value;
    const convertButton = document.querySelector(".convert-button");
    value && !isNaN(value) ? convertButton.disabled = false : convertButton.disabled = true;
    setErrorMessageVisibility(isNaN(value), value, element);
}

function setErrorMessageVisibility(isVisible, value, inputElement) {
    const errorMsg = document.querySelector(".error-msg");
    if (isVisible) {
        inputElement.style.borderBottom = "0.15rem solid #fa1818";
        errorMsg.innerText = `${value} is not a valid amount`;
        errorMsg.classList.add("active-error");
    } else {
        errorMsg.innerText = "";
        errorMsg.classList.remove("active-error");
        inputElement.style.borderBottom = "0.15rem solid #32589e";
    }
}

function handleSwitchCurrenciesButtonClick() {
    const currencyComponent = getCurrencyComponent();
    const selectedCurency1 = currencyComponent.querySelector("#curency-amount-select");
    const activeSelection = selectedCurency1.querySelector(".selected-currency");
    activeSelection.classList.remove("selected-currency");
    const selectedCurency2 = currencyComponent.querySelector("#curency-convert-select");
    const activeSelection2 = selectedCurency2.querySelector(".selected-currency");
    activeSelection2.classList.remove("selected-currency");
    selectedCurency1.children[0].src = activeSelection2.children[0].src;
    selectedCurency1.children[1].innerText = activeSelection2.children[1].innerText;
    selectedCurency1.querySelector(`.${activeSelection2.children[1].innerText}`).classList.add("selected-currency");
    selectedCurency2.children[0].src = activeSelection.children[0].src;
    selectedCurency2.children[1].innerText = activeSelection.children[1].innerText;
    selectedCurency2.querySelector(`.${activeSelection.children[1].innerText}`).classList.add("selected-currency");
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
        updateTimeElements(counterMinutes, minutes, counterSeconds, seconds);
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