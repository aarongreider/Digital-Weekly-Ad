localStorage.clear()

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
        setShoppingListListeners(response);
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
    // add a click listener to every add to list button
    // the item's data is stored within the scope of the listener. 
    Array.from(document.getElementsByClassName('add')).forEach(function (button, i) {
        button.addEventListener('click', () => {
            console.log('add to list click')
            localStorage.setItem(response.data[i]["Block #"], response.data[i])
            console.log((response.data[i]))
            console.log(localStorage.getItem(response.data[i]["Block #"]))
            console.log(localStorage.getItem(2))
            refreshShoppingList();
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

function displayOverlay(index) {
    let overlays = document.getElementsByClassName('overlay');
    let container = document.getElementById('overlayContainer');
    overlays[index].classList.toggle('overlayActive');
    container.classList.toggle('overlayActive');
}

function refreshShoppingList() {
    // scrap the current shopping list
    // iterate over localStorage and reconstruct the shopping list widget

    // OR store a object containing the data for the shopping list in a single localstorage entry under the key "shopping list"
    console.log('refreshing shopping list')
    for(let i = 0; i < localStorage.length; i++) {
        localStorage.getItem(i)
    }
}