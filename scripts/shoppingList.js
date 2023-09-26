let listKey = 'shopping list';
function loadShoppingList(response) {
    return new Promise((resolve, reject) => {
        try {
            appendShoppingList();
            setShoppingListListener();
            refreshShoppingList(listKey)
            setPrintListener();
            resolve(true);
        } catch (error) {
            console.error("An error occurred:", error);
            reject(error);
        }
    });
}

function appendShoppingList() {
    //let parent = document.getElementById('weeklyadContainer')

    let div = document.createElement('div');
    div.className = 'listDropdown';
    document.body.insertBefore(div, document.body.firstChild);

    let shoppingList = getShoppingListFrag();
    div.append(shoppingList.content);


}

function setShoppingListListener() {
    /* LIST VIEW TOGGLE */
    document.querySelector(`.listDropdown > .header`).addEventListener('click', () => {
        console.log('toggle shopping list')
        document.querySelector(`#listCardContainer`).classList.toggle('showCards')
    })
}

function setPrintListener() {
    document.getElementById("print").addEventListener('click', () => {
        console.log("printing... or attempting to")
        window.print();
    })
}

function refreshShoppingList(key = 'shopping list') {
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

function getShoppingListFrag() {
    const card = document.createElement('template');
    let fragment = `
            <div class="header">
                <h1>Shopping List</h1>
                <h1 id="print">🖨️</h1>
                <h1>&darr;</h1>
            </div>
            <div class="scrollContainer">
                <div id="listCardContainer">
                </div>
            </div>`;

    card.innerHTML = fragment;
    return card;
}