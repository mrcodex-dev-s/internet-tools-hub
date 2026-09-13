document.addEventListener("DOMContentLoaded", () => {

    const sourceLanguage = document.getElementById("sourceLanguage");
    const targetLanguage = document.getElementById("targetLanguage");

    const sourceText = document.getElementById("sourceText");
    const resultText = document.getElementById("resultText");

    const translateBtn = document.getElementById("translateBtn");
    const swapBtn = document.getElementById("swapBtn");
    const clearBtn = document.getElementById("clearBtn");
    const copyBtn = document.getElementById("copyBtn");

    const charCount = document.getElementById("charCount");
    const sourceLabel = document.getElementById("sourceLabel");
    const targetLabel = document.getElementById("targetLabel");
    const status = document.getElementById("status");


    // Your Cloudflare Worker API
    const API_URL =
        "https://black-bar-de04.mr-codex1241.workers.dev/api/translate";


    // -----------------------------
    // LANGUAGE LABELS
    // -----------------------------

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


    // -----------------------------
    // CHARACTER COUNT
    // -----------------------------

    sourceText.addEventListener("input", () => {

        charCount.textContent =
            `${sourceText.value.length} / 5000`;

    });


    // -----------------------------
    // CLEAR
    // -----------------------------

    clearBtn.addEventListener("click", () => {

        sourceText.value = "";

        resultText.textContent =
            "Translation will appear here...";

        resultText.classList.add("placeholder");

        charCount.textContent = "0 / 5000";

        status.textContent = "";

    });


    // -----------------------------
    // SWAP
    // -----------------------------

    swapBtn.addEventListener("click", () => {

        const oldSource =
            sourceLanguage.value;

        sourceLanguage.value =
            targetLanguage.value;

        targetLanguage.value =
            oldSource;


        const oldSourceText =
            sourceText.value;

        const oldResultText =
            resultText.textContent;


        if (
            oldResultText &&
            oldResultText !==
            "Translation will appear here..."
        ) {

            sourceText.value =
                oldResultText;

            resultText.textContent =
                oldSourceText ||
                "Translation will appear here...";

        }


        charCount.textContent =
            `${sourceText.value.length} / 5000`;


        resultText.classList.toggle(
            "placeholder",
            !oldSourceText
        );


        updateLabels();

        status.textContent = "";

    });


    // -----------------------------
    // LANGUAGE CHANGE
    // -----------------------------

    sourceLanguage.addEventListener(
        "change",
        updateLabels
    );

    targetLanguage.addEventListener(
        "change",
        updateLabels
    );


    // -----------------------------
    // TRANSLATE
    // -----------------------------

    translateBtn.addEventListener("click", async () => {

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


        // Prevent same-language translation
        if (
            sourceLanguage.value ===
            targetLanguage.value
        ) {

            status.textContent =
                "Please select two different languages.";

            return;
        }


        translateBtn.disabled = true;

        translateBtn.textContent =
            "Translating...";

        status.textContent =
            "Translating...";


        resultText.textContent =
            "Please wait...";

        resultText.classList.remove(
            "placeholder"
        );


        try {

            const response =
                await fetch(API_URL, {

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

                });


            let data;

            try {

                data =
                    await response.json();

            } catch {

                throw new Error(
                    "Server returned an invalid response."
                );

            }


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    `Server error: ${response.status}`
                );

            }


            if (!data.translation) {

                throw new Error(
                    "No translation was returned."
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
                "Translation error:",
                error
            );


            resultText.textContent =
                "Translation failed.";

            resultText.classList.add(
                "placeholder"
            );


            status.textContent =
                error.message ||
                "Could not connect to translator.";

        }


        translateBtn.disabled = false;

        translateBtn.textContent =
            "Translate";

    });


    // -----------------------------
    // COPY
    // -----------------------------

    copyBtn.addEventListener("click", async () => {

        const text =
            resultText.textContent;


        if (
            !text ||
            text ===
            "Translation will appear here..."
        ) {

            status.textContent =
                "Nothing to copy.";

            return;
        }


        try {

            await navigator.clipboard.writeText(
                text
            );

            copyBtn.textContent =
                "Copied!";

            status.textContent =
                "Translation copied.";


            setTimeout(() => {

                copyBtn.textContent =
                    "Copy";

            }, 1200);


        } catch {

            status.textContent =
                "Could not copy text.";

        }

    });


    // -----------------------------
    // INITIALIZE
    // -----------------------------

    updateLabels();

    console.log(
        "Internet Tools Hub Translator loaded."
    );

});
