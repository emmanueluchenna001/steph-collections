if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admin-login.html";
}
const addProductBtn =
    document.querySelector(".add-product-btn");

const productFormContainer =
    document.getElementById("productFormContainer");

const closeProductForm =
    document.getElementById("closeProductForm");

const productForm =
    document.getElementById("productForm");

const adminProductList =
    document.getElementById("adminProductList");


// =========================
// LOAD PRODUCTS
// =========================

let adminProducts =
    JSON.parse(localStorage.getItem("adminProducts")) || [];


// =========================
// OPEN FORM
// =========================

addProductBtn.addEventListener("click", () => {

    productForm.reset();

    delete productForm.dataset.editIndex;

    productFormContainer.classList.add("show");

});


// =========================
// CLOSE FORM
// =========================

closeProductForm.addEventListener("click", () => {

    productFormContainer.classList.remove("show");

    productForm.reset();

    delete productForm.dataset.editIndex;

});


// =========================
// DISPLAY PRODUCTS
// =========================

function displayProducts() {

    adminProductList.innerHTML = "";


    if (adminProducts.length === 0) {

        adminProductList.innerHTML = `

            <div class="empty-products">

                <i class="fa-solid fa-box-open"></i>

                <p>No products added yet.</p>

            </div>

        `;

        return;
    }


    adminProducts.forEach((product, index) => {

        const productRow =
            document.createElement("div");

        productRow.classList.add(
            "admin-product-row"
        );


        productRow.innerHTML = `

            <div class="admin-product-info">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <strong>
                    ${product.name}
                </strong>

            </div>


            <span>
                ${product.category}
            </span>


            <span>
                ₦${Number(product.price).toLocaleString()}
            </span>


            <div class="product-actions">

                <button
                    class="edit-product"
                    data-index="${index}"
                >

                    <i class="fa-solid fa-pen"></i>

                </button>


                <button
                    class="delete-product"
                    data-index="${index}"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        `;


        adminProductList.appendChild(productRow);

    });


    // =========================
    // EDIT BUTTON
    // =========================

    document
        .querySelectorAll(".edit-product")
        .forEach(button => {

            button.addEventListener("click", () => {

                const index =
                    Number(button.dataset.index);

                const product =
                    adminProducts[index];


                document.getElementById("productName").value =
                    product.name;

                document.getElementById("productPrice").value =
                    product.price;

                document.getElementById("productCategory").value =
                    product.category;

                document.getElementById("productDescription").value =
                    product.description || "";


                // Save which product is being edited

                productForm.dataset.editIndex =
                    index;


                productFormContainer.classList.add("show");

            });

        });


    // =========================
    // DELETE BUTTON
    // =========================

    document
        .querySelectorAll(".delete-product")
        .forEach(button => {

            button.addEventListener("click", () => {

                const index =
                    Number(button.dataset.index);


                const confirmDelete =
                    confirm(
                        "Are you sure you want to delete this product?"
                    );


                if (!confirmDelete) return;


                adminProducts.splice(index, 1);


                localStorage.setItem(
                    "adminProducts",
                    JSON.stringify(adminProducts)
                );


                displayProducts();

            });

        });

}


// =========================
// SAVE / UPDATE PRODUCT
// =========================

productForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document
                .getElementById("productName")
                .value
                .trim();


        const price =
            Number(
                document
                    .getElementById("productPrice")
                    .value
            );


        const category =
            document
                .getElementById("productCategory")
                .value;


        const description =
            document
                .getElementById("productDescription")
                .value
                .trim();


        const imageInput =
            document.getElementById("productImage");


        const imageFile =
            imageInput.files[0];


        // =========================
        // CHECK IF EDITING
        // =========================

        const editIndex =
            productForm.dataset.editIndex;


        // =========================
        // EDIT EXISTING PRODUCT
        // =========================

        if (editIndex !== undefined) {

            const oldProduct =
                adminProducts[Number(editIndex)];


            // If no new image was selected,
            // keep the old image

            if (!imageFile) {

                adminProducts[Number(editIndex)] = {

                    ...oldProduct,

                    name: name,

                    price: price,

                    category: category,

                    description: description

                };


                saveProducts();

                return;

            }


            // New image selected

            const reader =
                new FileReader();


            reader.onload = function () {

                adminProducts[Number(editIndex)] = {

                    ...oldProduct,

                    name: name,

                    price: price,

                    category: category,

                    image: reader.result,

                    description: description

                };


                saveProducts();

            };


            reader.readAsDataURL(imageFile);

            return;

        }


        // =========================
        // ADD NEW PRODUCT
        // =========================

        if (!imageFile) {

            alert(
                "Please select a product image."
            );

            return;

        }


        const reader =
            new FileReader();


        reader.onload = function () {

            const product = {

                id: Date.now(),

                name: name,

                price: price,

                category: category,

                image: reader.result,

                description: description

            };


            adminProducts.push(product);


            saveProducts();

        };


        reader.readAsDataURL(imageFile);

    }
);


