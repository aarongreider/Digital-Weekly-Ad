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
    })
    .catch(error => {
        // Handle errors here
        console.error('Fetch error:', error);
    });

    // add event listen to .info to toggle overlays

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
    let items = document.getElementsByClassName("info");

    for (let i = 0; i < response.data.length; i++) {
        let itemData = response.data[i];
        console.log(itemData["Product Description"])
        let overlay = getOverlayFrag(itemData["Product Description"], itemData["Cost"], itemData["Save"], itemData["Image"])
        items[i].append(overlay.content);
    }
}
