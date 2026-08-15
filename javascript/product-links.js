const productCards = document.querySelectorAll(".product-card");

productCards.forEach(card => {

    const name = card.querySelector("h3")?.textContent.trim();
    const button = card.querySelector(".cart-btn");
    const image = card.querySelector("img")?.getAttribute("src");

    if (!name || !button || !image) return;

    const price = button.dataset.price;

    // Don't make the buttons clickable
    const elementsToIgnore = card.querySelectorAll(
        ".cart-btn, .wishlist"
    );

    card.addEventListener("click", function (e) {

        // Don't open product page when clicking Add to Cart or Wishlist
        if (
            e.target.closest(".cart-btn") ||
            e.target.closest(".wishlist")
        ) {
            return;
        }

        const url =
            `product.html?name=${encodeURIComponent(name)}` +
            `&price=${encodeURIComponent(price)}` +
            `&image=${encodeURIComponent(image)}`;

        window.location.href = url;

    });

    card.style.cursor = "pointer";

});