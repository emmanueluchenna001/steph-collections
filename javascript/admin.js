// =========================
// CHECK ADMIN LOGIN
// =========================

if (localStorage.getItem("adminLoggedIn") !== "true") {

    window.location.href = "admin-login.html";

}


// =========================
// FIREBASE
// =========================

import { db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    updateDoc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


// =========================
// GET ORDERS
// =========================

let orders = [];


// =========================
// ELEMENTS
// =========================

const ordersTableBody =
    document.getElementById("ordersTableBody");

const emptyOrders =
    document.getElementById("emptyOrders");


// =========================
// GET ORDERS FROM FIRESTORE
// =========================

async function getOrders() {

    try {

        const ordersSnapshot =
            await getDocs(
                collection(db, "orders")
            );


        orders = [];


        ordersSnapshot.forEach(documentSnapshot => {

            const order =
                documentSnapshot.data();


            // Save Firebase document ID
            // so we can update the order later

            order.firebaseId =
                documentSnapshot.id;


            orders.push(order);

        });


        // Newest orders first

        orders.sort(
            (a, b) =>
                Number(b.id) - Number(a.id)
        );


        displayOrders();

        updateDashboardStats();


    } catch (error) {

        console.error(
            "Error getting orders:",
            error
        );

    }

}


// =========================
// DISPLAY ORDERS
// =========================

function displayOrders() {

    if (!ordersTableBody) return;


    ordersTableBody.innerHTML = "";


    if (orders.length === 0) {

        if (emptyOrders) {

            emptyOrders.style.display =
                "block";

        }

        return;
    }


    if (emptyOrders) {

        emptyOrders.style.display =
            "none";

    }


    orders.forEach((order, index) => {

        const row =
            document.createElement("tr");


        const itemCount =
            order.items.reduce(
                (total, item) =>
                    total + Number(item.quantity),
                0
            );


        row.innerHTML = `

            <td>
                ${order.id}
            </td>

            <td>
                ${order.customer.name}
            </td>

            <td>
                ${order.customer.phone}
            </td>

            <td>
                ${itemCount}
                item${itemCount !== 1 ? "s" : ""}
            </td>

            <td>
                ₦${Number(order.total).toLocaleString()}
            </td>

            <td>

                <select
                    class="order-status-select ${getStatusClass(order.status)}"
                    onchange="changeOrderStatus(${index}, this.value)"
                >

                    <option
                        value="Pending"
                        ${order.status === "Pending" ? "selected" : ""}
                    >
                        Pending
                    </option>

                    <option
                        value="Processing"
                        ${order.status === "Processing" ? "selected" : ""}
                    >
                        Processing
                    </option>

                    <option
                        value="Delivered"
                        ${order.status === "Delivered" ? "selected" : ""}
                    >
                        Delivered
                    </option>

                </select>

            </td>

            <td>

                <button
                    class="view-order-btn"
                    onclick="viewOrder(${index})"
                >
                    View
                </button>

            </td>

        `;


        ordersTableBody.appendChild(row);


        // =========================
        // ORDER DETAILS
        // =========================

        const detailsRow =
            document.createElement("tr");


        detailsRow.classList.add(
            "order-details"
        );


        detailsRow.id =
            `order-details-${index}`;


        let itemsHTML = "";


        order.items.forEach(item => {

            itemsHTML += `

                <div class="order-product">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                    <div>

                        <p>
                            <strong>
                                ${item.name}
                            </strong>
                        </p>

                        <p>
                            Quantity:
                            ${item.quantity}
                        </p>

                        <p>
                            ₦${(
                                item.price *
                                item.quantity
                            ).toLocaleString()}
                        </p>

                    </div>

                </div>

            `;

        });


        detailsRow.innerHTML = `

            <td colspan="9">

                <div class="order-details-content">

                    <h4>
                        Customer Details
                    </h4>

                    <p>
                        <strong>Name:</strong>
                        ${order.customer.name}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${order.customer.phone}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${order.customer.email || "Not provided"}
                    </p>

                    <p>
                        <strong>Address:</strong>
                        ${order.customer.address}
                    </p>

                    <p>
                        <strong>City:</strong>
                        ${order.customer.city}
                    </p>

                    <p>
                        <strong>State:</strong>
                        ${order.customer.state}
                    </p>

                    <br>

                    <h4>
                        Ordered Products
                    </h4>

                    ${itemsHTML}

                    <br>

                    <p>
                        <strong>
                            Order Date:
                        </strong>

                        ${order.date}
                    </p>

                    <p>
                        <strong>
                            Delivery Fee:
                        </strong>

                        ₦${Number(
                            order.deliveryFee || 0
                        ).toLocaleString()}
                    </p>

                    <p>
                        <strong>
                            Total:
                        </strong>

                        ₦${Number(
                            order.total
                        ).toLocaleString()}
                    </p>

                </div>

            </td>

        `;


        ordersTableBody.appendChild(
            detailsRow
        );

    });

}


// =========================
// STATUS CLASS
// =========================

function getStatusClass(status) {

    if (status === "Processing") {

        return "status-processing";

    }


    if (status === "Delivered") {

        return "status-delivered";

    }


    return "status-pending";

}


// =========================
// CHANGE ORDER STATUS
// =========================

async function changeOrderStatus(index, newStatus) {

    const order = orders[index];

    if (!order) {
        console.error("Order not found");
        return;
    }

    // Update local order
    order.status = newStatus;

    // Save local copy
    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    try {

        // Find the order in Firestore using its Order ID
        const ordersQuery = query(
            collection(db, "orders"),
            where("id", "==", order.id)
        );

        const snapshot =
            await getDocs(ordersQuery);

        if (snapshot.empty) {

            console.error(
                "Order not found in Firestore:",
                order.id
            );

            return;
        }

        // Get the Firestore document
        const orderDoc = snapshot.docs[0];

        // Update status
        await updateDoc(
            orderDoc.ref,
            {
                status: newStatus
            }
        );

        console.log(
            "Order status updated in Firebase"
        );

    } catch (error) {

        console.error(
            "Failed to update order status:",
            error
        );

    }

    // Refresh admin table
    displayOrders();

    // Update dashboard
    updateDashboardStats();

}


// =========================
// VIEW ORDER
// =========================

function viewOrder(index) {

    const details =
        document.getElementById(
            `order-details-${index}`
        );


    if (!details) return;


    details.classList.toggle("show");

}


// =========================
// MAKE FUNCTIONS AVAILABLE
// TO HTML ONCLICK / ONCHANGE
// =========================

window.changeOrderStatus =
    changeOrderStatus;

window.viewOrder =
    viewOrder;


// =========================
// DASHBOARD STATISTICS
// =========================

function updateDashboardStats() {

    const statCards =
        document.querySelectorAll(".stat-card");


    if (statCards.length < 4) return;


    // =========================
    // TOTAL PRODUCTS
    // =========================

    const adminProducts =
        JSON.parse(
            localStorage.getItem("adminProducts")
        ) || [];


    statCards[0]
        .querySelector("h2")
        .textContent =
        adminProducts.length;


    // =========================
    // TOTAL ORDERS
    // =========================

    statCards[1]
        .querySelector("h2")
        .textContent =
        orders.length;


    // =========================
    // PENDING ORDERS
    // =========================

    const pendingOrders =
        orders.filter(
            order =>
                order.status === "Pending"
        );


    statCards[2]
        .querySelector("h2")
        .textContent =
        pendingOrders.length;


    // =========================
    // TOTAL SALES
    // =========================

    const totalSales =
        orders.reduce(
            (total, order) =>
                total + Number(order.total),
            0
        );


    statCards[3]
        .querySelector("h2")
        .textContent =
        `₦${totalSales.toLocaleString()}`;

}


// =========================
// INITIAL LOAD
// =========================

getOrders();


// =========================
// LOGOUT
// =========================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "adminLoggedIn"
            );


            window.location.href =
                "admin-login.html";

        }
    );

}