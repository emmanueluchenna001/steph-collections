import { db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


console.log("Order tracker loaded");


// =========================
// ELEMENTS
// =========================

const trackerForm =
    document.getElementById("trackerForm");

const orderIdInput =
    document.getElementById("orderId");

const phoneInput =
    document.getElementById("trackerPhone");

const trackerError =
    document.getElementById("trackerError");

const orderResult =
    document.getElementById("orderResult");

const resultOrderId =
    document.getElementById("resultOrderId");

const resultCustomer =
    document.getElementById("resultCustomer");

const resultTotal =
    document.getElementById("resultTotal");


// STATUS ELEMENTS

const statusPending =
    document.getElementById("statusPending");

const statusProcessing =
    document.getElementById("statusProcessing");

const statusDelivered =
    document.getElementById("statusDelivered");


// =========================
// HIDE RESULT INITIALLY
// =========================

orderResult.style.display = "none";


// =========================
// TRACK ORDER
// =========================

trackerForm.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();


        // Clear previous error

        trackerError.textContent = "";


        // Get values

        const orderId =
            orderIdInput.value.trim();

        const phone =
            phoneInput.value.trim();


        // =========================
        // GET ORDERS FROM FIRESTORE
        // =========================

       try {

    const ordersQuery = query(
        collection(db, "orders"),
        where("id", "==", Number(orderId))
    );

    const ordersSnapshot =
        await getDocs(ordersQuery);


    let foundOrder = null;


    ordersSnapshot.forEach((document) => {

        const order = document.data();

        const storedPhone =
            String(
                order.customer?.phone || ""
            ).replace(/\D/g, "");

        const enteredPhone =
            String(phone).replace(/\D/g, "");


        if (storedPhone === enteredPhone) {

            foundOrder = order;

        }

    });


    if (!foundOrder) {

        orderResult.style.display = "none";

        trackerError.textContent =
            "Order not found. Please check your Order ID and phone number.";

        return;

    }


    displayOrder(foundOrder);


} catch (error) {

    console.error(
        "Error tracking order:",
        error
    );

    trackerError.textContent =
        "Something went wrong. Please try again.";

}

    }
);


// =========================
// DISPLAY ORDER
// =========================

function displayOrder(order) {

    trackerError.textContent = "";


    // Show result

    orderResult.style.display =
        "block";


    // Order information

    resultOrderId.textContent =
        order.id;


    resultCustomer.textContent =
        order.customer.name;


    resultTotal.textContent =
        `₦${Number(
            order.total
        ).toLocaleString()}`;


    // Update status
        console.log("STATUS FROM FIRESTORE:", order.status);
    updateStatus(
        order.status || "Pending"
    );

}


// =========================
// UPDATE STATUS
// =========================

function updateStatus(status) {

    // Remove previous classes

    statusPending.classList.remove(
        "completed"
    );

    statusProcessing.classList.remove(
        "completed"
    );

    statusDelivered.classList.remove(
        "completed"
    );


    // =========================
    // PENDING
    // =========================

    if (status === "Pending") {

        statusPending.classList.add(
            "completed"
        );

    }


    // =========================
    // PROCESSING
    // =========================

    if (status === "Processing") {

        statusPending.classList.add(
            "completed"
        );

        statusProcessing.classList.add(
            "completed"
        );

    }


    // =========================
    // DELIVERED
    // =========================

    if (status === "Delivered") {

        statusPending.classList.add(
            "completed"
        );

        statusProcessing.classList.add(
            "completed"
        );

        statusDelivered.classList.add(
            "completed"
        );

    }

}