const init_page_element = document.querySelector('#social_links');
const save_button = document.querySelector('#save_changes');
const select_options = new Set(['linkedin', 'twitter', 'github', 'facebook', 'instagram', 'tiktok', 'reddit']);

function generateInputRow(uuid, social_key, social_value) {
    const parent = document.createElement('div');
    parent.classList.add('social_row_container');
    const selector = document.createElement('select');
    select_options.forEach((value, index) => {
        const option = document.createElement('option');
        option.setAttribute('value', value);
        if (value === social_key) {
            option.setAttribute('selected', true);
        }
        option.appendChild(document.createTextNode(value));
        selector.appendChild(option);
    })
    parent.appendChild(selector);

    const input_elem = document.createElement('input');
    input_elem.setAttribute('type', 'url');
    input_elem.setAttribute('value', social_value);
    parent.appendChild(input_elem);
    return parent;
}

function write_page() {
    chrome.storage.local.get(["social_links"]).then((result) => {
        /*
            {
                "linkedin": "____",
                "discord": "____",
                ...
            }
        */

        const all_social = (result?.social_links === null || result?.social_links === undefined) ? { 'Select': '' } : result?.social_links;
        console.log(all_social);

        let i = 0;
        for (let social in all_social) {
            init_page_element.appendChild(generateInputRow(`social_link_${i}`, social, all_social[social]));
        }
    })
}

function read_page() {
    const rows = init_page_element.childNodes;
    const social_links = {};
    for (let row of rows) {
        // TODO: ADD Errors here
        const key = row.querySelector('select')?.value;
        if (key !== null && key !== undefined && select_options.has(key)) {
            const value = row.querySelector('input')?.value;
            if (value !== null && value !== undefined) {
                social_links[key] = value;
            }
        }
    }

    chrome.storage.local.set({ 'social_links': social_links }).then(() => { console.log("Success") })
}

function init_page() {
    write_page();
    save_button.addEventListener('click', read_page);
}

init_page();