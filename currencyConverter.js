async function generateCurrencyComponent() {
    const currencyComponent = document.getElementById("curency-component");
    const inputContainer = createHTMLElement("div", "", "input-container", "", "");
    const buttonReverse = createHTMLElement("button", "reverse-btn", "reverse-btn", "", '<i class="fas fa-exchange-alt"></i>');
    buttonReverse.addEventListener("click", () => { handleReverseBtn(); });
    const label = createHTMLElement("label", "input-label", "input-label", "Amount", "");
    const inputAmount = createHTMLElement("input", "input-amount", "currency-input", "", "");
    inputAmount.placeholder = "Enter Amount";
    inputAmount.value = "100";
    inputAmount.addEventListener("input", (e) => {
        handleInput(e.target);
    })
    inputContainer.appendChild(buttonReverse);
    inputContainer.appendChild(label);
    inputContainer.appendChild(inputAmount);
    const selectCurrency = createHTMLElement("select", "currecy-select-convreting", "select-curency", "", "");
    const selectCurrencyConvert = createHTMLElement("select", "currecy-select-to-covert", "select-curency", "", "");
    const data = await getApiData("https://api.exchangerate-api.com/v4/latest/GBP");
    const convertButton = createHTMLElement("button", "convert-btn", "convert-btn", "Convert", "");
    convertButton.addEventListener("click", () => { handleConvertButton(); });
    convertButton.disabled = true;
    const errorMsg = createHTMLElement("p", "error-msg", "error-msg", "Invalid Amount", "");
    const resultMsg = createHTMLElement("p", "result-converter", "result-converter", "", "");
    currencyComponent.appendChild(inputContainer);
    currencyComponent.appendChild(selectCurrency);
    currencyComponent.appendChild(selectCurrencyConvert);
    currencyComponent.appendChild(errorMsg);
    currencyComponent.appendChild(resultMsg);
    currencyComponent.appendChild(convertButton);
    loopThroughObjectDataForSelections(data.rates, addOptionToSelectMenu);
    selectCurrencyConvert.selectedIndex = 3;
    handleInput(inputAmount)
}

generateCurrencyComponent();

async function handleConvertButton() {
    const selectCurrency = document.getElementById("currecy-select-convreting");
    const selectCurrencyConvert = document.getElementById("currecy-select-to-covert");
    const selectedCurency1 = selectCurrency.options[selectCurrency.selectedIndex].innerText;
    const selectedCurency2 = selectCurrencyConvert.options[selectCurrencyConvert.selectedIndex].innerText;
    const inputAmountValue = document.getElementById("input-amount").value;
    const resultCoverter = document.querySelector(".result-converter");
    if (!isNaN(inputAmountValue)) {
        const data = await getApiData("https://api.exchangerate-api.com/v4/latest/GBP");
        var toGB = 1 / data.rates[selectedCurency1];
        var convertedValue = Number(inputAmountValue) * data.rates[selectedCurency2] * toGB;
        console.log(convertedValue);
        resultCoverter.innerText = inputAmountValue + " " + selectedCurency1 + " is equivalent to " + convertedValue + " " + selectedCurency2
    }
}

function handleInput(element) {
    const value = element.value;
    const errorMsg = document.querySelector(".error-msg");
    const selectionMenus = document.querySelectorAll(".select-curency");
    const convertButton = document.querySelector(".convert-btn");
    isNaN(value) ? errorMsg.style.display = "block" : errorMsg.style.display = "none";
    isNaN(value) ? selectionMenus[0].style.display = "none" : selectionMenus[0].style.display = "block";
    isNaN(value) ? selectionMenus[1].style.display = "none" : selectionMenus[1].style.display = "block";
    value && !isNaN(value) ? convertButton.disabled = false : convertButton.disabled = true;
}

function loopThroughObjectDataForSelections(obj, operationFunction) {
    const selectionMenus = document.querySelectorAll(".select-curency");
    for (const [key, value] of Object.entries(obj)) {
        selectionMenus.forEach((e) => {
            operationFunction(e, key);
        });
    }
}

function handleReverseBtn() {
    const selectionMenus = document.querySelectorAll(".select-curency");
    const index1 = selectionMenus[0].selectedIndex;
    const index2 = selectionMenus[1].selectedIndex;
    selectionMenus[0].selectedIndex = index2;
    selectionMenus[1].selectedIndex = index1;
}

function addOptionToSelectMenu(parent, value) {
    const option = createHTMLElement("option", "", "currency-option", value, "");
    option.value = parent.children.length;
    parent.appendChild(option);
}

async function getApiData(url) {
    var response = await fetch(url);
    if (response.ok) {
        let json = response.json();
        return json;
    } else {
        alert("HTTP Request Error: " + response.status);
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