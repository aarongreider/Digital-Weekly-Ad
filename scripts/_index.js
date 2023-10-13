
let lsProps = {
    page: "PAGE",
    block: "BLOCK",
    section: "SECTION",
    brand: "BRAND NAME",
    description: "PRODUCT DESCRIPTION",
    category: "PRODUCT CATEGORY",
    price: "PRICE",
    size: "SIZE",
    unit: "UNIT",
    menu: "MENU",
    priceDisplay: "DISPLAY PRICE",
    save: "SAVE",
    additional: "ADDITIONAL TEXT",
    instructions: "INSTRUCTIONS",
    image: "IMG URL",
    id: "ID"
}
let listKey = 'shopping list';

let actions = {
    add: "add",
    remove: "remove",
    update: "update",
    check: "check"
}

loadWeeklyAd().then(result => {
    const style = 'color: grey;'
    console.log("%ccards loaded. loading shopping list", style);

    loadShoppingList(result).then(result2 => {
        console.log("%cshopping list loaded. loading animations", style)

        handleAnimations().then(result3 => {
            console.log("%canimations loaded", style)
        })
    })
})

