
let lsProps = {
    page: "PAGE",
    block: "BLOCK",
    section: "SECTION",
    brand: "BRAND NAME",
    description: "PRODUCT DESCRIPTION",
    category: "PRODUCT CATEGORY",
    price: "PRICE",
    size: "SIZE",
    unit: "UNIT",
    menu: "MENU",
    priceDisplay: "DISPLAY PRICE",
    save: "SAVE",
    additional: "ADDITIONAL TEXT",
    instructions: "INSTRUCTIONS",
    image: "IMG URL",
    id: "ID"
}
let listKey = 'shopping list';

let actions = {
    add: "add",
    remove: "remove",
    update: "update",
    check: "check"
}

loadWeeklyAd().then(result => {
    const style = 'color: grey;'
    console.log("%ccards loaded. loading shopping list", style);

    loadShoppingList(result).then(result2 => {
        console.log("%cshopping list loaded. loading animations", style)

        handleAnimations().then(result3 => {
            console.log("%canimations loaded", style)
        })
    })
})

function loadWeeklyAd() {
    return new Promise((resolve, reject) => {
        //fetch('https://script.google.com/macros/s/AKfycbw-ZbsqEASuUT_pNWggkiHaeqUr20qI9xXfOT7g7WbvLZOuZpQMpF67_l4lMkxcmNRQaQ/exec') // old one
        fetch('https://script.google.com/macros/s/AKfycbwo8bAdEp9koFVzqfPeh4Y7C4x4p-c-zHydPTxmtOuMhZCpRPQQ4kQQ2WtkQRAnaisa6w/exec')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then(response => {
                // Process the JSON data here
                response = response.data[0]["10-02-23"];
                let sections = groupByKey(lsProps.section, response)
                let categories = groupByKey(lsProps.category, response)

                let container = document.createElement('div');
                container.id = 'ad';
                document.body.appendChild(container);

                appendFilters();
                jsonToCards(sections);
                initializeFilters(sections, categories);
                initializeLocalStorage();
                setAddButtonListeners(sections);
                resolve(response);
            })
            .catch(error => {
                // Handle errors here
                console.error('Fetch error:', error);
                reject(error);
            });
    });
}
function checkIfAdded(item) {


}
function jsonToCards(groups /* , parent */) {

    let weeklyAdContainer = document.getElementById('weeklyadContainer')
    if (weeklyAdContainer) {
        weeklyAdContainer.remove();
    }

    let parent = document.createElement('div');
    parent.id = 'weeklyadContainer';
    document.getElementById('ad').appendChild(parent);

    //console.log("json => cards groups:")
    console.log(groups)
    for (const group in groups) {
        //console.log("  creating group " + group)

        let div = document.createElement('div');
        div.className = 'cardContainer';
        div.id = group;
        parent.appendChild(div);

        let h1 = document.createElement('h1');
        h1.className = 'sectionHeader';
        h1.textContent = group.toLowerCase();
        h1.style.textTransform = 'capitalize';
        div.prepend(h1);

        groups[group].forEach(item => {
            let card = getCardFrag(item[lsProps.brand], item[lsProps.description], item[lsProps.price], item[lsProps.additional], item[lsProps.image], item[lsProps.menu], item[lsProps.id])
            if (item[lsProps.menu] == 'menu') {
                const menuContainers = div.getElementsByClassName('menuItemContainer');
                menuContainers[menuContainers.length - 1].append(card.content);
            } else {
                div.append(card.content);
            }
        })
    };
}

function groupByKey(key, response) {
    // take in the json response and return an object containing each section as an array of items in that section
    // Assuming your data is in an array of objects
    //console.log(key)
    // Initialize an empty object to store the grouped data
    const groupedData = {};

    // Loop through the data and group by the "SECTION" column
    response.forEach(item => {

        const group = item[`${key}`];

        // If the section doesn't exist in the groupedData object, create it
        if (!groupedData[group]) {
            groupedData[group] = [];
        }

        // Add the item to the corresponding section
        groupedData[group].push(item);
    });

    // Now, groupedData contains your data grouped by sections
    return groupedData;

}

