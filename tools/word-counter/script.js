```javascript
"use strict";

const textInput = document.getElementById("textInput");

const wordCount = document.getElementById("wordCount");
const characterCount = document.getElementById("characterCount");
const characterNoSpaceCount = document.getElementById("characterNoSpaceCount");
const sentenceCount = document.getElementById("sentenceCount");
const paragraphCount = document.getElementById("paragraphCount");

const textStatus = document.getElementById("textStatus");
const charLimit = document.getElementById("charLimit");

const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");

const year = document.getElementById("year");


// Count text
function countText() {
    const text = textInput.value;

    // Characters
    const characters = text.length;

    // Characters without spaces
    const charactersWithoutSpaces = text.replace(/\s/g, "").length;

    // Words
    const trimmedText = text.trim();

    const words = trimmedText
        ? trimmedText.split(/\s+/u).filter(Boolean).length
        : 0;

    // Sentences
    // Counts text ending with ., ! or ?
    const sentences = trimmedText
        ? (trimmedText.match(/[^.!?]+[.!?]+(?=\s|$)/gu) || []).length
        : 0;

    // Paragraphs
    const paragraphs = trimmedText
        ? trimmedText
            .split(/\n\s*\n+/u)
            .filter(paragraph => paragraph.trim().length > 0)
            .length
        : 0;

    // Update UI
    wordCount.textContent = words.toLocaleString();
    characterCount.textContent = characters.toLocaleString();
    characterNoSpaceCount.textContent =
        charactersWithoutSpaces.toLocaleString();
    sentenceCount.textContent = sentences.toLocaleString();
    paragraphCount.textContent = paragraphs.toLocaleString();

    charLimit.textContent =
        `${characters.toLocaleString()} characters`;

    if (characters === 0) {
        textStatus.textContent = "Ready to count";
    } else {
        textStatus.textContent =
            `${words.toLocaleString()} word${words === 1 ? "" : "s"} detected`;
    }
}


// Copy text
async function copyText() {
    const text = textInput.value;

    if (!text.trim()) {
        textStatus.textContent = "Nothing to copy";
        return;
    }

    try {
        await navigator.clipboard.writeText(text);

        textStatus.textContent = "Text copied successfully";

        setTimeout(() => {
            countText();
        }, 1800);

    } catch (error) {
        // Fallback for older browsers
        textInput.focus();
        textInput.select();

        try {
            document.execCommand("copy");
            textStatus.textContent = "Text copied successfully";
        } catch (fallbackError) {
            textStatus.textContent = "Unable to copy text";
        }

        window.getSelection()?.removeAllRanges();

        setTimeout(() => {
            countText();
        }, 1800);
    }
}


// Clear text
function clearText() {
    if (!textInput.value) {
        textInput.focus();
        return;
    }

    textInput.value = "";
    countText();

    textStatus.textContent = "Text cleared";
    textInput.focus();

    setTimeout(() => {
        countText();
    }, 1200);
}


// Event listeners
textInput.addEventListener("input", countText);

copyBtn.addEventListener("click", copyText);

clearBtn.addEventListener("click", clearText);


// Keyboard shortcut
document.addEventListener("keydown", (event) => {
    // Ctrl/Cmd + Shift + C = Copy
    if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key.toLowerCase() === "c"
    ) {
        event.preventDefault();
        copyText();
    }

    // Escape = Clear
    if (event.key === "Escape" && document.activeElement === textInput) {
        clearText();
    }
});


// Footer year
year.textContent = new Date().getFullYear();


// Initial count
countText();
```
