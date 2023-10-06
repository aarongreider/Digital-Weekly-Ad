function getCardFrag(title, price, save, img) {
    const card = document.createElement('template');
    let fragment = `
            <div class="card">
                <img
                    src="${img}">
                <div class="cardTextContainer">
                    <h2>${title}</h2>
                    <p>${price}</p>
                    <p>Save ${save}</p>
                </div>
                <p class="add">+ Add to List</p>
            </div>`;

    card.innerHTML = fragment;
    return card;
}