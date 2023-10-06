function getCardFrag(brand, title, price, save, img) {
    const card = document.createElement('template');
    let fragment = `
            <div class="card">
                <img
                    src="${imgURL()}">
                <div class="cardTextContainer">
                    <p>${brand}</p>
                    <h2>${title}</h2>
                    <p>${price}</p>
                </div>
                <p class="add">+ Add to List</p>
            </div>`;

    card.innerHTML = fragment;
    return card;
}

function imgURL() {
    return `https://random.imagecdn.app/500/${Math.floor(Math.random() * (551 - 450 + 1)) + 450}`
}