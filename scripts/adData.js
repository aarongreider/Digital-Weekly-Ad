function loadWeeklyAd() {
    return new Promise((resolve, reject) => {
        //fetch('https://script.google.com/macros/s/AKfycbwo8bAdEp9koFVzqfPeh4Y7C4x4p-c-zHydPTxmtOuMhZCpRPQQ4kQQ2WtkQRAnaisa6w/exec')
        fetch('https://aaron.greider.org/Digital-Weekly-Ad/json/231002-3_ad.json')

            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then(response => {
                // Process the JSON data here
                console.log(response)
                response = response.data[0]["10-02-23"];
                let sections = groupByKey(lsProps.section, response)
                let categories = groupByKey(lsProps.category, response)

                let container = document.createElement('div');
                container.id = 'ad';
                document.body.appendChild(container);

                appendFilters();
                
                
                resizeSelect(document.getElementById('sectionDropdown'), document.getElementById(`copycatSection`))
                resizeSelect(document.getElementById('categoryDropdown'), document.getElementById(`copycatCategory`))

                jsonToCards(sections);
                initializeFilters(sections, categories);
                initializeLocalStorage();
                setAddButtonListeners(sections);
                resolve(response);
            })
            .catch(error => {
                // Handle errors here
                console.error('Fetch error:', error);
                reject(error);
            });
    });
}

function jsonToCards(groups /* , parent */) {

    let weeklyAdContainer = document.getElementById('weeklyadContainer')
    if (weeklyAdContainer) {
        weeklyAdContainer.remove();
    }

    let parent = document.createElement('div');
    parent.id = 'weeklyadContainer';
    document.getElementById('ad').appendChild(parent);

    //console.log("json => cards groups:")
    console.log(groups)
    for (const group in groups) {
        //console.log("  creating group " + group)

        let div = document.createElement('div');
        div.className = 'cardContainer';
        div.id = group;
        parent.appendChild(div);

        const sectionHead = document.createElement('template');
        let sectionFrag = `
                <div class="bannerContainer">
                        <h2 class="tagline" style="text-transform: capitalize;">${groups[group][0][lsProps.tagline]}</h2>
                        <div class="bannerBack left"></div>
                        <div class="bannerBack right"></div>
                    </div>
                <div class="sectionHeadContainer">
                    <h1 class="sectionHeader" style="text-transform: capitalize;">${group.toLowerCase()}</h1>
                </div>`
        sectionHead.innerHTML = sectionFrag;
        div.prepend(sectionHead.content)

        /* let h2 = document.createElement('h2');
        h2.className = 'tagline';
        h2.textContent = groups[group][0][lsProps.tagline];
        h2.style.textTransform = 'capitalize';
        div.prepend(h2);

        let h1 = document.createElement('h1');
        h1.className = 'sectionHeader';
        h1.textContent = group.toLowerCase();
        h1.style.textTransform = 'capitalize';
        div.prepend(h1); */

        groups[group].forEach(item => {
            let card = getCardFrag(item[lsProps.brand], item[lsProps.description], item[lsProps.price], item[lsProps.priceDisplay], item[lsProps.save], item[lsProps.image], item[lsProps.menu], item[lsProps.id], item[lsProps.size], item[lsProps.unit], item[lsProps.badges], item[lsProps.additional])
            if (item[lsProps.menu] == 'menu') {
                const menuContainers = div.getElementsByClassName('menuItemContainer');
                menuContainers[menuContainers.length - 1].append(card.content);
            } else {
                div.append(card.content);
            }
        })
    };
}

function groupByKey(key, response) {
    // take in the json response and return an object containing each section as an array of items in that section
    // Assuming your data is in an array of objects
    //console.log(key)
    // Initialize an empty object to store the grouped data
    const groupedData = {};

    // Loop through the data and group by the "SECTION" column
    response.forEach(item => {

        const group = item[`${key}`];

        // If the section doesn't exist in the groupedData object, create it
        if (!groupedData[group]) {
            groupedData[group] = [];
        }

        // Add the item to the corresponding section
        groupedData[group].push(item);
    });

    // Now, groupedData contains your data grouped by sections
    return groupedData;

}

function setAddButtonListeners(response) {
    // response should be an array of objects, not an object with an array of objects. 
    //console.log("add button parameters: ");
    //console.log(response);

    // flatten the response first so we dont have to mess with getting keys
    const flattenedArray = [];
    for (const key in response) {
        if (Array.isArray(response[key])) {
            flattenedArray.push(...response[key]);
        }
    }
    // add a click listener to every add to list button
    // the item's data is stored within the scope of the listener.
    Array.from(document.getElementsByClassName('add')).forEach(function (button, i) {
        /*  console.log(".add listener")
         console.log(response[i]) */
        // check if button is already added to list
        if (alterLocalStorage(actions.check, button)) {
            button.innerHTML = `<span class="material-symbols-outlined">check_circle</span>`;
            button.style.padding = '1px'
        }
        button.addEventListener('click', (event) => {
            console.log('add to list click')
            console.log(flattenedArray[i])
            alterLocalStorage(actions.add, event.target, flattenedArray[i]);
            button.innerHTML = `<span class="material-symbols-outlined">check_circle</span>`;
            button.style.padding = '1px'
        });
    });

    setMenuItemListeners();
}

