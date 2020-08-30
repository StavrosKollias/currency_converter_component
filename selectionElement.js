function generateSelectionElement(rates, selectedCurrency, selectId, inputSearchId, listId) {
    const selectionContainer = createHTMLElement("button", selectId, "selection-container", null, null,);
    const imgCurrency = createHTMLElement("img", null, "select-currency-flag-img", null, null);
    imgCurrency.src = "https://www.countryflags.io/gb/flat/64.png";
    const spanLabel = createHTMLElement("span", null, "select-currency-label", "Option 1", null,);
    const listCurrenciesContainer = createHTMLElement("ul", listId, "currency-list-select", null, null,);
    const liSearchContainer = createHTMLElement("li", "seach-currency-container", "seach-currency-container", null, null,);
    const searchCurrencyInput = createHTMLElement("input", inputSearchId, "search-currency-input", null, null);
    searchCurrencyInput.placeholder = "Search Currency";
    searchCurrencyInput.addEventListener("input", (e) => { handleSearchCurrencyInput(e.target); });
    const iElementArrowDown = createHTMLElement("i", null, "fas fa-angle-down", null, null);
    const iElementSearch = createHTMLElement("i", null, "fas fa-search", null, null);
    liSearchContainer.appendChild(iElementSearch);
    liSearchContainer.appendChild(searchCurrencyInput);
    selectionContainer.appendChild(imgCurrency);
    selectionContainer.appendChild(spanLabel);
    selectionContainer.appendChild(iElementArrowDown);
    selectionContainer.addEventListener("click", (e) => { handleSelectionButtonClick(e); });
    listCurrenciesContainer.appendChild(liSearchContainer);
    addListItemsForToSelection(rates, listCurrenciesContainer);
    listCurrenciesContainer.children[selectedCurrency].children[0].classList.add("selected-currency");
    spanLabel.innerText = listCurrenciesContainer.children[selectedCurrency].children[0].children[1].innerText;
    imgCurrency.src = listCurrenciesContainer.children[selectedCurrency].children[0].children[0].src;
    selectionContainer.appendChild(listCurrenciesContainer);
    return selectionContainer;
}

function addListItemsForToSelection(rates, selectionList) {
    for (const [key, value] of Object.entries(rates)) {
        addListItemToSelectionList(selectionList, key);
    }
}

function addListItemToSelectionList(selectionList, value) {
    const liItemContainer = createHTMLElement("li", null, "item-currency-select", null, null, null);
    const button = createHTMLElement("button", null, `item-currency-select-btn ${value}`, null, null, null);
    const imgItemCurrency = createHTMLElement("img", null, "item-currency-flag-img", null, null, null);
    const flagType = value.substring(0, value.length - 1).toLowerCase();
    imgItemCurrency.src = `https://www.countryflags.io/${flagType}/flat/64.png`;
    const spanLabelItem = createHTMLElement("span", null, "item-currency-select-label", value, null, null);
    button.appendChild(imgItemCurrency);
    button.appendChild(spanLabelItem);
    liItemContainer.appendChild(button);
    button.addEventListener("click", (event) => {
        handleSelectionItemClick(event)
    });
    selectionList.appendChild(liItemContainer);
}

function handleSelectionButtonClick(event) {
    const currencyComponent = getCurrencyComponent();
    var button = event.target;
    if (button.className != "selection-container") button = event.target.parentElement;
    if (button.className != "selection-container") return;
    const activeList = currencyComponent.querySelector(".active-panel");
    if (activeList) activeList.classList.remove("active-panel");
    const listOfCurrencies = button.children[3];
    listOfCurrencies.classList.add("active-panel");
    listOfCurrencies.children[0].children[1].focus();
}


function handleSearchCurrencyInput(inputElemet) {
    const listElement = inputElemet.parentElement.parentElement;
    const filter = inputElemet.value.toUpperCase();
    const listItems = listElement.querySelectorAll(".select-item-currency-btn");
    listItems.forEach((item) => {
        const labelItem = item.children[1];
        const labelItemTxt = labelItem.textContent || labelItem.innerText;
        labelItemTxt.toUpperCase().indexOf(filter) > -1 ? item.parentElement.style.display = null : item.parentElement.style.display = "none";
    });
}

function handleSelectionItemClick(event) {
    const currencyComponent = getCurrencyComponent();
    var listItem = event.target;
    if (listItem.classList[0] != "item-currency-select-btn") listItem = event.target.parentElement;
    const activeItem = listItem.parentElement.parentElement.querySelector(".selected-currency");
    activeItem.classList.remove("selected-currency");
    listItem.classList.add("selected-currency");
    listItem.parentElement.parentElement.previousElementSibling.previousElementSibling.innerText = listItem.children[1].innerText;
    listItem.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.src = listItem.children[0].src;
    const activeList = currencyComponent.querySelector(".active-panel");
    if (activeList) activeList.classList.remove("active-panel");
}