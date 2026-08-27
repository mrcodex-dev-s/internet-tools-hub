/* =========================================================
   Internet Tools Hub
   Password Generator — Standalone JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const output =
        document.getElementById("password-output");

    const copyBtn =
        document.getElementById("copy-btn");

    const generateBtn =
        document.getElementById("generate-btn");

    const lengthSlider =
        document.getElementById("password-length");

    const lengthValue =
        document.getElementById("length-value");

    const uppercase =
        document.getElementById("uppercase");

    const lowercase =
        document.getElementById("lowercase");

    const numbers =
        document.getElementById("numbers");

    const symbols =
        document.getElementById("symbols");

    const strengthText =
        document.getElementById("strength-text");

    const strengthFill =
        document.getElementById("strength-fill");

    const copyMessage =
        document.getElementById("copy-message");


    /* =========================
       Character Sets
    ========================= */

    const CHARACTERS = {

        uppercase:
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ",

        lowercase:
            "abcdefghijklmnopqrstuvwxyz",

        numbers:
            "0123456789",

        symbols:
            "!@#$%^&*()_+-=[]{}|;:,.<>?"
    };


    /* =========================
       Secure Random Number
    ========================= */

    function secureRandom(max) {

        const cryptoObject =
            window.crypto ||
            window.msCrypto;

        if (
            !cryptoObject ||
            !cryptoObject.getRandomValues
        ) {
            return Math.floor(
                Math.random() * max
            );
        }

        const array =
            new Uint32Array(1);

        cryptoObject.getRandomValues(array);

        return array[0] % max;
    }


    /* =========================
       Random Character
    ========================= */

    function randomCharacter(characters) {

        return characters[
            secureRandom(characters.length)
        ];
    }


    /* =========================
       Shuffle
    ========================= */

    function shuffle(array) {

        for (
            let i = array.length - 1;
            i > 0;
            i--
        ) {

            const j =
                secureRandom(i + 1);

            [
                array[i],
                array[j]
            ] = [
                array[j],
                array[i]
            ];
        }

        return array;
    }


    /* =========================
       Generate Password
    ========================= */

    function generatePassword() {

        const length =
            Number(lengthSlider.value);


        let selectedSets = [];


        if (uppercase.checked) {
            selectedSets.push(
                CHARACTERS.uppercase
            );
        }

        if (lowercase.checked) {
            selectedSets.push(
                CHARACTERS.lowercase
            );
        }

        if (numbers.checked) {
            selectedSets.push(
                CHARACTERS.numbers
            );
        }

        if (symbols.checked) {
            selectedSets.push(
                CHARACTERS.symbols
            );
        }


        /* No option selected */

        if (selectedSets.length === 0) {

            uppercase.checked = true;

            selectedSets = [
                CHARACTERS.uppercase
            ];
        }


        /*
         * Make sure the password contains
         * at least one character from every
         * selected character set.
         */

        const passwordCharacters = [];


        selectedSets.forEach((set) => {

            passwordCharacters.push(
                randomCharacter(set)
            );

        });


        /* Combined character pool */

        const combinedCharacters =
            selectedSets.join("");


        /*
         * Fill remaining characters
         */

        while (
            passwordCharacters.length <
            length
        ) {

            passwordCharacters.push(
                randomCharacter(
                    combinedCharacters
                )
            );

        }


        /* Shuffle */

        shuffle(passwordCharacters);


        /* Output */

        output.value =
            passwordCharacters.join("");


        /* Enable copy */

        copyBtn.disabled = false;


        /* Update strength */

        updateStrength();
    }


    /* =========================
       Password Strength
    ========================= */

    function calculateStrength() {

        const password =
            output.value;

        if (!password) {
            return 0;
        }


        let score = 0;


        const length =
            password.length;


        /* Length */

        if (length >= 8) {
            score += 1;
        }

        if (length >= 12) {
            score += 1;
        }

        if (length >= 16) {
            score += 1;
        }

        if (length >= 24) {
            score += 1;
        }


        /* Character variety */

        if (/[A-Z]/.test(password)) {
            score += 1;
        }

        if (/[a-z]/.test(password)) {
            score += 1;
        }

        if (/[0-9]/.test(password)) {
            score += 1;
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            score += 1;
        }


        return score;
    }


    /* =========================
       Update Strength UI
    ========================= */

    function updateStrength() {

        const score =
            calculateStrength();


        let label =
            "Very Weak";

        let width =
            15;


        if (score >= 8) {

            label =
                "Very Strong";

            width =
                100;

        } else if (score >= 6) {

            label =
                "Strong";

            width =
                80;

        } else if (score >= 4) {

            label =
                "Good";

            width =
                60;

        } else if (score >= 2) {

            label =
                "Weak";

            width =
                35;
        }


        strengthText.textContent =
            label;

        strengthFill.style.width =
            `${width}%`;


        /*
         * Keep the default green design.
         * Only adjust opacity slightly based
         * on strength.
         */

        strengthFill.style.opacity =
            score >= 6
                ? "1"
                : score >= 4
                    ? "0.8"
                    : "0.6";
    }


    /* =========================
       Copy Password
    ========================= */

    async function copyPassword() {

        const password =
            output.value;


        if (!password) {
            return;
        }


        try {

            await navigator.clipboard.writeText(
                password
            );

            copyMessage.textContent =
                "Password copied successfully.";

            copyBtn.textContent =
                "Copied";

        } catch (error) {

            /*
             * Fallback for browsers where
             * Clipboard API isn't available.
             */

            output.select();

            output.setSelectionRange(
                0,
                output.value.length
            );

            const copied =
                document.execCommand("copy");


            if (copied) {

                copyMessage.textContent =
                    "Password copied successfully.";

                copyBtn.textContent =
                    "Copied";

            } else {

                copyMessage.textContent =
                    "Copy failed. Please copy it manually.";
            }
        }


        setTimeout(() => {

            copyBtn.textContent =
                "Copy";

            copyMessage.textContent =
                "";

        }, 1800);
    }


    /* =========================
       Length Slider
    ========================= */

    lengthSlider.addEventListener(
        "input",
        () => {

            lengthValue.textContent =
                lengthSlider.value;

            /*
             * Generate a new password
             * whenever the length changes.
             */

            generatePassword();
        }
    );


    /* =========================
       Character Options
    ========================= */

    [
        uppercase,
        lowercase,
        numbers,
        symbols
    ].forEach((checkbox) => {

        checkbox.addEventListener(
            "change",
            () => {

                /*
                 * Prevent all options from
                 * being unchecked.
                 */

                if (
                    !uppercase.checked &&
                    !lowercase.checked &&
                    !numbers.checked &&
                    !symbols.checked
                ) {

                    checkbox.checked = true;
                }

                generatePassword();
            }
        );

    });


    /* =========================
       Buttons
    ========================= */

    generateBtn.addEventListener(
        "click",
        generatePassword
    );


    copyBtn.addEventListener(
        "click",
        copyPassword
    );


    /* =========================
       Initial State
    ========================= */

    lengthValue.textContent =
        lengthSlider.value;

    copyBtn.disabled = true;

    generatePassword();


    console.log(
        "Password Generator loaded successfully."
    );

});