function setMenuItemListeners() {
    Array.from(document.getElementsByClassName('seeMenuButton')).forEach(function (button) {
        button.addEventListener('click', (event) => {
            button.parentNode.parentNode.querySelector('.menuItemContainer').classList.toggle("flex");
            setTimeout(() => {
                if (checkViewportPercent(button, 0.8)) {
                    /* const id = 'profilePhoto';
                    const yOffset = -10;
                    const y = button.getBoundingClientRect().top + window.scrollTop + yOffset;
                    console.log(y)

                    window.scrollTo({ top: y, behavior: 'smooth' }); */
                    button.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
            }, 200)
        });

    });
}

function checkViewportPercent(element, threshold) {
    // Calculate the element's position relative to the viewport
    const elementRect = element.getBoundingClientRect();

    // Calculate the height of the viewport
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    // Calculate the position of the element's bottom edge relative to the viewport
    const elementBottom = elementRect.top + elementRect.height;

    // Calculate the threshold for the bottom 20% of the viewport
    const thresholdVP = viewportHeight * threshold;

    // Check if the element's bottom edge is within the bottom 20% of the viewport
    if (elementBottom >= thresholdVP) {
        //console.log('The element is in the bottom 20% of the viewport.');
        return true;
    } else {
        //console.log('The element is not in the bottom 20% of the viewport.');
        return false;
    }
}

function initializeLocalStorage() {
    //localStorage.clear();
    if (localStorage.getItem(listKey) === null) {
        localStorage.setItem(listKey, '[]');
    }
}



/* FILTERING */
/* FILTERING */
/* FILTERING */

function initializeFilters(sections, categories) {
    let sectionDropdown = document.getElementById('sectionDropdown')
    let categoryDropdown = document.getElementById('categoryDropdown')

    sectionDropdown.addEventListener('change', () => {
        shuffleCards("Section", sectionDropdown, sections, categoryDropdown, "Category");
    })

    categoryDropdown.addEventListener('change', () => {
        shuffleCards("Category", categoryDropdown, categories, sectionDropdown, "Section")
    })

    populateFilters(sections, categories)
}

function shuffleCards(label, dropdown, groups, otherDropdown, otherLabel) {
    console.log(`${label} change ` + dropdown.value)
    if (dropdown.value.includes('All')) {
        jsonToCards(groups)
        setAddButtonListeners(groups)
    } else {
        jsonToCards({ [`${dropdown.value}`]: groups[`${dropdown.value}`] })
        setAddButtonListeners({ [`${dropdown.value}`]: groups[`${dropdown.value}`] })
    }
    // reset category dropdown back to default
    otherDropdown.selectedIndex = 0;
    resizeSelect(otherDropdown, document.getElementById(`copycat${label}`))
    resizeSelect(dropdown, document.getElementById(`copycat${otherLabel}`))
}

function populateFilters(sections, categories) {
    for (const section in sections) {
        //console.log(section)

        const option = document.createElement('option');
        option.value = section;
        option.text = section;
        sectionDropdown.appendChild(option);
    }

    for (const category in categories) {
        //console.log(category)

        const option = document.createElement('option');
        option.value = category;
        option.text = category;
        categoryDropdown.appendChild(option);
    }
}

function appendFilters() {
    let div = document.createElement('div');
    div.id = 'toolbar';
    document.getElementById('ad').append(div);

    const card = document.createElement('template');

    let fragment = `
            <label for="sectionDropdown">Filter Section</label>
            <div class="copycat"><p id="copycatSection">I'm a copycat</p></div>
            <select id="sectionDropdown" class="filterButton">
                <option value="All Sections" selected="selected">All Sections</option>
            </select>

            <label for="categoryDropdown">Filter Category</label>
            <div class="copycat"><p id="copycatCategory">I'm a copycat</p></div>
            <select id="categoryDropdown" class="filterButton">
                <option value="All Categories" selected="selected">All Categories</option>
            </select>`
    card.innerHTML = fragment;
    div.append(card.content);
}


function resizeSelect(target, copycat) {
    console.log(target, copycat)
    copycat.textContent = target.value;
    console.log(copycat.offsetWidth)
    target.style.width = `${copycat.parentNode.offsetWidth + 20}px`
}