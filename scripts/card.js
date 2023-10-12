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
                        <p class="add">
                            <span class="material-symbols-outlined">add_circle</span>Add to List
                        </p>
                        <p class="seeMenuButton"><span class="material-symbols-outlined">read_more</span>See Related Items</p>
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
                    <p class="add">
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
                    <p class="add">
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