let lsProps = {
    image: "Image"
}
let listKey = 'shopping list';

let actions = {
    add: "add",
    remove: "remove",
    update: "update"
}

function loadWeeklyAd() {
    return new Promise((resolve, reject) => {
        fetch('https://script.google.com/macros/s/AKfycbw-ZbsqEASuUT_pNWggkiHaeqUr20qI9xXfOT7g7WbvLZOuZpQMpF67_l4lMkxcmNRQaQ/exec')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then(response => {
                // Process the JSON data here
                console.log(response);
                jsonToCards(response);
                initializeLocalStorage();
                setAddButtonListeners(response);
                resolve(response);
            })
            .catch(error => {
                // Handle errors here
                console.error('Fetch error:', error);
                reject(error);
            });
    });
}



function getCardFrag(title, price, save, img) {
    const card = document.createElement('template');
    let fragment = `
            <div class="card">
                <img
                    src="${img}">
                <div class="cardTextContainer">
                    <h2>${title}</h2>
                    <p>${price}</p>
                    <p>Save ${save}</p>
                </div>
                <p class="add">+ Add to List</p>
            </div>`;

    card.innerHTML = fragment;
    return card;
}

function jsonToCards(response) {
    let parent = document.createElement('div');
    parent.id = 'weeklyadContainer';
    document.body.appendChild(parent);

    let div = document.createElement('div');
    div.className = 'cardContainer';
    parent.appendChild(div);

    response.data.forEach(item => {
        //console.log(item["Product Description"])
        let card = getCardFrag(item["Product Description"], item["Cost"], item["Save"], item["Image"])
        div.append(card.content);
    });
}

function setAddButtonListeners(response) {
    // add a click listener to every add to list button
    // the item's data is stored within the scope of the listener.
    Array.from(document.getElementsByClassName('add')).forEach(function (button, i) {
        console.log("adding event listener to class items .add")
        button.addEventListener('click', (event) => {
            console.log('add to list click')
            //addToList(event.target, response.data[i]);
            alterLocalStorage(actions.add, event.target, response.data[i]);
        });
    });
}

function initializeLocalStorage() {
    //localStorage.clear();
    if (localStorage.getItem(listKey) === null) {
        localStorage.setItem(listKey, '[]');
    }
}//gsap.registerPlugin(ScrollTrigger);

function handleAnimations() {
    return new Promise((resolve, reject) => {
        try {
            /*console.log("gsaping")
            ScrollTrigger.refresh();

            ScrollTrigger.create({
                trigger: ".scrollContainer",
                start: "top top",
                end: "bottom 150px",
                markers: true,
                pin: true
            });
             ScrollTrigger.create({
                trigger: ".card",
                start: "top top",
                end: "bottom 50px",
                pin: true
            }); */
            
            let example = document.getElementById('listCardContainer')
            new Sortable(example, {
                animation: 300,
                ghostClass: 'ghost'
            });

            resolve(true);
        } catch (error) {
            console.error("An error occurred:", error);
            reject(error);
        }
    });
}

loadWeeklyAd().then(result => {
    console.log("cards loaded. loading shopping list");

    loadShoppingList(result).then(result2 => {
        console.log("shopping list loaded. loading animations")

        handleAnimations().then(result3 => {
            console.log("animations loaded")
        })
    })
})

let isReordering = false;

let page = document.querySelector(`.page`);
const pageDims = {
    height: page.offsetHeight,
    width: page.offsetWidth
}

convertPercent();
removeIDs();
injectButtons();

function injectButtons() {
    const buttons = document.createElement('template');
    let fragment = `
        <div id="controlButtons">
            <button id="reorderBtn" onclick="startReordering()">start ordering items</button>
            <button id="confirmBtn" onclick="confirmReorder()">confirm item order</button>
            <!-- <button onclick="convertPercent()">make responsive</button> -->
            <button onclick="save(new HtmlFrag().html);">save html</button>
        </div>`;

    buttons.innerHTML = fragment;
    document.body.appendChild(buttons.content)
}

