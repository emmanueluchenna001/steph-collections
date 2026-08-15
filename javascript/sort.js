const sortProducts = document.getElementById("sortProducts");
const productGrid = document.querySelector(".product-grid");

if (sortProducts && productGrid) {

    sortProducts.addEventListener("change", function () {

        const cards = [...productGrid.querySelectorAll(".product-card")];

        if (this.value === "low") {

            cards.sort((a, b) => {
                const priceA = Number(a.querySelector(".cart-btn").dataset.price);
                const priceB = Number(b.querySelector(".cart-btn").dataset.price);

                return priceA - priceB;
            });

        }

        if (this.value === "high") {

            cards.sort((a, b) => {
                const priceA = Number(a.querySelector(".cart-btn").dataset.price);
                const priceB = Number(b.querySelector(".cart-btn").dataset.price);

                return priceB - priceA;
            });

        }

        cards.forEach(card => {
            productGrid.appendChild(card);
        });

    });

}