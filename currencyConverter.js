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
    const inputContainer = createHTMLElement("div", null, "input-container", null, null);
    const buttonReverse = createHTMLElement("button", "reverse-btn", "reverse-btn", null, '<i class="fas fa-exchange-alt"></i>');
    buttonReverse.addEventListener("click", () => { handleSwitchCurrenciesButtonClick(currencyComponent) });
    const label = createHTMLElement("label", "input-label", "input-label", "Amount", null);
    const inputAmount = createHTMLElement("input", "input-amount", "currency-input", null, null);
    inputAmount.placeholder = "Enter Amount";
    inputAmount.value = "100";
    inputAmount.addEventListener("input", (e) => {
        hadleAmountInput(e.target);
    });
    inputContainer.appendChild(buttonReverse);
    inputContainer.appendChild(label);
    inputContainer.appendChild(inputAmount);
    const rates = await getExchangeRatesFromApi("GBP");
    const selectCurrency = generateSelectionElement(rates, 1, "curency-amount-select", "search-currency-input-amount", "currency-amount-list");
    const selectCurrencyConvert = generateSelectionElement(rates, 3, "curency-convert-select", "search-currency-input-convert", "currency-convert-list");
    const convertButton = createHTMLElement("button", "convert-btn", "convert-btn", "Convert", null);
    convertButton.addEventListener("click", handleConvertButtonClick);
    convertButton.disabled = true;
    const errorMsg = createHTMLElement("p", "error-msg", "error-msg", "Invalid Amount", null);
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
    const selectedCurency1 = currencyComponent.getElementById("curency-amount-select").children[1].innerText;
    const selectedCurency2 = currencyComponent.getElementById("curency-convert-select").children[1].innerText;
    const inputAmountValue = currencyComponent.getElementById("input-amount").value;
    const resultCoverter = currencyComponent.querySelector(".result-converter");
    clearInterval(expiryTimer);
    const rates = await getExchangeRatesFromApi(selectedCurency1);
    var convertedValue = Number(inputAmountValue) * rates[selectedCurency2];
    resultCoverter.innerText = inputAmountValue + " " + selectedCurency1 + " is equivalent to " + convertedValue + " " + selectedCurency2;
    startExpiryTimer(10, 0);
    updateTimeElements(0, 10, 0, 0);
    document.querySelector(".counter-container").style.display = "block";
}

function hadleAmountInput(element) {
    const value = element.value;
    const convertButton = document.querySelector(".convert-btn");
    value && !isNaN(value) ? convertButton.disabled = false : convertButton.disabled = true;
    setErrorMessageVisibility(isNaN(value));
}

function setErrorMessageVisibility(isVisible) {
    const errorMsg = document.querySelector(".error-msg");
    isVisible ? errorMsg.style.display = "block" : errorMsg.style.display = "none";
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
    console.log(minutes + "'" + ":" + seconds + '"');
    expiryTimer = setInterval(() => {
        updateTimeElements(counterMinutes, minutes, counterSeconds, seconds);
        counterSeconds++;
        if (seconds == 0) {
            if (minutes == 0) {
                clearInterval(expiryTimer);
                currencyComponent.querySelector(".counter-container").style.display = "none";
                currencyComponent.querySelector("#result-converter").style.display = "none";
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