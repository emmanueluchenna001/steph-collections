const wishlistContainer = document.getElementById("wishlist-container");

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const productPages = [
    "index.html",
    "cloth.html",
    "beauty.html",
    "electronics.html",
    "homeDecor.html",
    "others.html"
];

let products = [];

// Get products from all category pages
async function loadWishlistProducts() {

    for (const page of productPages) {

        try {

            const response = await fetch(page);
            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const cards = doc.querySelectorAll(".product-card");

            cards.forEach(card => {

                const name = card.querySelector("h3")?.textContent.trim();
                const image = card.querySelector("img")?.getAttribute("src");
                const button = card.querySelector(".cart-btn");

                if (name && button) {

                    products.push({
                        name: name,
                        image: image,
                        price: button.dataset.price
                    });

                }

            });

        } catch (error) {

            console.log("Could not load:", page);

        }

    }
    const adminProducts =
    JSON.parse(localStorage.getItem("adminProducts")) || [];

    adminProducts.forEach(product => {

        products.push({
            name: product.name,
            image: product.image,
            price: product.price
        });

    });


    displayWishlist();
}


function displayWishlist() {

    wishlistContainer.innerHTML = "";

    if (wishlist.length === 0) {

        wishlistContainer.innerHTML = `
            <p class="empty-wishlist">
                Your wishlist is empty ❤️
            </p>
        `;

        return;
    }


    wishlist.forEach(name => {

        const product = products.find(
            item => item.name.toLowerCase() === name.toLowerCase()
        );

        if (!product) return;


        const card = document.createElement("div");

        card.classList.add("wishlist-card");

        card.innerHTML = `
            
            <img 
                src="${product.image}" 
                alt="${product.name}"
            >

            <h3>${product.name}</h3>

            <div class="rating">
                ★★★★★
                <span>(24)</span>
            </div>

            <p class="wishlist-price">
                ₦${Number(product.price).toLocaleString()}
            </p>

            <div class="wishlist-buttons">

                <button class="add-wishlist-cart">
                    🛒 Add to Cart
                </button>

                <button class="remove-wishlist">
                    Remove ❤️
                </button>

            </div>
        `;


        // Add to cart
        card.querySelector(".add-wishlist-cart")
            .addEventListener("click", () => {

                let cart = JSON.parse(localStorage.getItem("cart")) || [];

                const existing = cart.find(
                    item => item.name.toLowerCase() === product.name.toLowerCase()
                );

                if (existing) {

                    existing.quantity++;

                } else {

                    cart.push({
                        name: product.name,
                        price: Number(product.price),
                        image: product.image,
                        quantity: 1
                    });

                }

                localStorage.setItem("cart", JSON.stringify(cart));

                const button = card.querySelector(".add-wishlist-cart");

                    button.textContent = "✓ Added to Cart";

                    setTimeout(() => {
                        button.textContent = "🛒 Add to Cart";
                    }, 1500);

            });


        // Remove from wishlist
        card.querySelector(".remove-wishlist")
            .addEventListener("click", () => {

                wishlist = wishlist.filter(
                    item => item.toLowerCase() !== product.name.toLowerCase()
                );

                localStorage.setItem(
                    "wishlist",
                    JSON.stringify(wishlist)
                );

                displayWishlist();

            });


        wishlistContainer.appendChild(card);

    });

}


loadWishlistProducts();