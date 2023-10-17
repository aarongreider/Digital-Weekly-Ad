function getCardFrag(brand, title, price, priceDisplay, save, img, menu, id, size, unit, badges) {
    const card = document.createElement('template');
    let fragment, cardClassList;

    switch (menu) {
        case 'parent':
            cardClassList = `card menuParent`;
            break;
        case 'menu':
            cardClassList = `card menuItem`;
            break;
        default:
            cardClassList = `card`;
            break;
    }
    let badgeImgs = '';
    console.log(badges);
    if (badges) {
        //console.log(badges);
        badges = JSON.parse(badges)
        
        badges.forEach(badge => {
            //console.log(badge)
            switch (badge) {
                case "JJ Badge": `${badgeImgs}<img src="https://aaron.greider.org/Digital-Weekly-Ad/images/badges/JJBadge.png">`; console.log(badge);
                    break;
                case "Amish":
                    break;
                case "Ohio Proud":
                    break;
                case "Organic":
                    break;
                case "Non GMO":
                    break;
                case "USDA Choice":
                    break;
                case "USDA Prime":
                    break;
                case "Mix & Match!":
                    break;
                default:
                    break;
            }
        })
    }
    fragment = `<div class="${cardClassList}">
                    <id-element data-id="${id}"></id-element>
                    ${menu != 'menu' ? `<img src="${img}">` : ''}
                    <div class="badgeContainer">${badgeImgs}</div>
                    ${getCardTextContainerWidget(brand, title, price, priceDisplay, size, unit)}
                    ${getButtonWidget(menu)}
                </div>`

    if (menu == 'parent') {
        fragment = `<div class="menuContainer">
                        ${fragment}
                    <div class="menuItemContainer">
                        <div class="menuSpacer"></div>
                        </div>
                    </div>`
    }

    card.innerHTML = fragment;
    return card;
}

function getCardTextContainerWidget(brand, title, price, priceDisplay, size, unit) {
    return `<div class="cardTextContainer">
        <h3>${brand}</h3>
        <h2>${title}</h2>
        ${priceDisplay == "NORMAL" ? `<p class="unit">${size} ${unit}</p>` : ''}
        ${getPriceWidget(price.toString(), priceDisplay, unit)}
    </div>`
}

function getButtonWidget(menu) {
    let fragment;
    switch (menu) {
        case 'parent':
            fragment = `<p class="buttonInline add lower">
                            <span class="material-symbols-outlined">add_circle</span>Add to List
                        </p>
                        <p class="buttonInline seeMenuButton">
                            <span class="material-symbols-outlined">read_more</span>See Related Items
                        </p>`;
            break;
        case 'menu':
            fragment = `<p class="buttonInline add">
                            <span class="material-symbols-outlined">add_circle</span>Add to List
                        </p>`;
            break;
        default:
            fragment = `<p class="buttonInline add">
                            <span class="material-symbols-outlined">add_circle</span>Add to List
                        </p>`;
            break;
    }
    return fragment;
}

function getPriceWidget(price, priceDisplay, unit) {
    // keeps anything that is non numeric or a '.'
    const numericString = price.replace(/[^0-9.]/g, '');

    // Parse the numeric string into a floating-point number (e.g., 13.99)
    const floatValue = parseFloat(numericString);

    // Convert the float value into dollars and cents as integers
    const dollars = Math.floor(floatValue);
    const cents = Math.round((floatValue - dollars) * 100);

    let belowOne = dollars < 1.0;
    let isFree = dollars == 0 && cents == 0;

    let fragment;
    if (isFree) {
        fragment = `
            <div class="priceContainer"}>
                <p class="free">FREE</p>
            </div>`
    } else {
        fragment = `
            <div class="priceContainer"}>
                ${belowOne ? '' : '<sup style="margin-top: .25em;">$</sup>'}
                <p class="dollar">${belowOne ? cents : dollars}</p>
                <div>
                    ${!belowOne && cents != 0 ? `<sup>${cents}</sup>` : ''}
                    ${belowOne ? '<sup>¢</sup>' : ''}
                    ${priceDisplay == "BY WEIGHT" ? `<p class="unit" style="margin: 0 4px;">${unit}</p>` : ''}
                </div>
            </div>`
    }
    return fragment;
}

function imgURL() {
    return `https://random.imagecdn.app/500/${Math.floor(Math.random() * (551 - 450 + 1)) + 450}`
}


function getListCardFrag(title, price, save, img, quantity, menu, id) {
    const listCard = document.createElement('template');
    let fragment = `
            <div><div class="listCard">
                <id-element data-id="${id}"></id-element>
                ${menu != 'menu' ? `<img src="${img}">` : ''}
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

