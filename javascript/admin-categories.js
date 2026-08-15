if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admin-login.html";
}
const adminProducts =
    JSON.parse(localStorage.getItem("adminProducts")) || [];


// Count products by category
const clothingCount = adminProducts.filter(
    product => product.category === "clothing"
).length;

const electronicsCount = adminProducts.filter(
    product => product.category === "electronics"
).length;

const beautyCount = adminProducts.filter(
    product => product.category === "beauty"
).length;

const homeCount = adminProducts.filter(
    product => product.category === "home"
).length;

const othersCount = adminProducts.filter(
    product => product.category === "others"
).length;


// Display counts
document.getElementById("clothingCount").textContent =
    clothingCount;

document.getElementById("electronicsCount").textContent =
    electronicsCount;

document.getElementById("beautyCount").textContent =
    beautyCount;

document.getElementById("homeCount").textContent =
    homeCount;

document.getElementById("othersCount").textContent =
    othersCount;