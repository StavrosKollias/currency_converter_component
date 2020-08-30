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
    const selectCurrency = createHTMLElement("select", "currecy-select-convreting", "currency-select", null, null);
    const selectCurrencyConvert = createHTMLElement("select", "currecy-select-to-covert", "currency-select", null, null);
    const convertButton = createHTMLElement("button", "convert-btn", "convert-btn", "Convert", null);
    convertButton.addEventListener("click", handleConvertButtonClick);
    convertButton.disabled = true;
    const errorMsg = createHTMLElement("p", "error-msg", "error-msg", "Invalid Amount", null);
    const resultMsg = createHTMLElement("p", "result-converter", "result-converter", null, null);
    const timeContainer = createHTMLElement("div", null, "counter-container", null, null);
    const minutesContainer = createHTMLElement("div", "minutes-container", "time-container", null, null)
    const minutesDisplay = createHTMLElement("span", "minutes-display", "time", null, null, null, null);
    const secondsContainer = createHTMLElement("div", "seconds-container", "time-container", null, null);
    const secondsDisplay = createHTMLElement("span", "seconds-display", "time", null, null);
    minutesContainer.appendChild(minutesDisplay);
    secondsContainer.appendChild(secondsDisplay);
    timeContainer.appendChild(minutesContainer);
    timeContainer.appendChild(secondsContainer);
    currencyComponent.appendChild(inputContainer);
    currencyComponent.appendChild(selectCurrency);
    currencyComponent.appendChild(selectCurrencyConvert);
    currencyComponent.appendChild(errorMsg);
    currencyComponent.appendChild(resultMsg);
    currencyComponent.appendChild(timeContainer);
    currencyComponent.appendChild(convertButton);
    const rates = await getExchangeRatesFromApi("GBP");
    addOptionsToCurrencySelects(rates);
    selectCurrencyConvert.selectedIndex = 3;
    hadleAmountInput(inputAmount);
}

var expiryTimer;
generateCurrencyComponent();

async function handleConvertButtonClick() {
    const selectCurrency = document.getElementById("currecy-select-convreting");
    const selectCurrencyConvert = document.getElementById("currecy-select-to-covert");
    const selectedCurency1 = selectCurrency.options[selectCurrency.selectedIndex].innerText;
    const selectedCurency2 = selectCurrencyConvert.options[selectCurrencyConvert.selectedIndex].innerText;
    const inputAmountValue = document.getElementById("input-amount").value;
    const resultCoverter = document.querySelector(".result-converter");
    clearInterval(expiryTimer);
    const rates = await getExchangeRatesFromApi(selectedCurency1);
    var convertedValue = Number(inputAmountValue) * rates[selectedCurency2];
    resultCoverter.innerText = inputAmountValue + " " + selectedCurency1 + " is equivalent to " + convertedValue + " " + selectedCurency2;
    startExpiryTimer(10, 0);
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

function addOptionsToCurrencySelects(rates) {
    const selectionMenus = document.querySelectorAll(".currency-select");
    for (const [key, value] of Object.entries(rates)) {
        selectionMenus.forEach((e) => {
            const option = createHTMLElement("option", null, "currency-option", key, null);
            option.value = e.children.length;
            e.appendChild(option);
        });
    }
}

function handleSwitchCurrenciesButtonClick() {
    const currencyComponent = getCurrencyComponent();
    const selectionMenus = currencyComponent.querySelectorAll(".currency-select");
    const index1 = selectionMenus[0].selectedIndex;
    const index2 = selectionMenus[1].selectedIndex;
    selectionMenus[0].selectedIndex = index2;
    selectionMenus[1].selectedIndex = index1;
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
    counterMinutes = 0;
    counterSeconds = 0;
    const minutesElement = document.querySelector("#minutes-display");
    const secondsElement = document.querySelector("#seconds-display");
    console.log(minutes + "'" + ":" + seconds + '"');
    expiryTimer = setInterval(() => {
        if (minutesElement.innerText != minutes + "'") minutesElement.style.transform = `translate(-50%,-50%) rotate(${180 * counterMinutes}deg) scale(${Math.pow(-1, counterSeconds)},${Math.pow(-1, counterSeconds)}) `;
        if (secondsElement.innerText != seconds + '"') secondsElement.style.transform = `translate(-50%,-50%) rotate(${180 * counterSeconds}deg) scale(${Math.pow(-1, counterSeconds)},${Math.pow(-1, counterSeconds)})`;
        minutesElement.innerText = minutes + "'";
        secondsElement.innerText = seconds + '"';
        counterSeconds++;
        if (seconds == 0) {
            if (minutes == 0) {
                clearInterval(expiryTimer);
                document.querySelector(".counter-container").style.display = "none";
            };
            minutes--;
            seconds = 59;
            counterMinutes++;
        } else {
            seconds--;
        }
    }, 1000);
}