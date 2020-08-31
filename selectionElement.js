function generateSelectionElement(rates, currencyNames, selectedCurrency, selectId, inputSearchId, listId) {
    // createHTMLElement(type, id, className, innerText, innerHTML)
    const selectionContainer = createHTMLElement("button", selectId, "select-container", null, null);
    const imgCurrency = createHTMLElement("img", null, "select-currency-flag-img", null, null);
    imgCurrency.src = "https://www.countryflags.io/gb/flat/64.png";
    const spanLabel = createHTMLElement("span", null, "select-currency-label", null, null,);
    const spanLabelName = createHTMLElement("span", null, "select-currency-label", null, null,);
    const listCurrenciesContainer = createHTMLElement("ul", listId, "currency-list-select", null, null);
    const liSearchContainer = createHTMLElement("li", "seach-currency-container", "seach-currency-container", null, null);
    const errorMessageSearch = createHTMLElement("span", null, "error-message-search", "No currencies found", null);
    const searchCurrencyInput = createHTMLElement("input", inputSearchId, "search-currency-input", null, null);
    searchCurrencyInput.placeholder = "Search Currency";
    searchCurrencyInput.addEventListener("input", (e) => { handleSearchCurrencyInput(e.target); });
    const iElementArrowDown = createHTMLElement("i", null, "fas fa-angle-down", null, null);
    const iElementSearch = createHTMLElement("i", null, "fas fa-search", null, null);
    liSearchContainer.appendChild(iElementSearch);
    liSearchContainer.appendChild(searchCurrencyInput);
    liSearchContainer.appendChild(errorMessageSearch);
    selectionContainer.appendChild(imgCurrency);
    selectionContainer.appendChild(spanLabel);
    selectionContainer.appendChild(spanLabelName);
    selectionContainer.appendChild(iElementArrowDown);
    selectionContainer.addEventListener("click", (e) => { handleSelectionButtonClick(e); });
    listCurrenciesContainer.appendChild(liSearchContainer);
    addListItemsForToSelection(rates, currencyNames, listCurrenciesContainer);
    listCurrenciesContainer.children[selectedCurrency].children[0].classList.add("selected-currency");
    spanLabel.innerText = listCurrenciesContainer.children[selectedCurrency].children[0].children[1].innerText;
    spanLabelName.innerText = listCurrenciesContainer.children[selectedCurrency].children[0].children[2].innerText;
    imgCurrency.src = listCurrenciesContainer.children[selectedCurrency].children[0].children[0].src;
    selectionContainer.appendChild(listCurrenciesContainer);
    return selectionContainer;
}

function addListItemsForToSelection(rates, currencyNames, selectionList) {
    for (const [key, value] of Object.entries(rates)) {
        addListItemToSelectionList(selectionList, key, currencyNames[key]);
    }
}

function addListItemToSelectionList(selectionList, value, currencyName) {
    const liItemContainer = createHTMLElement("li", null, "item-currency-select", null, null, null);
    const button = createHTMLElement("button", null, `item-currency-select-button ${value}`, null, null, null);
    const imgItemCurrency = createHTMLElement("img", null, "item-currency-flag-img", null, null, null);
    const flagType = value.substring(0, value.length - 1).toLowerCase();
    imgItemCurrency.src = `https://www.countryflags.io/${flagType}/flat/64.png`;
    const spanLabelItemCurrency = createHTMLElement("span", null, "item-currency-select-label", value, null, null);
    const spanLabelItemCountryName = createHTMLElement("span", null, "item-currency-select-label", " /" + currencyName, null, null);
    button.appendChild(imgItemCurrency);
    button.appendChild(spanLabelItemCurrency);
    button.appendChild(spanLabelItemCountryName);
    liItemContainer.appendChild(button);
    button.addEventListener("click", (event) => {
        handleSelectionItemClick(event)
    });
    selectionList.appendChild(liItemContainer);
}

function handleSelectionButtonClick(event) {
    const currencyComponent = getCurrencyComponent();
    var button = event.target;
    if (button.className != "select-container") button = event.target.parentElement;
    if (button.className != "select-container") return;
    const activeList = currencyComponent.querySelector(".active-panel");
    if (activeList) activeList.classList.remove("active-panel");
    const listOfCurrencies = button.children[4];
    listOfCurrencies.classList.add("active-panel");
    listOfCurrencies.children[0].children[1].focus();
}

function handleSearchCurrencyInput(inputElemet) {
    const listElement = inputElemet.parentElement.parentElement;
    const filter = inputElemet.value.toUpperCase();
    const listItems = listElement.querySelectorAll(".item-currency-select-button");
    counter = 0;
    listItems.forEach((item) => {
        const labelItem = item.children[1];
        const labelItem2 = item.children[2];
        const labelItemTxt = labelItem.textContent || labelItem.innerText;
        const labelItem2Txt = labelItem2.textContent || labelItem2.innerText;
        labelItemTxt.toUpperCase().indexOf(filter) > -1 || labelItem2Txt.toUpperCase().indexOf(filter) > -1 ? item.parentElement.style.display = "" : item.parentElement.style.display = "none";
        item.parentElement.offsetWidth > 0 && item.parentElement.offsetHeight > 0 ? counter++ : counter--;
    });
    setVisibilityErrorSearch(counter == -52, inputElemet.parentElement)
}

function setVisibilityErrorSearch(isVisible, element) {
    const errorMessage = element.querySelector(".error-message-search");
    if (isVisible) {
        errorMessage.style.opacity = "1";
        element.style.borderBottom = "1px solid #fa1818";
    } else {
        errorMessage.style.opacity = "0";
        element.style.borderBottom = "1px solid #a1a1a1";
    };
}

function handleSelectionItemClick(event) {
    const currencyComponent = getCurrencyComponent();
    var listItem = event.target;
    if (listItem.classList[0] != "item-currency-select-button") listItem = event.target.parentElement;
    const activeItem = listItem.parentElement.parentElement.querySelector(".selected-currency");
    activeItem.classList.remove("selected-currency");
    listItem.classList.add("selected-currency");
    listItem.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.innerText = listItem.children[1].innerText;
    listItem.parentElement.parentElement.previousElementSibling.previousElementSibling.innerText = listItem.children[2].innerText;
    listItem.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.src = listItem.children[0].src;
    const activeList = currencyComponent.querySelector(".active-panel");
    if (activeList) activeList.classList.remove("active-panel");
}

function handleClickWindow(event) {
    const currencyComponent = getCurrencyComponent();
    if (event.target.className != "select-container" && event.target.parentElement.className != "select-container" && event.target.className != "search-currency-input" && event.target.parentElement.className != "select-seach-currency") {
        const listsOfCurrencies = currencyComponent.querySelectorAll("ul");
        listsOfCurrencies.forEach((item, i) => {
            item.classList.remove("active-panel");
            currencyComponent.querySelectorAll(".search-currency-input")[i].value = "";
            listsOfCurrencies[i].querySelectorAll(".item-currency-select-button").forEach((item, i) => {
                item.parentElement.style.display = "";
            });

        });
    }
}

window.addEventListener("click", (event) => {
    handleClickWindow(event);
});