// =========================
// SAVE PRODUCTS
// =========================

function saveProducts() {

    localStorage.setItem(
        "adminProducts",
        JSON.stringify(adminProducts)
    );


    productForm.reset();

    delete productForm.dataset.editIndex;

    productFormContainer.classList.remove("show");


    displayProducts();


    alert("Product saved successfully!");

}


// =========================
// INITIAL DISPLAY
// =========================

displayProducts();
// =========================
// SEARCH PRODUCTS
// =========================

const productSearch =
    document.getElementById("productSearch");


// =========================
// CATEGORY FILTER
// =========================

const categoryFilter =
    document.getElementById("categoryFilter");


// =========================
// FILTER PRODUCTS
// =========================

function filterProducts() {

    const searchText =
        productSearch.value.toLowerCase().trim();

    const selectedCategory =
        categoryFilter.value;


    const filteredProducts =
        adminProducts.filter(product => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;


            return matchesSearch && matchesCategory;

        });


    displayFilteredProducts(filteredProducts);

}


// =========================
// DISPLAY FILTERED PRODUCTS
// =========================

function displayFilteredProducts(products) {

    adminProductList.innerHTML = "";


    if (products.length === 0) {

        adminProductList.innerHTML = `

            <div class="empty-products">

                <i class="fa-solid fa-box-open"></i>

                <p>No products found.</p>

            </div>

        `;

        return;
    }


    products.forEach(product => {

        const productRow =
            document.createElement("div");


        productRow.classList.add(
            "admin-product-row"
        );


        productRow.innerHTML = `

            <div class="admin-product-info">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <strong>
                    ${product.name}
                </strong>

            </div>


            <span>
                ${product.category}
            </span>


            <span>
                ₦${Number(product.price).toLocaleString()}
            </span>


            <div class="product-actions">

                <button
                    class="edit-product"
                    data-index="${adminProducts.indexOf(product)}"
                >

                    <i class="fa-solid fa-pen"></i>

                </button>


                <button
                    class="delete-product"
                    data-index="${adminProducts.indexOf(product)}"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        `;


        adminProductList.appendChild(productRow);

    });


    // =========================
    // EDIT FILTERED PRODUCT
    // =========================

    document
        .querySelectorAll(".edit-product")
        .forEach(button => {

            button.addEventListener("click", () => {

                const index =
                    Number(button.dataset.index);

                const product =
                    adminProducts[index];


                document.getElementById("productName").value =
                    product.name;

                document.getElementById("productPrice").value =
                    product.price;

                document.getElementById("productCategory").value =
                    product.category;

                document.getElementById("productDescription").value =
                    product.description || "";


                productForm.dataset.editIndex =
                    index;


                productFormContainer.classList.add("show");

            });

        });


    // =========================
    // DELETE FILTERED PRODUCT
    // =========================

    document
        .querySelectorAll(".delete-product")
        .forEach(button => {

            button.addEventListener("click", () => {

                const index =
                    Number(button.dataset.index);


                if (
                    !confirm(
                        "Are you sure you want to delete this product?"
                    )
                ) {
                    return;
                }


                adminProducts.splice(index, 1);


                localStorage.setItem(
                    "adminProducts",
                    JSON.stringify(adminProducts)
                );


                filterProducts();

            });

        });

}


// =========================
// SEARCH EVENT
// =========================

productSearch.addEventListener(
    "input",
    filterProducts
);


// =========================
// CATEGORY EVENT
// =========================

categoryFilter.addEventListener(
    "change",
    filterProducts
);