function getCardFrag(brand, title, price, priceDisplay, save, img, menu, id, size, unit, badges, additional) {
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

    fragment = `<div class="${cardClassList}">
                    <id-element data-id="${id}"></id-element>
                    ${menu != 'menu' ? `<img src="${img}">` : ''}
                    ${getBadgeWidget(badges)}
                    ${getSaveWidget(save)}
                    ${getCardTextContainerWidget(brand, title, price, priceDisplay, size, unit)}
                    ${getButtonWidget(menu)}
                    ${additional ? `<p class="additionalText">${additional}</p>` : ``}
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
    size = size.replace(/[^0-9.-]/g, '') // format size to exclude unit
    return `<div class="cardTextContainer">
        <h3>${brand}</h3>
        <h2>${title}</h2>
        ${priceDisplay == "NORMAL" ? `<p class="unit">${size} ${unit}</p>` : ''}
        ${getPriceWidget(price.toString(), priceDisplay, unit)}
    </div>`
}

function getSaveWidget(save) {
    if (save) {
        return `
            <div class="save">
                <div class="star">
                </div>
                <p><span>SAVE</span><br>$${typeof save === "number" ? Number.isInteger(save) ? save : save.toFixed(2) : save}</p>
            </div>`
    }
    return '';
}

function getBadgeWidget(badges) {
    let badgeImgs = ``;
    if (badges) {
        //console.log(badges);
        badges = JSON.parse(badges)

        badges.forEach(badge => {
            //console.log(badge)
            switch (badge) {
                case "JJ Badge":
                    badgeImgs = badgeImgs + `<img class="badge" src="https://aaron.greider.org/Digital-Weekly-Ad/images/badges/JJBadge.png">`;
                    break;
                case "Amish":
                    badgeImgs = badgeImgs + `<img class="badge" src="https://aaron.greider.org/Digital-Weekly-Ad/images/badges/Amish.png">`;
                    break;
                case "Ohio Proud":
                    badgeImgs = badgeImgs + `<img class="badge" src="https://aaron.greider.org/Digital-Weekly-Ad/images/badges/OhioProud.png">`;
                    break;
                case "Organic":
                    badgeImgs = badgeImgs + `<img class="badge" src="https://aaron.greider.org/Digital-Weekly-Ad/images/badges/OrganicSeal.png">`;
                    break;
                case "Non GMO":
                    badgeImgs = badgeImgs + `<img class="badge" src="https://aaron.greider.org/Digital-Weekly-Ad/images/badges/NonGMO.png">`;
                    break;
                case "USDA Select":
                    badgeImgs = badgeImgs + `<img class="badge" src="https://aaron.greider.org/Digital-Weekly-Ad/images/badges/USDASelect.png">`;
                    break;
                case "USDA Choice":
                    badgeImgs = badgeImgs + `<img class="badge" src="https://aaron.greider.org/Digital-Weekly-Ad/images/badges/USDAChoice.png">`;
                    break;
                case "USDA Prime":
                    badgeImgs = badgeImgs + `<img class="badge" src="https://aaron.greider.org/Digital-Weekly-Ad/images/badges/USDAPrime.png">`;
                    break;
                /* case "Mix & Match!":
                    badgeImgs = badgeImgs + `<img src="https://aaron.greider.org/Digital-Weekly-Ad/images/badges/MixMatch.png">`;
                    break; */
                default:
                    break;
            }
        })
    }
    return `<div class="badgeContainer">${badgeImgs}</div>`
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

    let formattedString, specialAmnt;
    if (priceDisplay == "SPECIALTY") {
        // splice out any characters preceding the dollar sign ad save them to a new variable called amount. Use regex to splice out / and For in the string
        let indexOfDivider = price.indexOf("/");
        specialAmnt = price.slice(0, indexOfDivider);
        price = price.slice(indexOfDivider + 1, price.length)
    }

    // removes anything that is not a number or a '.'
    formattedString = price.replace(/[^0-9.]/g, '');

    // Parse the numeric string into a floating-point number (e.g., 13.99)
    const floatValue = parseFloat(formattedString);

    // Convert the float value into dollars and cents as integers
    const dollars = Math.floor(floatValue);
    const cents = Math.round((floatValue - dollars) * 100);

    let belowOne = dollars < 1.0;
    let isFree = dollars == 0 && cents == 0;
    let hasPercent = price.includes("%")

    let fragment;
    if (isFree) {
        fragment = `
            <div class="priceContainer"}>
                <p class="free">FREE</p>
            </div>`
    } else if (hasPercent) {
        fragment = `
            <div class="priceContainer"}>
                <p class="percentOff">${price}</p>
            </div>`

    } else {
        fragment = `
                <div class="priceContainer">
                    ${specialAmnt ? `<div class="specialtyAmnt" ${specialAmnt > 9 ? `style="margin-right: 7px; text-align: right; font-size: 21px;"` : ``}><p><span>${specialAmnt}</span><br>FOR</p></div>` : ``}
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

