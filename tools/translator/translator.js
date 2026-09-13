const sourceLanguage =
    document.getElementById("sourceLanguage");

const targetLanguage =
    document.getElementById("targetLanguage");

const sourceText =
    document.getElementById("sourceText");

const resultText =
    document.getElementById("resultText");

const translateBtn =
    document.getElementById("translateBtn");

const swapBtn =
    document.getElementById("swapBtn");

const clearBtn =
    document.getElementById("clearBtn");

const copyBtn =
    document.getElementById("copyBtn");

const charCount =
    document.getElementById("charCount");

const sourceLabel =
    document.getElementById("sourceLabel");

const targetLabel =
    document.getElementById("targetLabel");

const status =
    document.getElementById("status");


// Cloudflare Worker backend

const API_URL =
    "https://black-bar-de04.mr-codex1241.workers.dev/api/translate";


// ------------------------------------
// LANGUAGE LABELS
// ------------------------------------

function updateLabels() {

    sourceLabel.textContent =
        sourceLanguage.value === "en"
            ? "English"
            : "বাংলা";

    targetLabel.textContent =
        targetLanguage.value === "en"
            ? "English"
            : "বাংলা";
}


// ------------------------------------
// CHARACTER COUNT
// ------------------------------------

sourceText.addEventListener(
    "input",
    () => {

        charCount.textContent =
            `${sourceText.value.length} / 5000`;

    }
);


// ------------------------------------
// SWAP LANGUAGES
// ------------------------------------

swapBtn.addEventListener(
    "click",
    () => {

        const oldSource =
            sourceLanguage.value;

        sourceLanguage.value =
            targetLanguage.value;

        targetLanguage.value =
            oldSource;


        const oldText =
            sourceText.value;

        const oldResult =
            resultText.textContent;


        sourceText.value =
            oldResult ===
            "Translation will appear here..."
                ? ""
                : oldResult;


        resultText.textContent =
            oldText ||
            "Translation will appear here...";


        resultText.classList.toggle(
            "placeholder",
            !oldText
        );


        charCount.textContent =
            `${sourceText.value.length} / 5000`;


        updateLabels();

    }
);


// ------------------------------------
// LANGUAGE CHANGE
// ------------------------------------

sourceLanguage.addEventListener(
    "change",
    updateLabels
);

targetLanguage.addEventListener(
    "change",
    updateLabels
);


// ------------------------------------
// TRANSLATE
// ------------------------------------

translateBtn.addEventListener(
    "click",
    async () => {

        const text =
            sourceText.value.trim();


        if (!text) {

            status.textContent =
                "Please enter some text first.";

            return;
        }


        if (text.length > 5000) {

            status.textContent =
                "Maximum 5000 characters.";

            return;
        }


        translateBtn.disabled = true;

        translateBtn.textContent =
            "Translating...";


        status.textContent =
            "Connecting to AI translator...";


        resultText.textContent =
            "Translating...";

        resultText.classList.remove(
            "placeholder"
        );


        try {

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            text: text,

                            from:
                                sourceLanguage.value === "en"
                                    ? "English"
                                    : "Bengali",

                            to:
                                targetLanguage.value === "en"
                                    ? "English"
                                    : "Bengali"

                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Translation request failed."
                );

            }


            if (!data.translation) {

                throw new Error(
                    "No translation received."
                );

            }


            resultText.textContent =
                data.translation.trim();


            resultText.classList.remove(
                "placeholder"
            );


            status.textContent =
                "Translation completed.";


        } catch (error) {

            console.error(
                "Translator error:",
                error
            );


            resultText.textContent =
                "Translation failed. Please try again.";


            resultText.classList.add(
                "placeholder"
            );


            status.textContent =
                error.message ||
                "Something went wrong.";

        } finally {

            translateBtn.disabled =
                false;

            translateBtn.textContent =
                "Translate";

        }

    }
);


// ------------------------------------
// CLEAR
// ------------------------------------

clearBtn.addEventListener(
    "click",
    () => {

        sourceText.value = "";

        resultText.textContent =
            "Translation will appear here...";

        resultText.classList.add(
            "placeholder"
        );

        charCount.textContent =
            "0 / 5000";

        status.textContent = "";

    }
);


// ------------------------------------
// COPY
// ------------------------------------

copyBtn.addEventListener(
    "click",
    async () => {

        const text =
            resultText.textContent;


        if (
            !text ||
            text ===
            "Translation will appear here..."
        ) {

            return;
        }


        try {

            await navigator.clipboard.writeText(
                text
            );


            status.textContent =
                "Translation copied.";

            copyBtn.textContent =
                "Copied!";


            setTimeout(
                () => {

                    copyBtn.textContent =
                        "Copy";

                },
                1200
            );


        } catch (error) {

            status.textContent =
                "Could not copy the translation.";

        }

    }
);


// ------------------------------------
// INITIALIZE
// ------------------------------------

updateLabels();
