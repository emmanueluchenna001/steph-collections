const productDetails = document.getElementById("productDetails");

const params = new URLSearchParams(window.location.search);

const productName = params.get("name");
const productPrice = Number(params.get("price"));
const productImage = params.get("image");

if (!productName || !productPrice || !productImage) {

    productDetails.innerHTML = `
        <div class="product-error">
            <h2>Product not found</h2>
            <a href="index.html">Back to Shop</a>
        </div>
    `;

} else {

    productDetails.innerHTML = `

        <div class="product-image">
            <img src="${productImage}" alt="${productName}">
        </div>

        <div class="product-info">

            <p class="product-category">
                Steph Collection
            </p>

            <h1>${productName}</h1>

            <div class="product-rating">
                ★★★★★
                <span>(24 Reviews)</span>
            </div>

            <h2 class="product-price">
                ₦${productPrice.toLocaleString()}
            </h2>

            <p class="product-description">
                Discover quality products from Steph Collection.
                Shop with confidence and enjoy affordable prices
                delivered directly to you.
            </p>

            <div class="quantity-box">

                <button id="minus">−</button>

                <span id="quantity">1</span>

                <button id="plus">+</button>

            </div>

            <button class="add-product-cart" id="addProductCart">
                <i class="fa-solid fa-cart-shopping"></i>
                Add to Cart
            </button>

            <button class="product-wishlist" id="productWishlist">
                <i class="fa-regular fa-heart"></i>
                Add to Wishlist
            </button>

        </div>
    `;


    // =========================
    // QUANTITY
    // =========================

    let quantity = 1;

    const quantityDisplay = document.getElementById("quantity");
    const minus = document.getElementById("minus");
    const plus = document.getElementById("plus");

    plus.addEventListener("click", () => {

        quantity++;

        quantityDisplay.textContent = quantity;

    });


    minus.addEventListener("click", () => {

        if (quantity > 1) {

            quantity--;

            quantityDisplay.textContent = quantity;

        }

    });


    // =========================
    // ADD TO CART
    // =========================

    document.getElementById("addProductCart")
        .addEventListener("click", () => {

            let cart =
                JSON.parse(localStorage.getItem("cart")) || [];

            const existingProduct = cart.find(
                item =>
                    item.name.toLowerCase() ===
                    productName.toLowerCase()
            );

            if (existingProduct) {

                existingProduct.quantity += quantity;

            } else {

                cart.push({

                    name: productName,

                    price: productPrice,

                    image: productImage,

                    quantity: quantity

                });

            }

            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );


            // Update cart number

            const cartCount =
                document.getElementById("cart-count");

            if (cartCount) {

                const totalItems = cart.reduce(
                    (total, item) =>
                        total + item.quantity,
                    0
                );

                cartCount.textContent = totalItems;

            }


            // Button feedback

            const button =
                document.getElementById("addProductCart");

            button.innerHTML =
                `<i class="fa-solid fa-check"></i> Added to Cart`;

            setTimeout(() => {

                button.innerHTML =
                    `<i class="fa-solid fa-cart-shopping"></i> Add to Cart`;

            }, 1500);

        });


    // =========================
    // WISHLIST
    // =========================

    let wishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];

    const wishlistButton =
        document.getElementById("productWishlist");

    const wishlistIcon =
        wishlistButton.querySelector("i");


    // Check if already saved

    if (
        wishlist.some(
            item =>
                item.toLowerCase() ===
                productName.toLowerCase()
        )
    ) {

        wishlistButton.classList.add("active");

        wishlistIcon.className =
            "fa-solid fa-heart";

        wishlistButton.innerHTML =
            `<i class="fa-solid fa-heart"></i> In Wishlist`;

    }


    wishlistButton.addEventListener("click", () => {

        const index = wishlist.findIndex(
            item =>
                item.toLowerCase() ===
                productName.toLowerCase()
        );


        if (index !== -1) {

            // Remove

            wishlist.splice(index, 1);

            wishlistButton.classList.remove("active");

            wishlistButton.innerHTML =
                `<i class="fa-regular fa-heart"></i> Add to Wishlist`;

        } else {

            // Add

            wishlist.push(productName);

            wishlistButton.classList.add("active");

            wishlistButton.innerHTML =
                `<i class="fa-solid fa-heart"></i> In Wishlist`;

        }


        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );

    });

}