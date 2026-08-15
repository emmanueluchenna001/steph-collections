if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admin-login.html";
}
const settingsForm = document.getElementById("settingsForm");

// =========================
// LOAD SAVED SETTINGS
// =========================

const savedSettings =
    JSON.parse(localStorage.getItem("storeSettings")) || {};


// =========================
// PUT SAVED SETTINGS IN FORM
// =========================

document.getElementById("storeName").value =
    savedSettings.storeName || "";

document.getElementById("storePhone").value =
    savedSettings.storePhone || "";

document.getElementById("whatsappNumber").value =
    savedSettings.whatsappNumber || "";

document.getElementById("deliveryFee").value =
    savedSettings.deliveryFee || "";

document.getElementById("storeLocation").value =
    savedSettings.storeLocation || "";

document.getElementById("storeEmail").value =
    savedSettings.storeEmail || "";


// =========================
// SAVE SETTINGS
// =========================

settingsForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const storeSettings = {

        storeName:
            document.getElementById("storeName").value.trim(),

        storePhone:
            document.getElementById("storePhone").value.trim(),

        whatsappNumber:
            document.getElementById("whatsappNumber").value.trim(),

        deliveryFee:
            Number(document.getElementById("deliveryFee").value),

        storeLocation:
            document.getElementById("storeLocation").value.trim(),

        storeEmail:
            document.getElementById("storeEmail").value.trim()

    };


    // SAVE TO LOCAL STORAGE

    localStorage.setItem(
        "storeSettings",
        JSON.stringify(storeSettings)
    );


    alert("Settings saved successfully!");

});