function HtmlFrag() {

    this.stylesheet = `
        <link href="/Users/agreider/Desktop/Projects/_Weekly Ad/Digital Weekly Ad/css/viewstyles_layout.css" rel="stylesheet" type="text/css" />
	    <link href="/Users/agreider/Desktop/Projects/_Weekly Ad/Digital Weekly Ad/css/viewstyles_banners.css" rel="stylesheet" type="text/css" />`;

    this.script = `<script src="/Users/agreider/Desktop/Projects/_Weekly Ad/Digital Weekly Ad/scripts/adData_banners.js"></script>`;

    this.listDropdown = `
                <div class="listDropdown">
                    <div class="header">
                        <h1>Shopping List</h1>
                        <h1 id="print">🖨️</h1><h1>&darr;</h1>
                    </div>
                    <div class="scrollContainer">
                        <div id="listCardContainer">
                        </div>
                    </div>
                </div>
                <div id="overlayContainer"></div>`;

    this.getPages = function () {
        let pages = document.getElementsByClassName("page");
        let pageString = ``;
        for (let i = 0; i < pages.length; i++) {
            pageString += (pages[i].outerHTML)
        }
        return pageString;
    };

    this.html = `<!DOCTYPE html>
           <html lang="en">
           <head>
               <meta charset="UTF-8">
               <meta name="viewport" content="width=device-width, initial-scale=1.0">
               <title>Weekly Ad ${now(true)}</title>
               ${this.stylesheet}
           </head>
           <body>
               ${this.listDropdown}
               ${this.getPages()}
               ${this.script}
           </body>
           </html>`;
}

