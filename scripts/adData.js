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
                response = response.data[0]["10-02-23"];
                let sections = groupByKey(lsProps.section, response)
                let categories = groupByKey(lsProps.category, response)


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
    document.body.appendChild(parent);

    console.log("json => cards groups:")
    console.log(groups)
    for (const group in groups) {
        console.log("  creating group " + group)
        let h1 = document.createElement('h1');
        h1.className = 'sectionHeader';
        h1.textContent = group.toLowerCase();
        h1.style.textTransform = 'capitalize';
        parent.appendChild(h1);

        let div = document.createElement('div');
        div.className = 'cardContainer';
        div.id = group;
        parent.appendChild(div);

        groups[group].forEach(item => {
            let card = getCardFrag(item[lsProps.brand], item[lsProps.description], item[lsProps.price], item[lsProps.additional], item[lsProps.image])
            div.append(card.content);
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
    console.log("add button parameters: ");
    console.log(response);

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
        button.addEventListener('click', (event) => {
            console.log('add to list click')
            console.log(flattenedArray[i])
            alterLocalStorage(actions.add, event.target, flattenedArray[i]);
        });
    });
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
        console.log("section change " + sectionDropdown.value)
        if (sectionDropdown.value == 'All') {
            jsonToCards(sections)
            setAddButtonListeners(sections)
        } else {
            jsonToCards({ [`${sectionDropdown.value}`]: sections[`${sectionDropdown.value}`] })
            setAddButtonListeners({ [`${sectionDropdown.value}`]: sections[`${sectionDropdown.value}`] })
        }
    })
    categoryDropdown.addEventListener('change', () => {
        console.log("category change " + categoryDropdown.value)
        if (categoryDropdown.value == 'All') {
            jsonToCards(categories)
            setAddButtonListeners(categories)
        } else {
            jsonToCards({ [`${categoryDropdown.value}`]: categories[`${categoryDropdown.value}`] })
            setAddButtonListeners({ [`${categoryDropdown.value}`]: categories[`${categoryDropdown.value}`] })
        }
    })

    populateFilters(sections, categories)
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