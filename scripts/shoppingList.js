function loadShoppingList(response) {
    return new Promise((resolve, reject) => {
        try {
            setUpCardContainer();
            appendShoppingList();
            setShoppingListListener();
            setListCardListeners();
            refreshShoppingList(listKey);
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

    //console.log('refreshing shopping list')
    let counter = document.getElementById('listCounter');
    let container = document.getElementById('listCardContainer');
    container.innerHTML = '';
    let list = JSON.parse(localStorage.getItem(key));
    counter.textContent = `${list.length}` // refresh the list counter count
    list.forEach(item => {
        let card = getListCardFrag(item[lsProps.description], item[lsProps.price], item[lsProps.save], item[lsProps.image], item["quantity"] ? item["quantity"] : 1, item[lsProps.menu], item[lsProps.id])
        container.append(card.content);
    });
    updateTotal(list)
}

function alterLocalStorage(action, target, data = undefined, isAdding = false) {
    let parentCard;
    switch (action) {
        case 'add':
            parentCard = target.closest('.card');
            break;
        case 'remove':
            parentCard = target.closest('.listCard');
            break;
        case 'update':
            parentCard = target.closest('.listCard');
            break;
        case 'check':
            parentCard = target.closest('.card');
            break;
        default:
            console.log("Something's not right");
            return;
    }

    // Get the src attribute value of the sibling img
    const idElement = parentCard.querySelector('id-element');
    const idAttr = idElement.getAttribute('data-id');
    let foundIndex = getLocalStorageItemMatch(idAttr, lsProps.id, listKey) // hypothetically no blocks should have duplicate images, so for now I'm using the img src as a unique key for comparing ad items
    let list = JSON.parse(localStorage.getItem(listKey))

    switch (action) {
        case 'add':
            if (foundIndex == undefined) { // if it is undefined, the target was not found on the list, so we're okay to add it
                list.push(data)
            }
            break;
        case 'remove':
            if (foundIndex !== undefined) {
                list.splice(foundIndex, 1);
            }
            break;
        case 'update':
            const quantityNode = parentCard.querySelector('.quantity');
            let quantity = parseInt(quantityNode.innerHTML);

            if (isAdding) {
                //console.log('add quantity')
                quantityNode.textContent = quantity + 1;
                list[foundIndex].quantity = quantity + 1;
            } else {
                //console.log('subtract quantity')
                quantityNode.textContent = quantity - 1;
                list[foundIndex].quantity = quantity - 1;
                if (quantity - 1 <= 0) {
                    setTimeout(() => { alterLocalStorage(actions.remove, target) }, 200);
                }
            }
            break;
        case 'check':
            if (foundIndex !== undefined) {
                return foundIndex;
            } else {
                return false;
            }
            break;
        default:
            console.log("Something's not right");
            return;
    }

    localStorage.setItem(listKey, JSON.stringify(list));
    if (action == "add" || action == "remove") refreshShoppingList(listKey);
    updateTotal(list);
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

function updateTotal(list) {
    let total = 0;
    list.forEach(itemData => {
        let price = parseFloat(`${itemData[lsProps.price]}`.replace('$', ''));
        let q = itemData["quantity"] ? itemData["quantity"] : 1;
        total += q * price;
    });

    document.querySelector("#total").textContent = `$${total.toFixed(2)}`;
}



/* LISTENERS */
/* LISTENERS */
/* LISTENERS */

function setShoppingListListener() {
    /* LIST VIEW TOGGLE */
    let items = [`#toolbar`, `.scrollContainer`]
    items.forEach(item => {
        document.querySelector(item).addEventListener('click', (event) => {

            if (event.target.classList.contains('scrollContainer') ||
                event.target === document.querySelector(".header") ||
                event.target === document.querySelector(".header > h1") ||
                event.target === document.querySelector(".header > img") ||
                event.target === document.querySelector(".header > h1") ||
                event.target === document.querySelector(".header > .listIcon")) {
                //console.log('toggle shopping list')
                document.querySelector(`.scrollContainer`).classList.toggle('showCards')
                document.body.classList.toggle("noScroll");
            }
        })
    });

    document.querySelector('.header').addEventListener('keydown', (e) => {
        if (e.key == "Enter") {
            document.querySelector(`.scrollContainer`).classList.toggle('showCards')
            document.body.classList.toggle("noScroll");
        }
    })
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" || e.key === "Esc") {
            if (document.querySelector(`.scrollContainer`).classList.contains('showCards')) {
                document.querySelector(`.scrollContainer`).classList.toggle('showCards')
                document.body.classList.toggle("noScroll");
            }
        }
    })
}

function setPrintListener() {
    Array.from(document.getElementsByClassName('print')).forEach(button => {
        button.addEventListener('click', () => {
            console.log("printing... or attempting to")
            window.print();
        })
        button.addEventListener('keypress', (e) => {
            let char = e.which || e.keyCode || e.charCode;

            if (char == 13) {
                console.log("printing... or attempting to")
                window.print();
            }
        })
    })
}

function setListCardListeners() {
    // set the listener associated with the move and delete functions
    let container = document.getElementById('listCardContainer');
    container.addEventListener('click', (event) => {
        if (event.target.classList.contains('deleteButton')) {
            alterLocalStorage(actions.remove, event.target)
        } else if (event.target.classList.contains('quantityAdd')) {
            //editQuantity(event.target, true);
            alterLocalStorage(actions.update, event.target, undefined, true);
        } else if (event.target.classList.contains('quantitySubtract')) {
            //editQuantity(event.target, false);
            alterLocalStorage(actions.update, event.target, undefined, false);
        }
    })
}



/* FRAGMENTS & SETUP */
/* FRAGMENTS & SETUP */
/* FRAGMENTS & SETUP */

function appendShoppingList() {
    let parent = document.getElementById('toolbar')
    /*     let div = document.createElement('div');
        div.className = 'listDropdown';
        document.getElementById('ad').append(div) */

    let toolbar = getToolbarFrag();
    parent.prepend(toolbar.content);
}

function setUpCardContainer() {
    const container = document.createElement('template');

    let fragment = `
        <div class="scrollContainer">
            <div id="listCardContainer">
            </div>
            <div id="listControls">
                <span id="scrollPrint" class="material-symbols-outlined print">print</span>
                <p id="totalButton">Total:<span id="total">$0.00</span></p>
            </div>
        </div>`;

    container.innerHTML = fragment;
    document.getElementById('ad').prepend(container.content)
}

function getToolbarFrag() {
    const card = document.createElement('template');

    let fragment = `
                <div tabindex=0 class="header">
                    <span class="material-symbols-outlined listIcon">receipt_long</span>
                        <h1>View Shopping List</h1>
                    <span id="listCounter" class="button">0</span>
                </div>
                <span tabindex=0 class="material-symbols-outlined print">print</span>`;

    card.innerHTML = fragment;
    return card;
}

