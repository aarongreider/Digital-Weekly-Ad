function loadWeeklyAd() {
    return new Promise((resolve, reject) => {
        //fetch('https://script.google.com/macros/s/AKfycbw-ZbsqEASuUT_pNWggkiHaeqUr20qI9xXfOT7g7WbvLZOuZpQMpF67_l4lMkxcmNRQaQ/exec') // old one
        fetch('https://script.google.com/macros/s/AKfycbwo8bAdEp9koFVzqfPeh4Y7C4x4p-c-zHydPTxmtOuMhZCpRPQQ4kQQ2WtkQRAnaisa6w/exec')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then(response => {
                // Process the JSON data here
                console.log(response);
                jsonToCards(response);
                initializeLocalStorage();
                setAddButtonListeners(response);
                resolve(response);
            })
            .catch(error => {
                // Handle errors here
                console.error('Fetch error:', error);
                reject(error);
            });
    });
}

function jsonToCards(response) {
    let parent = document.createElement('div');
    parent.id = 'weeklyadContainer';
    document.body.appendChild(parent);

    let div = document.createElement('div');
    div.className = 'cardContainer';
    parent.appendChild(div);

    response.data[0]["10-02-23"].forEach(item => {
        //console.log(item["Product Description"])
        let card = getCardFrag(item[lsProps.brand], item[lsProps.description], item[lsProps.price], item[lsProps.additional], item[lsProps.image])
        div.append(card.content);
    });
    //response.data[1]["Cost"]
    //response.data["10-02-23"][1]["Cost"]
}

function setAddButtonListeners(response) {
    // add a click listener to every add to list button
    // the item's data is stored within the scope of the listener.
    Array.from(document.getElementsByClassName('add')).forEach(function (button, i) {
        console.log("adding event listener to class items .add")
        button.addEventListener('click', (event) => {
            console.log('add to list click')
            //addToList(event.target, response.data[i]);
            alterLocalStorage(actions.add, event.target, response.data[i]);
        });
    });
}

function initializeLocalStorage() {
    //localStorage.clear();
    if (localStorage.getItem(listKey) === null) {
        localStorage.setItem(listKey, '[]');
    }
}