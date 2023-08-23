let listKey = 'shopping list';
fetch('https://script.google.com/macros/s/AKfycbyKAzmaxBAnyrpyW9QTW_XKIWQdWPrjtpP92ANEMPKJd2Zbdpg15yaf7x49XJ-APUKXkA/exec')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
    })
    .then(response => {
        // Process the JSON data here
        console.log(response);
        jsonToBanners(response)
        jsonToOverlays(response);
        setOverlayListeners();
        refreshShoppingList(listKey)
        setShoppingListListeners(response);
        setPrintListener();
    })
    .catch(error => {
        // Handle errors here
        console.error('Fetch error:', error);
    });

function jsonToBanners(response) {
    // instead of creating a div, cycle through each item and append the banner to it
    let items = document.getElementsByClassName("item");

    for (let i = 0; i < response.data.length; i++) {
        let itemData = response.data[i];
        console.log(itemData["Product Description"])
        let banner = getBannerFrag(itemData["Product Description"], itemData["Cost"], itemData["Save"], itemData["Image"])
        items[i].append(banner.content);
    }
}

function jsonToOverlays(response) {
    // instead of creating a div, cycle through each item and append the banner to it
    //let items = document.getElementsByClassName("info");
    let container = document.getElementById('overlayContainer');

    for (let i = 0; i < response.data.length; i++) {
        let itemData = response.data[i];
        console.log(itemData["Product Description"])
        let overlay = getOverlayFrag(itemData["Product Description"], itemData["Cost"], itemData["Save"], itemData["Image"])
        container.append(overlay.content);
    }
}

function refreshShoppingList(key) {
    // scrap the current shopping list
    // iterate over localStorage object and reconstruct the shopping list widget
    
    console.log('refreshing shopping list')

    let container = document.getElementById('listCardContainer');
    container.innerHTML = '';
    let list = JSON.parse(localStorage.getItem(key));
    list.forEach(itemData => {
        let card = getListCardFrag(itemData["Product Description"], itemData["Cost"], itemData["Save"], itemData["Image"])
        container.append(card.content);
    });
    
}

// add event listen to .info to toggle overlays
function setOverlayListeners() {
    //set listeners on info buttons to open overlay
    let infoButtons = Array.from(document.getElementsByClassName('info'));
    infoButtons.forEach(function (button, i) {
        button.addEventListener('click', () => {
            console.log('info click')
            displayOverlay(i);
        });
    });

    //set listener to close overlays, (toggle off all objects with .overlayActive)
    document.getElementById('overlayContainer').addEventListener('click', () => {
        console.log('overlaycontainer click')
        Array.from(document.getElementsByClassName('overlayActive')).forEach(function (overlay) {
            overlay.classList.toggle('overlayActive');
        });
    })
}

function setShoppingListListeners(response) {
    /* LIST VIEW TOGGLE */
    document.querySelector(`.listDropdown > .header`).addEventListener('click', () => {
        console.log('toggle shopping list')
        document.querySelector(`#listCardContainer`).classList.toggle('showCards')
    })

    /* LOCALSTORAGE */
    // add a click listener to every add to list button
    // the item's data is stored within the scope of the listener. 
    //localStorage.clear();
    if (localStorage.getItem(listKey) === null) {
        localStorage.setItem(listKey, '[]');
    }
   
    Array.from(document.getElementsByClassName('add')).forEach(function (button, i) {
        button.addEventListener('click', () => {
            console.log('add to list click')

            let list = JSON.parse(localStorage.getItem(listKey))
            list.push(response.data[i])
            localStorage.setItem(listKey, JSON.stringify(list));
            
            console.log(JSON.parse(localStorage.getItem(listKey)))
            refreshShoppingList(listKey);
        });
    });
}

function getBannerFrag(title, price, save, img) {
    const banner = document.createElement('template');
    let fragment = `
            <div class="banner">
				<div class="buttonContainer">
					<p class="info">i</p>
					<p class="add">+</p>
				</div>
				<div class="description">
					<p>${title}</p>
				    <div class="triangle"></div>
                </div>
                
			</div>`;

    /* IMPORTANT
     * in the future use createDocumentFragment() instead of innerHTML to avoid potential XSS attacks :/
     * could also use DOMPurify api
     */
    banner.innerHTML = fragment;
    return banner;
}

function getOverlayFrag(title, price, save, img) {
    const overlay = document.createElement('template');
    let fragment = `
            <div class="overlay">
                <p class="backButton">&larr;</p>
                <img
                    src="${img}">
                <div class="cardTextContainer">
                    <h2>${title}</h2>
                    <p>${price}</p>
                    <p>Save ${save}</p>
                </div>
            </div>`;

    /* IMPORTANT
     * in the future use createDocumentFragment() instead of innerHTML to avoid potential XSS attacks :/
     * could also use DOMPurify api
     */
    overlay.innerHTML = fragment;
    return overlay;
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
				</div>
			<div></div>`;

    listCard.innerHTML = fragment;
    return listCard;
}

function displayOverlay(index) {
    let overlays = document.getElementsByClassName('overlay');
    let container = document.getElementById('overlayContainer');
    overlays[index].classList.toggle('overlayActive');
    container.classList.toggle('overlayActive');
}


function setPrintListener() {
    document.getElementById("print").addEventListener('click', () => {
        window.print();
    })
}