// const cartButtons = document.querySelectorAll(".cart-btn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const subtotalElement = document.getElementById("subtotal");
const totalElement = document.getElementById("total");
const deliveryElement = document.getElementById("checkoutDelivery");
const cartCount = document.getElementById("cart-count");

const storeSettings =
JSON.parse(localStorage.getItem("storeSettings")) || {};

const DELIVERY_FEE =
Number(storeSettings.deliveryFee) || 2000;

document.addEventListener("click", (e) => {

    const button = e.target.closest(".cart-btn");

    if (!button) return;

    cart = JSON.parse(localStorage.getItem("cart")) || [];

    const product = {
        name: button.dataset.name,
        price: Number(button.dataset.price),
        image: button.dataset.image,
        quantity: 1
    };

    const existingProduct = cart.find(
        item => item.name === product.name
    );

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push(product);
    }

    saveCart();

    console.log(cart);
});
const cartItems = document.querySelector(".cart-items");

if (cartItems) {
    displayCart();
}
function displayCart() {
    //  console.log(cart);
    cart = JSON.parse(localStorage.getItem("cart")) || [];

    cartItems.innerHTML = "";

    cart.forEach(product => {

        cartItems.innerHTML += `
        
        <div class="cart-item">

            <img src="${product.image}" alt="${product.name}">

            <div class="item-details">

                <h3>${product.name}</h3>

                <p class="item-price">₦${product.price.toLocaleString()}</p>

                <div class="quantity">

                   <button class="decrease" data-name="${product.name}">-</button>

                    <span>${product.quantity}</span>

                    <button class="increase" data-name="${product.name}">+</button>

                </div>

            </div>

            <button class="remove-btn" data-name="${product.name}">
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>

        `;

    });
    updateTotals();
    addQuantityEvents();
    addRemoveEvents();



}
function updateTotals() {

    let subtotal = 0;

    cart.forEach(product => {
        subtotal += product.price * product.quantity;
    });

    const total = subtotal + DELIVERY_FEE;

    if (subtotalElement) {
        subtotalElement.textContent = `₦${subtotal.toLocaleString()}`;
    }
    if (deliveryElement) {
        deliveryElement.textContent =
            `₦${DELIVERY_FEE.toLocaleString()}`;
    }

    if (totalElement) {
        totalElement.textContent = `₦${total.toLocaleString()}`;
    }

}
function addQuantityEvents() {
    cart = JSON.parse(localStorage.getItem("cart")) || [];

    const increaseButtons = document.querySelectorAll(".increase");
    const decreaseButtons = document.querySelectorAll(".decrease");

    increaseButtons.forEach(button => {

        button.addEventListener("click", () => {

            const product = cart.find(item => item.name === button.dataset.name);
            if (!product) return;
            product.quantity++;

            saveCart();

            displayCart();

        });

    });

    decreaseButtons.forEach(button => {

        button.addEventListener("click", () => {

            const product = cart.find(item => item.name === button.dataset.name);
            if (!product) return;
            product.quantity--;

            if (product.quantity <= 0) {
                cart = cart.filter(item => item.name !== product.name);
            }

            saveCart();

            displayCart();

        });

    });

}
function addRemoveEvents() {
    cart = JSON.parse(localStorage.getItem("cart")) || [];

    const removeButtons = document.querySelectorAll(".remove-btn");

    removeButtons.forEach(button => {

        button.addEventListener("click", () => {

            cart = cart.filter(item => item.name !== button.dataset.name);

            saveCart();

            displayCart();

        });

    });

}
function updateCartCount(){
    cart = JSON.parse(localStorage.getItem("cart")) || [];

    let count = 0;

    cart.forEach(product => {
        count += product.quantity;
    });

    if(cartCount){
        cartCount.textContent = count;
    }

}
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}
window.addEventListener("pageshow", () => {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartCount();
});