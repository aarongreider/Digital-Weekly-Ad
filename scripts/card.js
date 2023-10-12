function getCardFrag(brand, title, price, save, img, menu, id) {
    const card = document.createElement('template');
    console.log(menu)
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
                    </div>
                    <div class=""menuSpacer></div>
                </div>`;
            break;
        case 'menu':
            fragment = `
                <div class="card menu">
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