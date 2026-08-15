// =========================
// ADMIN LOGIN
// =========================

const adminLoginForm =
    document.getElementById("adminLoginForm");

const loginError =
    document.getElementById("loginError");


// =========================
// ADMIN DETAILS
// =========================

// Change these to your own details

const ADMIN_EMAIL =
    "admin@stephcollection.com";

const ADMIN_PASSWORD =
    "admin123";


// =========================
// LOGIN
// =========================

adminLoginForm.addEventListener("submit", function (e) {

    e.preventDefault();


    const email =
        document.getElementById("adminEmail")
            .value
            .trim();

    const password =
        document.getElementById("adminPassword")
            .value;


    // =========================
    // CHECK LOGIN
    // =========================

    if (
        email === ADMIN_EMAIL &&
        password === ADMIN_PASSWORD
    ) {

        // Save admin login

        localStorage.setItem(
            "adminLoggedIn",
            "true"
        );


        // Go to dashboard

        window.location.href =
            "admin.html";

    } else {

        loginError.textContent =
            "Invalid email or password.";

    }

});