function save(htmlContent) {
    const blob = new Blob([htmlContent], { type: "text/html" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ad_${now()}.html`;
    a.hidden = true;
    document.body.appendChild(a);
    a.click();

    console.log(`saving html file as ${a.download}`)
}

function removeIDs() {
    let items = document.getElementsByClassName("item");
    let pages = document.getElementsByClassName("page");
    let imgs = document.querySelectorAll('.page > div > img');

    Array.from(items).forEach(item => {
        item.removeAttribute('id')
    });
    Array.from(imgs).forEach(img => {
        img.parentNode.removeAttribute('id');
        img.parentNode.removeAttribute('class');
        img.removeAttribute('class');
    })

    // get all .page and assign id page1, page2, page3...
    for (let i = 0; i < pages.length; i++) {
        pages[i].setAttribute('id', `page${i + 1}`)
    }

    console.log("removed id's")
}

function convertPercent() {
    let children = document.querySelectorAll(".item");
    children.forEach(child => {
        let computedStyle = getComputedStyle(child)
        let transformStr = computedStyle.transform;
        //console.log(transformStr);

        const values = transformStr.replace(/^matrix\(|\)$|\s/g, '').split(',');
        //console.log(values);

        let width = parseInt(computedStyle.width);
        let height = parseInt(computedStyle.height);

        child.style.transform = `none`;
        child.style.left = `${(values[4] / parseInt(pageDims.width) * 100)}%`;
        child.style.top = `${(values[5] / parseInt(pageDims.height) * 100)}%`;
        child.style.width = `${(width / parseInt(pageDims.width) * 102)}%`; // I changed these to 102% becuase the dimensions were consistently too small for some reason at 100%. Maybe a rounding error or something?
        child.style.height = `${(height / parseInt(pageDims.height) * 102)}%`;
        //console.log(`NEW left: ${child.style.left}  |  top: ${child.style.top}  |  width: ${child.style.width}  |  height: ${child.style.height}`);
    });
    console.log("converted percents")

}

function startReordering() {
    // assign a couple separate event listeners to items so they can be selected
    // when the item is selected and isReordering is true, stash the outer html of the item element, delete the item element
    // then append the stashed html to the parent element (at the bottom)
    items = document.getElementsByClassName("item");
    isReordering = true;

    Array.from(items).forEach(item => {
        // add a listener to toggle the classlist for visual feedback when an item is selected
        item.addEventListener("click", (e) => {
            e.target.classList.toggle("active");

            // stash the outer html
            let stash = item;
            // get parent node
            let page = item.parentNode;
            // delete original element
            item.remove();
            // append stashed html
            page.appendChild(stash);
        });
    });
    console.log(`starting reordering`)
}

function confirmReorder() {

    if (isReordering) {
        // refresh the cache of items so that they are selectable
        let items = document.getElementsByClassName("item");
        Array.from(items).forEach(item => {
            if (item.classList.contains("active"))
                item.classList.toggle("active");
        });
        console.log(`reorder confirmed`)

    } else {
        console.log("nothing to reorder!")
    }
}

function now(truncated = false) {
    var currentDate = new Date();

    var year = currentDate.getFullYear();
    var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    var day = currentDate.getDate().toString().padStart(2, '0');
    var hours = currentDate.getHours().toString().padStart(2, '0');
    var minutes = currentDate.getMinutes().toString().padStart(2, '0');
    var seconds = currentDate.getSeconds().toString().padStart(2, '0');

    var formattedDate = `${year}-${month}-${day}` + `${!truncated ? `-${hours}${minutes}-${seconds}` : ``}`;

    console.log("getting now(): " + formattedDate);
    return formattedDate;
}function loadShoppingList(response) {
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

    console.log('refreshing shopping list')
    let counter = document.getElementById('listCounter');
    let container = document.getElementById('listCardContainer');
    container.innerHTML = '';
    let list = JSON.parse(localStorage.getItem(key));
    counter.textContent = `${list.length}` // refresh the list counter count
    list.forEach(itemData => {
        let card = getListCardFrag(itemData["Product Description"], itemData["Cost"], itemData["Save"], itemData["Image"], itemData["quantity"] ? itemData["quantity"] : 1)
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
        default:
            console.log("Something's not right");
            return;
    }

    // Get the src attribute value of the sibling img
    const imgElement = parentCard.querySelector('img');
    const imgSrc = imgElement.getAttribute('src');
    let foundIndex = getLocalStorageItemMatch(imgSrc, lsProps.image, listKey) // hypothetically no blocks should have duplicate images, so for now I'm using the img src as a unique key for comparing ad items
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
                console.log('add quantity')
                quantityNode.textContent = quantity + 1;
                list[foundIndex].quantity = quantity + 1;
            } else {
                console.log('subtract quantity')
                quantityNode.textContent = quantity - 1;
                list[foundIndex].quantity = quantity - 1;
                if (quantity - 1 <= 0) {
                    setTimeout(() => { alterLocalStorage(actions.remove, target) }, 200);
                }
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
        let price = parseFloat(`${itemData["Cost"]}`.replace('$', ''));
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
    let parent = document.getElementById('weeklyadContainer')
    let div = document.createElement('div');
    div.className = 'listDropdown';
    parent.insertBefore(div, parent.firstChild);

    let shoppingList = getShoppingListFrag();
    div.append(shoppingList.content);
}

function setUpCardContainer() {
    const container = document.createElement('template');

    let fragment = `
        <div class="scrollContainer">
            <div id="listCardContainer">
            </div>
            <div id="listControls">
                <span id="scrollPrint" class="material-symbols-outlined print">print</span>
                <button id="totalButton"><p>Total:<span id="total">$0.00</span></p></button>
            </div>
        </div>`;

    container.innerHTML = fragment;
    document.body.append(container.content)
}

function getListCardFrag(title, price, save, img, quantity) {
    const listCard = document.createElement('template');
    let fragment = `
            <div><div class="listCard">
				<img src="${img}">
				<div class="cardTextContainer">
					<h2>${title}</h2>
					<p>${price}</p>
					<p>Save ${save}</p>
                    <span class="material-symbols-outlined button deleteButton ">delete</span>
                    <div class="quantityControls">
                        <span class="material-symbols-outlined quantityButton quantitySubtract">do_not_disturb_on</span>
                        <span class="quantity">${quantity}</span>
                        <span class="material-symbols-outlined quantityButton quantityAdd"> add_circle </span>
                    </div>
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
                <span class="material-symbols-outlined icon">list_alt</span>
                    <h1>View Shopping List</h1>
                    <span id="listCounter" class="button">0</span>
                </div>
                <span class="material-symbols-outlined print">print</span>
            </div>`;

    card.innerHTML = fragment;
    return card;
}