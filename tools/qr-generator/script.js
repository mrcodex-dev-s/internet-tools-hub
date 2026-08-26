/* =========================================================
   Internet Tools Hub
   QR Code Generator — Standalone JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("qr-input");
    const generateBtn = document.getElementById("generate-btn");
    const clearBtn = document.getElementById("clear-btn");
    const downloadBtn = document.getElementById("download-btn");

    const qrPlaceholder = document.getElementById("qr-placeholder");
    const qrContainer = document.getElementById("qr-container");
    const errorMessage = document.getElementById("error-message");

    let currentQR = null;


    /* =========================
       Show Error
    ========================= */

    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }


    /* =========================
       Clear Error
    ========================= */

    function clearError() {
        if (errorMessage) {
            errorMessage.textContent = "";
        }
    }


    /* =========================
       Generate QR
    ========================= */

    function generateQRCode() {

        clearError();

        const text = input.value.trim();


        // Empty input
        if (!text) {

            showError(
                "Please enter some text or a URL first."
            );

            input.focus();

            return;
        }


        // Check QR library
        if (
            typeof QRCode === "undefined"
        ) {

            showError(
                "QR Code library could not be loaded. Please refresh the page."
            );

            return;
        }


        // Clear previous QR
        qrContainer.innerHTML = "";

        currentQR = null;


        // Hide placeholder
        qrPlaceholder.style.display = "none";


        // Create QR
        currentQR = new QRCode(
            qrContainer,
            {
                text: text,

                width: 240,

                height: 240,

                colorDark: "#111827",

                colorLight: "#FFFFFF",

                correctLevel:
                    QRCode.CorrectLevel.H
            }
        );


        // Show QR
        qrContainer.classList.add("has-qr");


        // Enable download
        downloadBtn.disabled = false;
    }


    /* =========================
       Clear Everything
    ========================= */

    function clearQRCode() {

        input.value = "";

        qrContainer.innerHTML = "";

        qrContainer.classList.remove("has-qr");

        qrPlaceholder.style.display = "flex";

        downloadBtn.disabled = true;

        currentQR = null;

        clearError();

        input.focus();
    }


    /* =========================
       Download QR
    ========================= */

    function downloadQRCode() {

        if (!currentQR) {
            return;
        }


        const canvas =
            qrContainer.querySelector("canvas");

        const image =
            qrContainer.querySelector("img");


        let downloadURL = null;


        // Canvas
        if (canvas) {

            try {

                downloadURL =
                    canvas.toDataURL("image/png");

            } catch (error) {

                showError(
                    "Unable to prepare the QR code for download."
                );

                return;
            }
        }


        // Image fallback
        else if (image) {

            downloadURL = image.src;
        }


        if (!downloadURL) {

            showError(
                "QR code is not ready yet. Please try again."
            );

            return;
        }


        // Create temporary link
        const link =
            document.createElement("a");

        link.href = downloadURL;

        link.download =
            "internet-tools-hub-qr-code.png";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    }


    /* =========================
       Button Events
    ========================= */

    generateBtn.addEventListener(
        "click",
        generateQRCode
    );


    clearBtn.addEventListener(
        "click",
        clearQRCode
    );


    downloadBtn.addEventListener(
        "click",
        downloadQRCode
    );


    /* =========================
       Keyboard Shortcut
    ========================= */

    input.addEventListener(
        "keydown",
        (event) => {

            // Ctrl + Enter
            if (
                event.key === "Enter" &&
                (event.ctrlKey || event.metaKey)
            ) {

                event.preventDefault();

                generateQRCode();
            }
        }
    );


    /* =========================
       Initial State
    ========================= */

    downloadBtn.disabled = true;

    qrPlaceholder.style.display = "flex";

    console.log(
        "QR Generator loaded successfully."
    );

});
