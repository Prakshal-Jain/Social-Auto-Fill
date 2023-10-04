const select_options = new Set(['linkedin', 'twitter', 'github', 'facebook', 'instagram', 'tiktok', 'reddit']);

// https://www.javascripttutorial.net/javascript-dom/javascript-insertafter/
function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

// https://stackoverflow.com/questions/63793518/how-to-select-a-word-or-a-phrase-in-a-text-area-in-javascript
function selectTextareaWord(tarea, word) {
    // calculate start/end
    const startPos = tarea.value.length - word.length;
    const endPos = tarea.value.length;

    if (typeof (tarea.selectionStart) != "undefined") {
        tarea.focus();
        tarea.selectionStart = startPos;
        tarea.selectionEnd = endPos;
        return true;
    }

    // IE
    if (document.selection && document.selection.createRange) {
        tarea.focus();
        tarea.select();
        var range = document.selection.createRange();
        range.collapse(true);
        range.moveEnd("character", endPos);
        range.moveStart("character", startPos);
        range.select();
        return true;
    }

    return false;
}

function replaceLastWord(inputString, replacement) {
    // Split the input string into an array of words
    const words = inputString.split(' ');

    // Check if there are at least two words in the array
    if (words.length === 0) {
        return inputString; // Cannot replace the last word if there's only one word
    }

    // Replace the last word with the replacement word
    words[words.length - 1] = replacement;

    // Join the array back into a string
    const resultString = words.join(' ');

    return resultString;
}

function detect_social(event) {
    const elem = event.target;
    const input_value = elem?.value?.trim();
    if (input_value === null || input_value === undefined || input_value === '') {
        return;
    }

    const all_words = input_value?.split(" ");

    if (all_words.length === 0) {
        return;
    }

    let lastWord = all_words[all_words.length - 1];
    if (lastWord[0] !== '@') {
        return;
    }
    else {
        lastWord = lastWord.slice(1);
    }

    if (select_options.has(lastWord)) {
        // TODO: REPLACE
        chrome.storage.local.get(["social_links"]).then((result) => {
            const res = result?.social_links;
            const value = res[lastWord];
            if (value === null || value === undefined) {
                return;
            }

            const newStr = replaceLastWord(elem?.value, value);
            elem.value = newStr;
            selectTextareaWord(elem, value);
        })
    }
}

document.addEventListener('focusin', (event) => {
    const element = event.target;
    if (element.tagName?.toLowerCase() === 'input' && (element.getAttribute('type') === 'text' || element.getAttribute('type') === 'url')) {
        event.target.addEventListener('input', detect_social);
    }
})

document.addEventListener('focusout', (event) => {
    const element = event.target;
    if (element.tagName?.toLowerCase() === 'input' && (element.getAttribute('type') === 'text' || element.getAttribute('type') === 'url')) {
        event.target.removeEventListener('input', detect_social);
    }
    // Remove the attribute and datalist too from DOM
})