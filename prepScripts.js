let isReordering = false;

convertPercent();
removeIDs();
frag = new HtmlFrag();
console.log(frag.html);
//save(frag.html);

function HtmlFrag() {
    this.styles = `
        <style>
            .item {
                background: rgb(255, 255, 255, 0) !important;
                border-radius: 5px;
                border-color: rgb(0, 0, 0, .5) !important;
                border-width: 1px !important;
                border-style: solid !important;
            
                position:absolute;
            }
            
            .item:hover {
                box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.766), 2px 4px 19px rgba(0, 0, 0, 0.633);
                z-index: 1000;
            }
            
            .page {
                position: relative;
                height: 612px;
                width: 288px;
            }
            
            .active {
                background: rgb(110, 110, 110) !important;
            }
        </style>`;

    this.stylesheet = `
        <link href="indesignTest-14-web-resources/css/viewstyles_layout.css" rel="stylesheet" type="text/css" />
	    <link href="indesignTest-14-web-resources/css/viewstyles_card.css" rel="stylesheet" type="text/css" />`;

    this.script = `<script src="adData.js"></script>`;

    this.getItems = function () {
        let items = document.getElementsByClassName("item");
        let itemString = ``;
        for (let i = 0; i < items.length; i++) {
            //console.log(items[i].outerHTML)
            itemString += (items[i].outerHTML)
        }
        return itemString;
    };

    this.getPages = function () {
        let pages = document.getElementsByClassName("page");
        let pageString = ``;
        for (let i = 0; i < pages.length; i++) {
            pageString += (pages[i].outerHTML)
        }
        return pageString;
    };

    this.html = `<!DOCTYPE html>
           <html lang="en">
           <head>
               <meta charset="UTF-8">
               <meta name="viewport" content="width=device-width, initial-scale=1.0">
               <title>Document</title>
               ${this.stylesheet}
           </head>
           <body>
               ${this.getPages()}
               ${this.script}
           </body>
           </html>`;
}

function removeIDs() {
    let items = document.getElementsByClassName("item");
    let pages = document.getElementsByClassName("page");

    Array.from(items).forEach(item => {
        item.removeAttribute('id')
    });

    // get all .page and assign id page1, page2, page3...
    for (let i = 0; i < pages.length; i++) {
        pages[i].setAttribute('id', `page${i+1}`)
    }
}

function save(htmlContent) {
    const blob = new Blob([htmlContent], { type: "text/html" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "savetest.html";
    a.hidden = true;
    document.body.appendChild(a);
    a.click();
}

/* function save() {
    var htmlStr = document.getElementsByTagName('html')[0].innerHTML;
    console.log(htmlStr);

    var htmlContent = [htmlStr];
    var blob = new Blob(htmlContent, { type: "text/html" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "savetest.html";
    a.hidden = true;
    document.body.appendChild(a);
    a.click();
} */

function convertPercent() {
    //prompt user feedback
    let pageWidth = parseInt("286px"); /* `${prompt("What is the width of your page (in pixels)?")}px`; */
    let pageHeight = parseInt("610px");/* `${prompt("What is the height of your page (in pixels)?")}px`; */
    console.log(`page width: ${pageWidth}  |  page height: ${pageHeight}`)

    let children = document.querySelectorAll(".page > .item");
    children.forEach(child => {
        let computedStyle = getComputedStyle(child)
        let transformStr = computedStyle.transform;
        //console.log(transformStr);

        const values = transformStr.replace(/^matrix\(|\)$|\s/g, '').split(',');
        //console.log(values);

        let width = parseInt(computedStyle.width);
        let height = parseInt(computedStyle.height);

        child.style.transform = `none`;
        child.style.left = `${(values[4] / parseInt(pageWidth) * 100)}%`;
        child.style.top = `${(values[5] / parseInt(pageHeight) * 100)}%`;
        child.style.width = `${(width / parseInt(pageWidth) * 100)}%`;
        child.style.height = `${(height / parseInt(pageHeight) * 100)}%`;
        //console.log(`NEW left: ${child.style.left}  |  top: ${child.style.top}  |  width: ${child.style.width}  |  height: ${child.style.height}`);
    });

}

function startReordering() {
    // assign a couple separate event listeners to items so they can be selected
    // when the item is selected and isReordering is true, stash the outer html of the item element, delete the item element
    // then append the stashed html to the parent element (at the bottom)
    items = document.getElementsByClassName("item");
    itemsArray = [];
    isReordering = true;

    Array.from(items).forEach(item => {
        // add a listener to toggle the classlist for visual feedback when an item is selected
        item.addEventListener("click", (e) => {
            //itemsArray.push(e.target); // not necessary
            e.target.classList.toggle("active");

            // stash the outer html
            let stash = item;
            // get parent node
            let page = item.parentNode;
            // delete original element
            item.remove();
            // append stashed html
            page.appendChild(stash);
        });
    });
}

function reorderElements() {

    if (isReordering) {

        let pageContainer = document.getElementById(itemsArray[0].parentElement.id);
        let imgElement = document.querySelector(`#${itemsArray[0].parentElement.id} > div > img`);
        console.log(imgElement);

        let docFragment = document.createDocumentFragment();
        if (imgElement != null) docFragment.appendChild(imgElement);

        itemsArray.forEach(child => {
            docFragment.appendChild(child.cloneNode(true));
        });

        pageContainer.replaceChildren(docFragment);


        // refresh the cache of items so that they are selectable
        items = document.getElementsByClassName("item");
        Array.from(items).forEach(item => {
            if (item.classList.contains("active"))
                item.classList.toggle("active");
        });

    } else {
        console.log("nothing to reorder!")
    }
}