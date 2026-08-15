if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admin-login.html";
}
// =========================
// GET ORDERS
// =========================

let orders =
    JSON.parse(localStorage.getItem("orders")) || [];


// =========================
// ELEMENTS
// =========================

const customersTableBody =
    document.getElementById("customersTableBody");

const emptyCustomers =
    document.getElementById("emptyCustomers");


// =========================
// GET CUSTOMERS
// =========================

function getCustomers() {

    const customers = {};


    orders.forEach(order => {

        const customer =
            order.customer;


        // Use phone number to identify customer

        const customerKey =
            customer.phone;


        if (!customers[customerKey]) {

            customers[customerKey] = {

                name: customer.name,

                phone: customer.phone,

                email: customer.email || "Not provided",

                orders: 0,

                totalSpent: 0,

                city: customer.city,

                state: customer.state

            };

        }


        // Count orders

        customers[customerKey].orders += 1;


        // Add money spent

        customers[customerKey].totalSpent +=
            Number(order.total);

    });


    return Object.values(customers);

}


// =========================
// DISPLAY CUSTOMERS
// =========================

function displayCustomers() {

    if (!customersTableBody) return;


    customersTableBody.innerHTML = "";


    const customers =
        getCustomers();


    // =========================
    // NO CUSTOMERS
    // =========================

    if (customers.length === 0) {

        if (emptyCustomers) {

            emptyCustomers.style.display =
                "block";

        }

        return;
    }


    if (emptyCustomers) {

        emptyCustomers.style.display =
            "none";

    }


    // =========================
    // DISPLAY CUSTOMERS
    // =========================

    customers.forEach((customer, index) => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <strong>
                    ${customer.name}
                </strong>

            </td>


            <td>

                ${customer.phone}

            </td>


            <td>

                ${customer.email}

            </td>


            <td>

                ${customer.orders}

            </td>


            <td>

                ₦${customer.totalSpent.toLocaleString()}

            </td>


            <td>

                <button
                    class="view-order-btn"
                    onclick="viewCustomer(${index})"
                >

                    View

                </button>

            </td>

        `;


        customersTableBody.appendChild(row);


        // =========================
        // CUSTOMER DETAILS
        // =========================

        const detailsRow =
            document.createElement("tr");


        detailsRow.classList.add(
            "customer-details"
        );


        detailsRow.id =
            `customer-details-${index}`;


        detailsRow.innerHTML = `

            <td colspan="6">

                <div class="order-details-content">

                    <h4>
                        Customer Details
                    </h4>


                    <p>

                        <strong>Name:</strong>

                        ${customer.name}

                    </p>


                    <p>

                        <strong>Phone:</strong>

                        ${customer.phone}

                    </p>


                    <p>

                        <strong>Email:</strong>

                        ${customer.email}

                    </p>


                    <p>

                        <strong>Location:</strong>

                        ${customer.city},
                        ${customer.state}

                    </p>


                    <p>

                        <strong>Total Orders:</strong>

                        ${customer.orders}

                    </p>


                    <p>

                        <strong>Total Spent:</strong>

                        ₦${customer.totalSpent.toLocaleString()}

                    </p>

                </div>

            </td>

        `;


        customersTableBody.appendChild(
            detailsRow
        );

    });

}


// =========================
// VIEW CUSTOMER
// =========================

function viewCustomer(index) {

    const details =
        document.getElementById(
            `customer-details-${index}`
        );


    if (!details) return;


    details.classList.toggle("show");

}


// =========================
// INITIAL LOAD
// =========================

displayCustomers();