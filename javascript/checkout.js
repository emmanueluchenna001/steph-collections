import { db } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const checkoutDelivery =
    document.getElementById("checkoutDelivery");

const checkoutItems =
    document.getElementById("checkout-items");

const checkoutSubtotal =
    document.getElementById("checkoutSubtotal");

const checkoutTotal =
    document.getElementById("checkoutTotal");

const cartCount =
    document.getElementById("cart-count");


// =========================
// STORE SETTINGS
// =========================

const storeSettings =
    JSON.parse(localStorage.getItem("storeSettings")) || {};


// Get delivery fee from Admin Settings

const deliveryFee =
    Number(storeSettings.deliveryFee) || 2000;


// Get WhatsApp number from Admin Settings

const whatsappNumber =
    storeSettings.whatsappNumber || "2349061422486";


// =========================
// DISPLAY CHECKOUT
// =========================

function displayCheckout() {

    checkoutItems.innerHTML = "";

    // =========================
    // EMPTY CART
    // =========================

    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <p>Your cart is empty.</p>
        `;

        checkoutSubtotal.textContent = "₦0";

        checkoutDelivery.textContent =
            `₦${deliveryFee.toLocaleString()}`;

        checkoutTotal.textContent =
            `₦${deliveryFee.toLocaleString()}`;

        return;
    }


    // =========================
    // CALCULATE SUBTOTAL
    // =========================

    let subtotal = 0;


    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;

        subtotal += itemTotal;


        checkoutItems.innerHTML += `
            <div class="checkout-item">

                <div>

                    <h4>${item.name}</h4>

                    <p>
                        Quantity: ${item.quantity}
                    </p>

                </div>

                <strong>
                    ₦${itemTotal.toLocaleString()}
                </strong>

            </div>
        `;

    });


    // =========================
    // CALCULATE TOTAL
    // =========================

    const total =
        subtotal + deliveryFee;


    // =========================
    // DISPLAY AMOUNTS
    // =========================

    checkoutSubtotal.textContent =
        `₦${subtotal.toLocaleString()}`;


    checkoutDelivery.textContent =
        `₦${deliveryFee.toLocaleString()}`;


    checkoutTotal.textContent =
        `₦${total.toLocaleString()}`;

}


// Run checkout display

displayCheckout();


// =========================
// CHECKOUT FORM
// =========================

const checkoutForm =
    document.getElementById("checkoutForm");


checkoutForm.addEventListener("submit", async function (e) {

    e.preventDefault();


    // =========================
    // GET CUSTOMER DETAILS
    // =========================

    const name =
        document.getElementById("name").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const address =
        document.getElementById("address").value.trim();

    const state =
        document.getElementById("state").value;

    const city =
        document.getElementById("city").value.trim();

    const note =
        document.getElementById("note").value.trim();


    // =========================
    // CHECK CART
    // =========================

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }


    // =========================
    // CALCULATE ORDER
    // =========================

    let subtotal = 0;

    let orderItems = "";


    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;

        subtotal += itemTotal;


        orderItems +=
            `• ${item.name} x${item.quantity} - ₦${itemTotal.toLocaleString()}\n`;

    });


    const total =
        subtotal + deliveryFee;


    // =========================
    // CREATE ORDER
    // =========================

    const order = {

        id: Date.now(),

        customer: {

            name: name,

            phone: phone,

            email: email,

            address: address,

            city: city,

            state: state,

            note: note

        },


        items: cart.map(item => ({

            name: item.name,

            price: item.price,

            quantity: item.quantity,

            image: item.image

        })),


        subtotal: subtotal,

        deliveryFee: deliveryFee,

        total: total,


        status: "Pending",


        date: new Date().toLocaleString()

    };


    // =========================
    // SAVE ORDER
    // =========================

    try {

        const docRef = await addDoc(
        collection(db, "orders"),
        order
        );

        // Save Firestore document ID
        order.firestoreId = docRef.id;

        // Keep local backup (optional)
        let orders =
            JSON.parse(localStorage.getItem("orders")) || [];

        orders.push(order);

        localStorage.setItem(
            "orders",
            JSON.stringify(orders)
        );

    } catch (error) {

        console.error(error);

        alert("Failed to save order. Please try again.");

        return;

    }

    // =========================
    // WHATSAPP MESSAGE
    // =========================

    const message = `
🛍️ *NEW ORDER - STEPH COLLECTION*

*Customer Details*

Name: ${name}

Phone: ${phone}

Email: ${email || "Not provided"}


*Delivery Address*

${address}

City: ${city}

State: ${state}


*Order*

${orderItems}

Subtotal: ₦${subtotal.toLocaleString()}

Delivery: ₦${deliveryFee.toLocaleString()}

*Total: ₦${total.toLocaleString()}*


Order Note:

${note || "None"}
`;


    // =========================
    // WHATSAPP
    // =========================

    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


    window.open(
        whatsappURL,
        "_blank"
    );


    // =========================
    // CLEAR CART
    // =========================

    localStorage.removeItem("cart");

    cart = [];


    if (cartCount) {

        cartCount.textContent = "0";

    }
    const orderIdElement =
        document.getElementById("successOrderId");

    if (orderIdElement) {

        orderIdElement.textContent =
            order.id;

    }


    // =========================
    // SUCCESS POPUP
    // =========================

    document
        .getElementById("successPopup")
        .classList.add("show");

});


// =========================
// CLOSE SUCCESS POPUP
// =========================

const closePopupBtn =
    document.getElementById("closePopupBtn");

if (closePopupBtn) {

    closePopupBtn.addEventListener("click", function () {

        document
            .getElementById("successPopup")
            .classList.remove("show");

        window.location.href = "index.html";

    });

}