const searchInput = document.getElementById("searchInput");
const searchSuggestions = document.getElementById("searchSuggestions");

const productPages = [
    "/html/cloth.html",
    "/html/beauty.html",
    "/html/electronics.html",
    "/html/homeDecor.html",
    "/html/others.html"
];

let allProducts = [];

async function loadProducts() {

    for (const page of productPages) {

        try {

            console.log("Loading:", page);

            const response = await fetch(page);

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const cards = doc.querySelectorAll(".product-card");

            cards.forEach(card => {

                const name = card.querySelector("h3")?.textContent.trim();

                const imageElement = card.querySelector("img");

                const image = imageElement
                    ? new URL(
                        imageElement.getAttribute("src"),
                        window.location.origin + "/html/"
                      ).href
                    : "";

                const button = card.querySelector(".cart-btn");

                const price = button?.dataset.price;

                if (name) {

                    allProducts.push({
                        name: name,
                        image: image,
                        price: price,
                        page: page
                    });

                }

            });

        } catch (error) {

            console.error("Could not load:", page, error);

        }
    }

    console.log("Products loaded:", allProducts);
}

loadProducts();

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const searchValue = searchInput.value.toLowerCase().trim();

        searchSuggestions.innerHTML = "";

        if (searchValue === "") {

            searchSuggestions.style.display = "none";

            return;
        }

        const results = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchValue)
        );


        if (results.length === 0) {

            searchSuggestions.innerHTML = `
                <div class="no-results">
                    No products found
                </div>
            `;

            searchSuggestions.style.display = "block";

            return;
        }


        results.slice(0, 5).forEach(product => {

            const suggestion = document.createElement("div");

            suggestion.classList.add("search-suggestion");

            suggestion.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                
                <div>
                    <strong>${product.name}</strong>
                    <small>₦${Number(product.price).toLocaleString()}</small>
                </div>
            `;

            suggestion.addEventListener("click", function () {

                window.location.href = product.page;

            });

            searchSuggestions.appendChild(suggestion);

        });

        searchSuggestions.style.display = "block";

    });

}