function setAddButtonListeners(response) {
    // response should be an array of objects, not an object with an array of objects. 
    //console.log("add button parameters: ");
    //console.log(response);

    // flatten the response first so we dont have to mess with getting keys
    const flattenedArray = [];
    for (const key in response) {
        if (Array.isArray(response[key])) {
            flattenedArray.push(...response[key]);
        }
    }
    // add a click listener to every add to list button
    // the item's data is stored within the scope of the listener.
    Array.from(document.getElementsByClassName('add')).forEach(function (button, i) {
        /*  console.log(".add listener")
         console.log(response[i]) */
        // check if button is already added to list
        if (alterLocalStorage(actions.check, button)) {
            button.innerHTML = `<span class="material-symbols-outlined">check_circle</span>`;
            button.style.padding = '1px'
        }
        button.addEventListener('click', (event) => {
            console.log('add to list click')
            console.log(flattenedArray[i])
            alterLocalStorage(actions.add, event.target, flattenedArray[i]);
            button.innerHTML = `<span class="material-symbols-outlined">check_circle</span>`;
            button.style.padding = '1px'
        });
    });

    setMenuItemListeners();
}

function setMenuItemListeners() {
    Array.from(document.getElementsByClassName('seeMenuButton')).forEach(function (button) {
        button.addEventListener('click', (event) => {
            button.parentNode.parentNode.querySelector('.menuItemContainer').classList.toggle("flex");
            setTimeout(() => {
                if (checkViewportPercent(button, 0.8)) {
                    /* const id = 'profilePhoto';
                    const yOffset = -10;
                    const y = button.getBoundingClientRect().top + window.scrollTop + yOffset;
                    console.log(y)

                    window.scrollTo({ top: y, behavior: 'smooth' }); */
                    button.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
            }, 200)
        });

    });
}

function checkViewportPercent(element, threshold) {
    // Calculate the element's position relative to the viewport
    const elementRect = element.getBoundingClientRect();

    // Calculate the height of the viewport
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    // Calculate the position of the element's bottom edge relative to the viewport
    const elementBottom = elementRect.top + elementRect.height;

    // Calculate the threshold for the bottom 20% of the viewport
    const thresholdVP = viewportHeight * threshold;

    // Check if the element's bottom edge is within the bottom 20% of the viewport
    if (elementBottom >= thresholdVP) {
        console.log('The element is in the bottom 20% of the viewport.');
        return true;
    } else {
        console.log('The element is not in the bottom 20% of the viewport.');
        return false;
    }
}

function initializeLocalStorage() {
    //localStorage.clear();
    if (localStorage.getItem(listKey) === null) {
        localStorage.setItem(listKey, '[]');
    }
}



/* FILTERING */
/* FILTERING */
/* FILTERING */

function initializeFilters(sections, categories) {
    let sectionDropdown = document.getElementById('sectionDropdown')
    let categoryDropdown = document.getElementById('categoryDropdown')

    sectionDropdown.addEventListener('change', () => {
        console.log("section change " + sectionDropdown.value)
        if (sectionDropdown.value == 'All') {
            jsonToCards(sections)
            setAddButtonListeners(sections)
        } else {
            jsonToCards({ [`${sectionDropdown.value}`]: sections[`${sectionDropdown.value}`] })
            setAddButtonListeners({ [`${sectionDropdown.value}`]: sections[`${sectionDropdown.value}`] })
        }
    })
    categoryDropdown.addEventListener('change', () => {
        console.log("category change " + categoryDropdown.value)
        if (categoryDropdown.value == 'All') {
            jsonToCards(categories)
            setAddButtonListeners(categories)
        } else {
            jsonToCards({ [`${categoryDropdown.value}`]: categories[`${categoryDropdown.value}`] })
            setAddButtonListeners({ [`${categoryDropdown.value}`]: categories[`${categoryDropdown.value}`] })
        }
    })

    populateFilters(sections, categories)
}

function populateFilters(sections, categories) {
    for (const section in sections) {
        //console.log(section)

        const option = document.createElement('option');
        option.value = section;
        option.text = section;
        sectionDropdown.appendChild(option);
    }

    for (const category in categories) {
        //console.log(category)

        const option = document.createElement('option');
        option.value = category;
        option.text = category;
        categoryDropdown.appendChild(option);
    }
}

function appendFilters() {
    let div = document.createElement('div');
    div.id = 'filterControls';
    document.getElementById('ad').append(div);

    const card = document.createElement('template');

    let fragment = `
        <div id="filterControls">
            <label for="sectionDropdown">Filter Section</label>
            <select id="sectionDropdown" class="filterButton">
                <option value="All" selected="selected">All Sections</option>
            </select>

            <label for="categoryDropdown">Filter Category</label>
            <select id="categoryDropdown" class="filterButton">
                <option value="All" selected="selected">All Categories</option>
            </select>
        </div>`
    card.innerHTML = fragment;
    div.append(card.content);
}

function handleAnimations() {
    return new Promise((resolve, reject) => {
        try {
            //Sortable.mount(new AutoScroll());
            let listCardContainer = document.getElementById('listCardContainer')
            let scrollContainer = document.getElementsByClassName('scrollContainer')[0]
            
            new Sortable(listCardContainer, {
                animation: 300,
                ghostClass: 'ghost',
                delay: 100,
                delayOnTouchOnly: true,
                handle: '.dragIcon',
                /* forceFallback: true, */
                scroll: false,
                //scrollSensitivity: 30,
                //bubbleScroll: false,
                /* scrollFn: function (offsetX, offsetY, originalEvent, touchEvt, hoverTargetEl) {
                    if (touchEvt.srcElement.classList.contains('listCard')) {
                        scrollContainer.scrollTop += offsetY*10
                        touchEvt.srcElement
                        //console.log(offsetY)
                        //.log(originalEvent.srcElement.outerHTML)
                        //console.log(hoverTargetEl)
                        //console.log(touchEvt.srcElement)
                    }


                }, */
                
            });

            resolve(true);
        } catch (error) {
            console.error("An error occurred:", error);
            reject(error);
        }
    });
}

function getCardFrag(brand, title, price, save, img, menu, id) {
    const card = document.createElement('template');
    let fragment;
    switch (menu) {
        case 'parent':
            fragment = `
                <div class="menuContainer">
                    <div class="card menuParent">
                        <id-element data-id="${id}"></id-element>
                        <img src="${img}">
                        <div class="cardTextContainer">
                            <p>${brand}</p>
                            <h2>${title}</h2>
                            <p>${price}</p>
                        </div>
                        <p class="buttonInline add lower">
                            <span class="material-symbols-outlined">add_circle</span>Add to List
                        </p>
                        <p class="buttonInline seeMenuButton">
                            <span class="material-symbols-outlined">read_more</span>See Related Items
                        </p>
                    </div>
                    <div class="menuItemContainer">
                        <div class="menuSpacer"></div>
                    </div>
                </div>`;
            break;
        case 'menu':
            fragment = `
                <div class="card menuItem">
                    <id-element data-id="${id}"></id-element>
                    <div class="cardTextContainer">
                        <p>${brand}</p>
                        <h2>${title}</h2>
                        <p>${price}</p>
                    </div>
                    <p class="buttonInline add">
                        <span class="material-symbols-outlined">add_circle</span>Add to List
                    </p>
                </div>`;
            break;
        default:
            fragment = `
                <div class="card">
                    <id-element data-id="${id}"></id-element>
                    <img src="${img}">
                    <div class="cardTextContainer">
                        <p>${brand}</p>
                        <h2>${title}</h2>
                        <p>${price}</p>
                    </div>
                    <p class="buttonInline add">
                        <span class="material-symbols-outlined">add_circle</span>Add to List
                    </p>
                </div>`;
            break;
    }



    card.innerHTML = fragment;
    return card;
}

function imgURL() {
    return `https://random.imagecdn.app/500/${Math.floor(Math.random() * (551 - 450 + 1)) + 450}`
}


function getListCardFrag(title, price, save, img, quantity, menu, id) {
    const listCard = document.createElement('template');
    let fragment = `
            <div><div class="listCard">
                <id-element data-id="${id}"></id-element>
                <img src="${img}">
				<div class="cardTextContainer">
					<h2>${title}</h2>
					<p>${price}</p>
                    <span class="material-symbols-outlined button deleteButton ">delete</span>
                    <div class="quantityControls">
                        <span class="material-symbols-outlined quantityButton quantitySubtract">do_not_disturb_on</span>
                        <span class="quantity">${quantity}</span>
                        <span class="material-symbols-outlined quantityButton quantityAdd"> add_circle </span>
                    </div>
				</div>
                <span class="material-symbols-outlined dragIcon">drag_indicator</span>
			<div><div>`;

    listCard.innerHTML = fragment;
    return listCard;
}

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
    let items = [`.listDropdown > .toolBar`, `.scrollContainer`]
    items.forEach(item => {
        document.querySelector(item).addEventListener('click', (event) => {

            if (event.target.classList.contains('scrollContainer') ||
                event.target === document.querySelector(".header") ||
                event.target === document.querySelector(".header > h1") ||
                event.target === document.querySelector(".header > img")) {
                //console.log('toggle shopping list')
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
    document.getElementById('ad').append(div)

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
                <p id="totalButton">Total:<span id="total">$0.00</span></p>
            </div>
        </div>`;

    container.innerHTML = fragment;
    document.getElementById('ad').prepend(container.content)
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

