const adminProductGrid =
    document.getElementById("productGrid");


// =========================
// GET CURRENT PAGE CATEGORY
// =========================

const currentPage =
    window.location.pathname.split("/").pop();


// Match HTML page to admin category
const pageCategories = {

    "cloth.html": "clothing",

    "electronics.html": "electronics",

    "beauty.html": "beauty",

    "homeDecor.html": "home",

    "others.html": "others"

};


const currentCategory =
    pageCategories[currentPage];


// =========================
// GET ADMIN PRODUCTS
// =========================

const adminProducts =
    JSON.parse(localStorage.getItem("adminProducts")) || [];


// =========================
// FILTER PRODUCTS
// =========================

const categoryProducts =
    adminProducts.filter(product =>
        product.category === currentCategory
    );


// =========================
// DISPLAY PRODUCTS
// =========================

categoryProducts.forEach(product => {

    const productCard =
        document.createElement("div");

    productCard.classList.add("product-card");


    productCard.innerHTML = `

        <img
            src="${product.image}"
            alt="${product.name}"
        >

        <span class="badge">New</span>

        <button class="wishlist">

            <i class="fa-regular fa-heart"></i>

        </button>

        <h3>${product.name}</h3>

        <div class="rating">

            ★★★★★

            <span>(0)</span>

        </div>

        <p class="price">

            ₦${Number(product.price).toLocaleString()}

        </p>

        <button
            class="cart-btn"
            data-name="${product.name}"
            data-price="${product.price}"
            data-image="${product.image}"
        >

            <i class="fa-solid fa-cart-plus"></i>

            Add to Cart

        </button>

    `;


    adminProductGrid.appendChild(productCard);

});