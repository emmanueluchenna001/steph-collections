let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];


// =========================
// WISHLIST BUTTON
// =========================

document.addEventListener("click", (e) => {

    const button = e.target.closest(".wishlist");

    if (!button) return;


    const card = button.closest(".product-card");

    if (!card) return;


    const name =
        card.querySelector("h3").textContent.trim();


    if (wishlist.includes(name)) {

        // Remove from wishlist
        wishlist = wishlist.filter(
            item => item !== name
        );

        button.classList.remove("active");

    } else {

        // Add to wishlist
        wishlist.push(name);

        button.classList.add("active");

    }


    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

});


// =========================
// SHOW SAVED WISHLIST
// =========================

function updateWishlistButtons() {

    const wishlistButtons =
        document.querySelectorAll(".wishlist");


    wishlistButtons.forEach(button => {

        const card =
            button.closest(".product-card");

        if (!card) return;


        const name =
            card.querySelector("h3").textContent.trim();


        if (wishlist.includes(name)) {

            button.classList.add("active");

        } else {

            button.classList.remove("active");

        }

    });

}


updateWishlistButtons();