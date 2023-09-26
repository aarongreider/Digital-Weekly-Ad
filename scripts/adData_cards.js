function loadWeeklyAd() {
    return new Promise((resolve, reject) => {
        fetch('https://script.google.com/macros/s/AKfycbw-ZbsqEASuUT_pNWggkiHaeqUr20qI9xXfOT7g7WbvLZOuZpQMpF67_l4lMkxcmNRQaQ/exec')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then(response => {
                // Process the JSON data here
                console.log(response);
                jsonToCards(response)
                setAddButtonListeners(response);
                resolve(response)
            })
            .catch(error => {
                // Handle errors here
                console.error('Fetch error:', error);
                reject(error);
            });
    });
}



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

function jsonToCards(response) {
    
    let div = document.createElement('div');
    div.className = 'cardContainer';
    document.body.appendChild(div);

    response.data.forEach(item => {
        console.log(item["Product Description"])
        let card = getCardFrag(item["Product Description"], item["Cost"], item["Save"], item["Image"])
        div.append(card.content);
    });
}


function setAddButtonListeners(response) {
    /* LOCALSTORAGE */
    // add a click listener to every add to list button
    // the item's data is stored within the scope of the listener. 
    //localStorage.clear();
    if (localStorage.getItem(listKey) === null) {
        localStorage.setItem(listKey, '[]');
    }

    Array.from(document.getElementsByClassName('add')).forEach(function (button, i) {
        console.log("adding event listener to class items .add")
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