function loadShoppingList(response) {
    return new Promise((resolve, reject) => {
        try {
            setUpCardContainer();
            appendShoppingList();
            setShoppingListListener();
            setListCardListeners();
            refreshShoppingList(listKey)
            setPrintListener();
            resolve(true);
        } catch (error) {
            console.error("An error occurred:", error);
            reject(error);
        }
    });
}


function refreshShoppingList(key = 'shopping list') {
    // scrap the current shopping list
    // iterate over localStorage object and reconstruct the shopping list widget

    console.log('refreshing shopping list')
    let counter = document.getElementById('listCounter');
    let container = document.getElementById('listCardContainer');
    container.innerHTML = '';
    let list = JSON.parse(localStorage.getItem(key));
    counter.textContent = `${list.length}` // refresh the list counter count
    list.forEach(itemData => {
        let card = getListCardFrag(itemData["Product Description"], itemData["Cost"], itemData["Save"], itemData["Image"])
        container.append(card.content);
    });
    ScrollTrigger.refresh();
}

function setShoppingListListener() {
    /* LIST VIEW TOGGLE */
    let items = [`.listDropdown > .toolBar`, `.scrollContainer`]
    items.forEach(item => {
        document.querySelector(item).addEventListener('click', (event) => {

            if (event.target.classList.contains('scrollContainer') ||
                event.target === document.querySelector(".header") ||
                event.target === document.querySelector(".header > h1") ||
                event.target === document.querySelector(".header > img")) {
                console.log('toggle shopping list')
                document.querySelector(`.scrollContainer`).classList.toggle('showCards')
                document.body.classList.toggle("noScroll");
            }
        })
    });
}

function setPrintListener() {
    Array.from(document.getElementsByClassName('print')).forEach(button => {
        button.addEventListener('click', () => {
            console.log("printing... or attempting to")
            window.print();
        })
    })
    
    
}

function appendShoppingList() {
    let parent = document.getElementById('weeklyadContainer')
    let div = document.createElement('div');
    div.className = 'listDropdown';
    parent.insertBefore(div, parent.firstChild);

    let shoppingList = getShoppingListFrag();
    div.append(shoppingList.content);


}

function setListCardListeners() {
    // set the listener associated with the move and delete functions
    let container = document.getElementById('listCardContainer');
    container.addEventListener('click', (event) => {
        if (event.target.classList.contains('deleteButton')) {
            removeFromList(event.target);
        }
    })
}

function removeFromList(target) {
    console.log(`deleting item ${target}`)
    const parentCard = target.closest('.listCard');
    const imgElement = parentCard.querySelector('img');
    // Get the src attribute value of the corresponding img
    const imgSrc = imgElement.getAttribute('src');

    // Use imgSrc as needed
    console.log('Clicked img src:', imgSrc);
    let foundIndex = getLocalStorageItemMatch(imgSrc, lsProps.image, listKey)
    if (foundIndex !== undefined) {
        let list = JSON.parse(localStorage.getItem(listKey));
        list.splice(foundIndex, 1)
        localStorage.setItem(listKey, JSON.stringify(list));
        refreshShoppingList(listKey);
    }
}

function addToList(target, response) {
    const parentCard = target.closest('.card');
    const imgElement = parentCard.querySelector('img');
    // Get the src attribute value of the corresponding img
    const imgSrc = imgElement.getAttribute('src');

    let foundIndex = getLocalStorageItemMatch(imgSrc, lsProps.image, listKey)
    if (foundIndex == undefined) {
        let list = JSON.parse(localStorage.getItem(listKey))
        list.push(response)
        localStorage.setItem(listKey, JSON.stringify(list));

        console.log(JSON.parse(localStorage.getItem(listKey)))
        refreshShoppingList(listKey);
    }
}

function getLocalStorageItemMatch(value, prop, key = listKey) {
    let list = JSON.parse(localStorage.getItem(key));

    for (let i = 0; i < list.length; i++) {
        if (value.localeCompare(list[i][prop]) === 0) {
            return i;
        }
    }
    return undefined;
}


/* FRAGMENTS */
/* FRAGMENTS */
/* FRAGMENTS */

function setUpCardContainer() {
    const container = document.createElement('template');

    let fragment = `
        <div class="scrollContainer">
            <div id="listCardContainer">
            </div>
            <span id="scrollPrint" class="material-symbols-outlined print">print</span>
        </div>`;

    container.innerHTML = fragment;
    document.body.append(container.content)
}

function getListCardFrag(title, price, save, img) {
    const listCard = document.createElement('template');
    let fragment = `
            <div><div class="listCard">
				<img src="${img}">
				<div class="cardTextContainer">
					<h2>${title}</h2>
					<p>${price}</p>
					<p>Save ${save}</p>
                    <span class="material-symbols-outlined button deleteButton ">delete</span>
				</div>
			<div></div>`;

    listCard.innerHTML = fragment;
    return listCard;
}

function getShoppingListFrag() {
    const card = document.createElement('template');

    let fragment = `
            <div class="toolBar">
                <div class="header">
                    <img class="icon" src="../images/material-symbols_format-list-bulleted.svg">
                    <h1>View Shopping List</h1>
                    <span id="listCounter" class="button">0</span>
                </div>
                <span class="material-symbols-outlined print">print</span>
            </div>`;

    card.innerHTML = fragment;
    return card;
}