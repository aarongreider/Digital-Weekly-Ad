let isReordering = false;

let page = document.querySelector(`.page`);
const pageDims = {
    height: page.offsetHeight,
    width: page.offsetWidth
}

convertPercent();
removeIDs();

function HtmlFrag() {

    this.stylesheet = `
        <link href="indesignTest-14-web-resources/css/viewstyles_layout.css" rel="stylesheet" type="text/css" />
	    <link href="indesignTest-14-web-resources/css/viewstyles_banners.css" rel="stylesheet" type="text/css" />`;

    this.script = `<script src="adData.js"></script>`;

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
               <title>Weekly Ad ${now(true)}</title>
               ${this.stylesheet}
           </head>
           <body>
               ${this.getPages()}
               ${this.script}
           </body>
           </html>`;
}

function save(htmlContent) {
    const blob = new Blob([htmlContent], { type: "text/html" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ad_${now()}.html`;
    a.hidden = true;
    document.body.appendChild(a);
    a.click();

    console.log(`saving html file as ${a.download}`)
}

function removeIDs() {
    let items = document.getElementsByClassName("item");
    let pages = document.getElementsByClassName("page");
    let img = document.querySelector('.page > div > img')

    Array.from(items).forEach(item => {
        item.removeAttribute('id')
    });

    img.parentNode.removeAttribute('id');
    img.parentNode.removeAttribute('class');
    img.removeAttribute('class');

    // get all .page and assign id page1, page2, page3...
    for (let i = 0; i < pages.length; i++) {
        pages[i].setAttribute('id', `page${i + 1}`)
    }

    console.log("removed id's")
}

function convertPercent() {
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
        child.style.left = `${(values[4] / parseInt(pageDims.width) * 100)}%`;
        child.style.top = `${(values[5] / parseInt(pageDims.height) * 100)}%`;
        child.style.width = `${(width / parseInt(pageDims.width) * 100)}%`;
        child.style.height = `${(height / parseInt(pageDims.height) * 100)}%`;
        //console.log(`NEW left: ${child.style.left}  |  top: ${child.style.top}  |  width: ${child.style.width}  |  height: ${child.style.height}`);
    });
    console.log("converted percents")

}

function startReordering() {
    // assign a couple separate event listeners to items so they can be selected
    // when the item is selected and isReordering is true, stash the outer html of the item element, delete the item element
    // then append the stashed html to the parent element (at the bottom)
    items = document.getElementsByClassName("item");
    isReordering = true;

    Array.from(items).forEach(item => {
        // add a listener to toggle the classlist for visual feedback when an item is selected
        item.addEventListener("click", (e) => {
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
    console.log(`starting reordering`)
}

function confirmReorder() {

    if (isReordering) {
        // refresh the cache of items so that they are selectable
        let items = document.getElementsByClassName("item");
        Array.from(items).forEach(item => {
            if (item.classList.contains("active"))
                item.classList.toggle("active");
        });
        console.log(`reorder confirmed`)

    } else {
        console.log("nothing to reorder!")
    }
}

function now(truncated = false) {
    var currentDate = new Date();

    var year = currentDate.getFullYear();
    var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    var day = currentDate.getDate().toString().padStart(2, '0');
    var hours = currentDate.getHours().toString().padStart(2, '0');
    var minutes = currentDate.getMinutes().toString().padStart(2, '0');
    var seconds = currentDate.getSeconds().toString().padStart(2, '0');

    var formattedDate = `${year}-${month}-${day}` + `${!truncated ? ` ${hours}${minutes}-${seconds}`:``}`;

    console.log("getting now(): " + formattedDate);
    return formattedDate;
}