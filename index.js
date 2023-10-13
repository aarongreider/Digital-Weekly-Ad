import loadWeeklyAd from './adData_cards.js';
import loadShoppingList from './shoppingList.js';
import handleAnimations from './animations.js';

loadWeeklyAd().then(result => {
    console.log("cards loaded. loading shopping list");

    loadShoppingList(result).then(result2 => {
        console.log("shopping list loaded. loading animations")

        handleAnimations().then(result3 => {
            console.log("animations loaded")
        })
    })
})

