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
        })
        .catch(error => {
            // Handle errors here
            console.error('Fetch error:', error);
        });

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
