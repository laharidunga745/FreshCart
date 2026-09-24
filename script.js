/* =====================================================
   FRESHCART - COMPLETE JAVASCRIPT
   USER MODULE + ADMIN MODULE
===================================================== */


/* =====================================================
   PRODUCT DATA
===================================================== */

const defaultProducts = [

    {
        id: 1,
        name: "Tomatoes",
        category: "Vegetables",
        price: 45,
        unit: "1 kg",
        emoji: "🍅",
        stock: 20,
        offer: 10
    },

    {
        id: 2,
        name: "Potatoes",
        category: "Vegetables",
        price: 35,
        unit: "1 kg",
        emoji: "🥔",
        stock: 25,
        offer: 5
    },

    {
        id: 3,
        name: "Apples",
        category: "Fruits",
        price: 160,
        unit: "1 kg",
        emoji: "🍎",
        stock: 15,
        offer: 15
    },

    {
        id: 4,
        name: "Bananas",
        category: "Fruits",
        price: 60,
        unit: "12 pcs",
        emoji: "🍌",
        stock: 18,
        offer: 10
    },

    {
        id: 5,
        name: "Milk",
        category: "Dairy",
        price: 30,
        unit: "500 ml",
        emoji: "🥛",
        stock: 10,
        offer: 5
    },

    {
        id: 6,
        name: "Bread",
        category: "Bakery",
        price: 45,
        unit: "1 pack",
        emoji: "🍞",
        stock: 12
    },

    {
        id: 7,
        name: "Rice",
        category: "Staples",
        price: 420,
        unit: "5 kg",
        emoji: "🍚",
        stock: 8
    },

    {
        id: 8,
        name: "Orange Juice",
        category: "Beverages",
        price: 110,
        unit: "1 L",
        emoji: "🧃",
        stock: 9
    },

    {
        id: 9,
        name: "Curd",
        category: "Dairy",
        price: 40,
        unit: "500 g",
        emoji: "🥣",
        stock: 10
    },

    {
        id: 10,
        name: "Oranges",
        category: "Fruits",
        price: 90,
        unit: "1 kg",
        emoji: "🍊",
        stock: 15
    },

    {
        id: 11,
        name: "Peas",
        category: "Vegetables",
        price: 60,
        unit: "1 kg",
        emoji: "🫛",
        stock: 12
    },

    {
        id: 12,
        name: "Grapes",
        category: "Fruits",
        price: 120,
        unit: "1 kg",
        emoji: "🍇",
        stock: 14
    },

    {
        id: 13,
        name: "Wheat",
        category: "Staples",
        price: 55,
        unit: "1 kg",
        emoji: "🌾",
        stock: 20
    },

    {
        id: 14,
        name: "Cake",
        category: "Bakery",
        price: 250,
        unit: "1 pc",
        emoji: "🍰",
        stock: 8
    },

    {
        id: 15,
        name: "Drinks",
        category: "Beverages",
        price: 60,
        unit: "1 bottle",
        emoji: "🥤",
        stock: 15
    },

    {
        id: 16,
        name: "Chocolates",
        category: "Snacks",
        price: 100,
        unit: "1 pack",
        emoji: "🍫",
        stock: 12
    }

];


/* =====================================================
   LOAD PRODUCTS
===================================================== */

let savedProducts =
    JSON.parse(localStorage.getItem("products"));

let products =
    Array.isArray(savedProducts) && savedProducts.length > 0
        ? savedProducts
        : defaultProducts;

localStorage.setItem(
    "products",
    JSON.stringify(products)
);


/* =====================================================
   CART / WISHLIST / ORDERS
===================================================== */

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

let wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

let orders =
    JSON.parse(localStorage.getItem("orders")) || [];

let currentCategory = "All";

let couponPercent = 0;

let trackingStep =
    Number(localStorage.getItem("trackingStep") || 0);


/* =====================================================
   HTML ELEMENTS
===================================================== */

const productGrid =
    document.getElementById("productGrid");

const recommendedProducts =
    document.getElementById("recommendedProducts");

const categoryButtons =
    document.getElementById("categoryButtons");

const searchInput =
    document.getElementById("searchInput");

const cartDrawer =
    document.getElementById("cartDrawer");

const overlay =
    document.getElementById("overlay");


/* =====================================================
   MONEY
===================================================== */

function money(number) {

    return Math.round(number);

}


/* =====================================================
   PRODUCT CARD
===================================================== */

function productCard(product) {

    const unavailable =
        product.stock <= 0;

    const discountPrice =
        product.offer
            ? Math.round(
                product.price -
                (product.price * product.offer / 100)
            )
            : product.price;

    return `

        <article class="product-card">

            ${
                product.offer
                    ? `
                    <span class="offer-badge">
                        ${product.offer}% OFF
                    </span>
                    `
                    : ""
            }

            <div class="product-emoji">
                ${product.emoji || "🛒"}
            </div>

            <h3>
                ${product.name}
            </h3>

            <p class="meta">
                ${product.category} • ${product.unit}
            </p>

            <p class="meta">

                ${
                    unavailable
                        ? "Out of stock"
                        : product.stock + " in stock"
                }

            </p>

            <div class="product-bottom">

                <div class="price-area">

                    ${
                        product.offer
                            ? `

                                <span class="old-price">
                                    ₹${product.price}
                                </span>

                                <span class="price">
                                    ₹${discountPrice}
                                </span>

                            `
                            : `

                                <span class="price">
                                    ₹${product.price}
                                </span>

                            `
                    }

                </div>

                <button
                    class="wishlist-btn"
                    onclick="toggleWishlist(${product.id})">

                    ${
                        wishlist.includes(product.id)
                            ? "❤️"
                            : "🤍"
                    }

                </button>

                <button
                    class="add-btn ${unavailable ? "out" : ""}"
                    ${unavailable ? "disabled" : ""}
                    onclick="addToCart(${product.id})">

                    ${
                        unavailable
                            ? "Unavailable"
                            : "Add"
                    }

                </button>

            </div>

        </article>

    `;
}


/* =====================================================
   CATEGORIES
===================================================== */

function renderCategories() {

    if (!categoryButtons) {
        return;
    }

    const categories = [
        "All",
        ...new Set(
            products.map(
                product => product.category
            )
        )
    ];

    categoryButtons.innerHTML =
        categories.map(category => `

            <button
                class="category-btn
                ${currentCategory === category ? "active" : ""}"
                onclick="filterCategory('${category}')">

                ${category}

            </button>

        `).join("");

}


/* =====================================================
   PRODUCTS
===================================================== */

function renderProducts() {

    if (!productGrid) {
        return;
    }

    const searchText =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

    const filtered =
        products.filter(product =>

            (
                currentCategory === "All" ||
                product.category === currentCategory
            )

            &&

            (
                product.name
                    .toLowerCase()
                    .includes(searchText)

                ||

                product.category
                    .toLowerCase()
                    .includes(searchText)
            )

        );


    productGrid.innerHTML =

        filtered.length

            ? filtered
                .map(productCard)
                .join("")

            : "<p>No products found.</p>";


    const resultText =
        document.getElementById(
            "productResultText"
        );

    if (resultText) {

        resultText.textContent =
            `${filtered.length} product(s)`;

    }


    if (recommendedProducts) {

        const recommended =
            products
                .filter(product => product.stock > 0)
                .slice(0, 4);

        recommendedProducts.innerHTML =
            recommended
                .map(productCard)
                .join("");

    }

}


/* =====================================================
   FILTER CATEGORY
===================================================== */

function filterCategory(category) {

    currentCategory = category;

    renderCategories();

    renderProducts();

}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(id) {

    const product =
        products.find(
            product => product.id === id
        );

    if (!product || product.stock <= 0) {
        return;
    }


    const item =
        cart.find(
            item => item.id === id
        );


    if (item) {

        if (item.qty < product.stock) {

            item.qty++;

        } else {

            alert("Maximum available stock reached.");

        }

    } else {

        cart.push({
            id: id,
            qty: 1
        });

    }


    saveCart();

    renderCart();

}


/* =====================================================
   WISHLIST
===================================================== */

function toggleWishlist(id) {

    if (wishlist.includes(id)) {

        wishlist =
            wishlist.filter(
                item => item !== id
            );

    } else {

        wishlist.push(id);

    }


    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );


    renderProducts();

}


/* =====================================================
   CHANGE QUANTITY
===================================================== */

function changeQty(id, delta) {

    const item =
        cart.find(
            item => item.id === id
        );

    const product =
        products.find(
            product => product.id === id
        );


    if (!item || !product) {
        return;
    }


    item.qty += delta;


    if (item.qty <= 0) {

        cart =
            cart.filter(
                item => item.id !== id
            );

    }

    else if (item.qty > product.stock) {

        item.qty =
            product.stock;

        alert("Stock limit reached.");

    }


    saveCart();

    renderCart();

}


/* =====================================================
   REMOVE ITEM
===================================================== */

function removeItem(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );

    saveCart();

    renderCart();

}


/* =====================================================
   SAVE CART
===================================================== */

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

    const wrap =
        document.getElementById("cartItems");

    if (!wrap) {
        return;
    }


    const cartCount =
        cart.reduce(
            (sum, item) =>
                sum + item.qty,
            0
        );


    const countElement =
        document.getElementById("cartCount");

    if (countElement) {

        countElement.textContent =
            cartCount;

    }


    if (!cart.length) {

        wrap.innerHTML =
            "<p>Your cart is empty.</p>";

    }

    else {

        wrap.innerHTML =
            cart.map(item => {

                const product =
                    products.find(
                        p => p.id === item.id
                    );


                if (!product) {
                    return "";
                }


                return `

                    <div class="cart-item">

                        <div>

                            <strong>
                                ${product.name}
                            </strong>

                            <p>
                                ₹${product.price}
                                × ${item.qty}
                            </p>

                            <div class="qty">

                                <button
                                    onclick="changeQty(${product.id}, -1)">
                                    −
                                </button>

                                <span>
                                    ${item.qty}
                                </span>

                                <button
                                    onclick="changeQty(${product.id}, 1)">
                                    +
                                </button>

                            </div>

                        </div>


                        <div>

                            <strong>
                                ₹${product.price * item.qty}
                            </strong>

                            <br>

                            <button
                                class="remove-btn"
                                onclick="removeItem(${product.id})">

                                Remove

                            </button>

                        </div>

                    </div>

                `;

            }).join("");

    }


    const subtotal =
        cart.reduce(
            (sum, item) => {

                const product =
                    products.find(
                        p => p.id === item.id
                    );

                return sum +
                    (
                        product
                            ? product.price * item.qty
                            : 0
                    );

            },
            0
        );


    const discount =
        subtotal *
        couponPercent /
        100;


    const subtotalElement =
        document.getElementById("subtotal");

    const discountElement =
        document.getElementById("discount");

    const totalElement =
        document.getElementById("total");


    if (subtotalElement) {

        subtotalElement.textContent =
            money(subtotal);

    }

    if (discountElement) {

        discountElement.textContent =
            money(discount);

    }

    if (totalElement) {

        totalElement.textContent =
            money(subtotal - discount);

    }

}


/* =====================================================
   COUPON
===================================================== */

const applyCouponBtn =
    document.getElementById("applyCouponBtn");


if (applyCouponBtn) {

    applyCouponBtn.addEventListener(
        "click",
        function () {

            const input =
                document.getElementById("couponInput");

            const message =
                document.getElementById("couponMessage");


            const code =
                input.value
                    .trim()
                    .toUpperCase();


            if (code === "SAVE10") {

                couponPercent = 10;

                message.textContent =
                    "10% discount applied!";

                message.style.color =
                    "green";

            }

            else {

                couponPercent = 0;

                message.textContent =
                    "Invalid coupon. Try SAVE10.";

                message.style.color =
                    "red";

            }


            renderCart();

        }
    );

}


/* =====================================================
   CHECKOUT
===================================================== */

const checkoutBtn =
    document.getElementById("checkoutBtn");


if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        function () {

            if (!cart.length) {

                alert(
                    "Add at least one product."
                );

                return;

            }


            const subtotal =
                cart.reduce(
                    (sum, item) => {

                        const product =
                            products.find(
                                p => p.id === item.id
                            );

                        return sum +
                            (
                                product
                                    ? product.price * item.qty
                                    : 0
                            );

                    },
                    0
                );


            const discount =
                subtotal *
                couponPercent /
                100;


            const finalTotal =
                Math.round(
                    subtotal - discount
                );


            /* UPDATE STOCK */

            for (const item of cart) {

                const product =
                    products.find(
                        p => p.id === item.id
                    );


                if (product) {

                    product.stock =
                        Math.max(
                            0,
                            product.stock - item.qty
                        );

                }

            }


            localStorage.setItem(
                "products",
                JSON.stringify(products)
            );


            /* CREATE ORDER ID */

            const orderId =
                "FC" +
                Date.now()
                    .toString()
                    .slice(-6);


            /* CURRENT USER */

            const currentUser =
                JSON.parse(
                    localStorage.getItem("user")
                );


            /* CREATE ORDER */

            const newOrder = {

                orderId: orderId,

                userName:
                    currentUser
                        ? currentUser.name
                        : "Guest",

                userEmail:
                    currentUser
                        ? currentUser.email
                        : "Guest",

                total: finalTotal,

                status: "Order Placed",

                date:
                    new Date()
                        .toLocaleDateString()

            };


            orders.unshift(newOrder);


            localStorage.setItem(
                "orders",
                JSON.stringify(orders)
            );


            /* TRACKING */

            localStorage.setItem(
                "orderId",
                orderId
            );

            localStorage.setItem(
                "trackingStep",
                "0"
            );

            trackingStep = 0;


            /* CLEAR CART */

            cart = [];

            couponPercent = 0;

            saveCart();

            renderCart();

            renderProducts();

            closeCart();


            alert(
                `Order placed successfully! Order ID: ${orderId}`
            );


            openTracking();

        }
    );

}


/* =====================================================
   CART OPEN
===================================================== */

function openCart() {

    if (!cartDrawer || !overlay) {
        return;
    }

    cartDrawer.classList.add("open");

    overlay.classList.add("show");

}


/* =====================================================
   CART CLOSE
===================================================== */

function closeCart() {

    if (!cartDrawer || !overlay) {
        return;
    }

    cartDrawer.classList.remove("open");

    overlay.classList.remove("show");

}


/* =====================================================
   CART BUTTONS
===================================================== */

const cartBtn =
    document.getElementById("cartBtn");

const closeCartBtn =
    document.getElementById("closeCartBtn");


if (cartBtn) {

    cartBtn.onclick =
        openCart;

}


if (closeCartBtn) {

    closeCartBtn.onclick =
        closeCart;

}


/* =====================================================
   OVERLAY
===================================================== */

if (overlay) {

    overlay.onclick = function () {

        closeCart();


        const trackingModal =
            document.getElementById("trackingModal");

        const loginModal =
            document.getElementById("loginModal");

        const registerModal =
            document.getElementById("registerModal");

        const profileModal =
            document.getElementById("profileModal");

        const adminLoginModal =
            document.getElementById("adminLoginModal");


        if (trackingModal) {

            trackingModal.classList.remove("show");

        }

        if (loginModal) {

            loginModal.classList.remove("show");

        }

        if (registerModal) {

            registerModal.classList.remove("show");

        }

        if (profileModal) {

            profileModal.classList.remove("show");

        }

        if (adminLoginModal) {

            adminLoginModal.classList.remove("show");

        }

    };

}


/* =====================================================
   TRACKING
===================================================== */

function openTracking() {

    const modal =
        document.getElementById("trackingModal");


    if (!modal) {
        return;
    }


    const orderId =
        localStorage.getItem("orderId");


    const trackingOrderId =
        document.getElementById("trackingOrderId");


    if (trackingOrderId) {

        trackingOrderId.textContent =
            orderId
                ? `Order ID: ${orderId}`
                : "No active order yet.";

    }


    updateTrackingUI();


    modal.classList.add("show");

    overlay.classList.add("show");

}


/* =====================================================
   CLOSE TRACKING
===================================================== */

const closeTrackingBtn =
    document.getElementById("closeTrackingBtn");


if (closeTrackingBtn) {

    closeTrackingBtn.onclick =
        function () {

            document
                .getElementById("trackingModal")
                .classList.remove("show");

            overlay.classList.remove("show");

        };

}


/* =====================================================
   ADVANCE TRACKING
===================================================== */

const advanceTrackingBtn =
    document.getElementById("advanceTrackingBtn");


if (advanceTrackingBtn) {

    advanceTrackingBtn.onclick =
        function () {

            if (!localStorage.getItem("orderId")) {

                alert(
                    "Place an order first."
                );

                return;

            }


            trackingStep =
                Math.min(
                    3,
                    trackingStep + 1
                );


            localStorage.setItem(
                "trackingStep",
                String(trackingStep)
            );


            updateTrackingUI();

        };

}


/* =====================================================
   UPDATE TRACKING UI
===================================================== */

function updateTrackingUI() {

    document
        .querySelectorAll(".track-step")
        .forEach(
            (element, index) => {

                element.classList.toggle(
                    "active",
                    index <= trackingStep
                );

            }
        );

}


/* =====================================================
   SEARCH
===================================================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderProducts
    );

}


/* =====================================================
   LOGIN / REGISTER
===================================================== */

const loginModal =
    document.getElementById("loginModal");

const registerModal =
    document.getElementById("registerModal");


/* =====================================================
   PROFILE ELEMENTS
===================================================== */

const profileBtn =
    document.getElementById("profileBtn");

const profileModal =
    document.getElementById("profileModal");

const closeProfileBtn =
    document.getElementById("closeProfileBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const myOrders =
    document.getElementById("myOrders");


/* =====================================================
   PROFILE BUTTON
===================================================== */

function updateProfileButton() {

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );


    const loggedIn =
        localStorage.getItem("loggedIn") === "true";


    const loginBtn =
        document.getElementById("loginBtn");


    if (loggedIn && user) {

        if (loginBtn) {

            loginBtn.style.display =
                "none";

        }


        if (profileBtn) {

            profileBtn.style.display =
                "inline-block";

        }

    }

    else {

        if (loginBtn) {

            loginBtn.style.display =
                "inline-block";

        }


        if (profileBtn) {

            profileBtn.style.display =
                "none";

        }

    }

}


/* =====================================================
   RENDER MY ORDERS
   USER-WISE ORDER FILTER
===================================================== */

function renderOrders() {

    if (!myOrders) {
        return;
    }


    /* GET CURRENT LOGGED-IN USER */

    const currentUser =
        JSON.parse(
            localStorage.getItem("user")
        );


    if (!currentUser) {

        myOrders.innerHTML =
            "<p>Please login to view your orders.</p>";

        return;

    }


    /*

       IMPORTANT:

       Show only orders belonging to
       the current user's email.

    */

    const myUserOrders =
        orders.filter(
            order =>
                order.userEmail &&
                order.userEmail === currentUser.email
        );


    /* NO ORDERS */

    if (myUserOrders.length === 0) {

        myOrders.innerHTML =
            "<p>No orders yet.</p>";

        return;

    }


    /* SHOW ONLY CURRENT USER ORDERS */

    myOrders.innerHTML =
        myUserOrders.map(order => `

            <div class="order-card">

                <strong>
                    Order ID: ${order.orderId}
                </strong>

                <p>
                    Total: ₹${order.total}
                </p>

                <p>
                    Status: ${order.status}
                </p>

                <p>
                    Date: ${order.date}
                </p>

                <button
                    class="track-order-btn"
                    onclick="trackOrder('${order.orderId}')">

                    🚚 Track Order

                </button>

            </div>

        `).join("");

}


/* =====================================================
   TRACK ORDER FROM PROFILE
===================================================== */

function trackOrder(orderId) {

    localStorage.setItem(
        "orderId",
        orderId
    );


    trackingStep =
        Number(
            localStorage.getItem("trackingStep") || 0
        );


    openTracking();

}


/* =====================================================
   OPEN PROFILE
===================================================== */

function openProfile() {

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );


    if (!user) {
        return;
    }


    if (profileName) {

        profileName.textContent =
            `Name: ${user.name}`;

    }


    if (profileEmail) {

        profileEmail.textContent =
            `Email: ${user.email}`;

    }


    /* IMPORTANT:
       Render only current user's orders */

    renderOrders();


    if (profileModal) {

        profileModal.classList.add("show");

    }


    if (overlay) {

        overlay.classList.add("show");

    }

}


if (profileBtn) {

    profileBtn.onclick =
        openProfile;

}


/* =====================================================
   CLOSE PROFILE
===================================================== */

if (closeProfileBtn) {

    closeProfileBtn.onclick =
        function () {

            profileModal.classList.remove(
                "show"
            );

            overlay.classList.remove(
                "show"
            );

        };

}


/* =====================================================
   LOGOUT
===================================================== */

if (logoutBtn) {

    logoutBtn.onclick =
        function () {

            localStorage.setItem(
                "loggedIn",
                "false"
            );


            profileModal.classList.remove(
                "show"
            );

            overlay.classList.remove(
                "show"
            );


            updateProfileButton();


            alert(
                "Logged out successfully!"
            );

        };

}


/* =====================================================
   OPEN LOGIN
===================================================== */

const loginBtn =
    document.getElementById("loginBtn");


if (loginBtn) {

    loginBtn.onclick =
        function () {

            loginModal.classList.add(
                "show"
            );

            overlay.classList.add(
                "show"
            );

        };

}


/* =====================================================
   CLOSE LOGIN
===================================================== */

const closeLoginBtn =
    document.getElementById("closeLoginBtn");


if (closeLoginBtn) {

    closeLoginBtn.onclick =
        function () {

            loginModal.classList.remove(
                "show"
            );

            overlay.classList.remove(
                "show"
            );

        };

}


/* =====================================================
   SHOW REGISTER
===================================================== */

const showRegisterBtn =
    document.getElementById("showRegisterBtn");


if (showRegisterBtn) {

    showRegisterBtn.onclick =
        function () {

            loginModal.classList.remove(
                "show"
            );

            registerModal.classList.add(
                "show"
            );

        };

}


/* =====================================================
   CLOSE REGISTER
===================================================== */

const closeRegisterBtn =
    document.getElementById("closeRegisterBtn");


if (closeRegisterBtn) {

    closeRegisterBtn.onclick =
        function () {

            registerModal.classList.remove(
                "show"
            );

            overlay.classList.remove(
                "show"
            );

        };

}


/* =====================================================
   REGISTER
===================================================== */

const registerSubmitBtn =
    document.getElementById("registerSubmitBtn");


if (registerSubmitBtn) {

    registerSubmitBtn.onclick =
        function () {

            const name =
                document.getElementById(
                    "registerName"
                ).value.trim();


            const email =
                document.getElementById(
                    "registerEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "registerPassword"
                ).value;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            if (!name || !email || !password) {

                message.textContent =
                    "Please fill all fields.";

                message.style.color =
                    "red";

                return;

            }


            const user = {

                name: name,

                email: email,

                password: password

            };


            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            /* SAVE USERS FOR ADMIN */

            let users =
                JSON.parse(
                    localStorage.getItem("users")
                ) || [];


            const existingUser =
                users.find(
                    u => u.email === email
                );


            if (!existingUser) {

                users.push({
                    name: name,
                    email: email,
                    password: password
                });

            }


            localStorage.setItem(
                "users",
                JSON.stringify(users)
            );


            message.textContent =
                "Registration successful!";

            message.style.color =
                "green";


            setTimeout(
                function () {

                    registerModal.classList.remove(
                        "show"
                    );

                    loginModal.classList.add(
                        "show"
                    );

                },
                800
            );

        };

}


/* =====================================================
   LOGIN
===================================================== */

const loginSubmitBtn =
    document.getElementById("loginSubmitBtn");


if (loginSubmitBtn) {

    loginSubmitBtn.onclick =
        function () {

            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            const savedUser =
                JSON.parse(
                    localStorage.getItem("user")
                );


            if (!savedUser) {

                message.textContent =
                    "Please register first.";

                message.style.color =
                    "red";

                return;

            }


            if (
                email === savedUser.email &&
                password === savedUser.password
            ) {

                localStorage.setItem(
                    "loggedIn",
                    "true"
                );


                message.textContent =
                    `Welcome ${savedUser.name}!`;

                message.style.color =
                    "green";


                updateProfileButton();


                setTimeout(
                    function () {

                        loginModal.classList.remove(
                            "show"
                        );

                        overlay.classList.remove(
                            "show"
                        );

                    },
                    800
                );

            }

            else {

                message.textContent =
                    "Invalid email or password.";

                message.style.color =
                    "red";

            }

        };

}


/* =====================================================
   SCROLL FUNCTIONS
===================================================== */

function scrollToProducts() {

    const section =
        document.getElementById(
            "productsSection"
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


function scrollToCategories() {

    const section =
        document.getElementById(
            "categoriesSection"
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =====================================================
   ADMIN MODULE
===================================================== */


/* =====================================================
   ADMIN ELEMENTS
===================================================== */

const adminBtn =
    document.getElementById("adminBtn");

const adminLoginModal =
    document.getElementById("adminLoginModal");

const adminDashboard =
    document.getElementById("adminDashboard");


/* =====================================================
   ADMIN LOGIN
===================================================== */

if (adminBtn) {

    adminBtn.onclick =
        function () {

            if (
                localStorage.getItem(
                    "adminLoggedIn"
                ) === "true"
            ) {

                openAdminDashboard();

            }

            else {

                adminLoginModal.classList.add(
                    "show"
                );

                overlay.classList.add(
                    "show"
                );

            }

        };

}


/* =====================================================
   CLOSE ADMIN LOGIN
===================================================== */

const closeAdminLoginBtn =
    document.getElementById(
        "closeAdminLoginBtn"
    );


if (closeAdminLoginBtn) {

    closeAdminLoginBtn.onclick =
        function () {

            adminLoginModal.classList.remove(
                "show"
            );

            overlay.classList.remove(
                "show"
            );

        };

}


/* =====================================================
   ADMIN LOGIN SUBMIT
===================================================== */

const adminLoginSubmitBtn =
    document.getElementById(
        "adminLoginSubmitBtn"
    );


if (adminLoginSubmitBtn) {

    adminLoginSubmitBtn.onclick =
        function () {

            const email =
                document.getElementById(
                    "adminEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "adminPassword"
                ).value;


            const message =
                document.getElementById(
                    "adminLoginMessage"
                );


            /* DEMO ADMIN CREDENTIALS */

            if (
                email === "admin@freshcart.com" &&
                password === "admin123"
            ) {

                localStorage.setItem(
                    "adminLoggedIn",
                    "true"
                );


                message.textContent =
                    "Admin login successful!";

                message.style.color =
                    "green";


                setTimeout(
                    function () {

                        adminLoginModal.classList.remove(
                            "show"
                        );

                        overlay.classList.remove(
                            "show"
                        );

                        openAdminDashboard();

                    },
                    500
                );

            }

            else {

                message.textContent =
                    "Invalid admin email or password.";

                message.style.color =
                    "red";

            }

        };

}


/* =====================================================
   OPEN ADMIN DASHBOARD
===================================================== */

function openAdminDashboard() {

    if (!adminDashboard) {
        return;
    }


    adminDashboard.style.display =
        "block";


    renderAdminDashboard();


    adminDashboard.scrollIntoView({
        behavior: "smooth"
    });

}


/* =====================================================
   ADMIN DASHBOARD RENDER
===================================================== */

function renderAdminDashboard() {

    if (!adminDashboard) {
        return;
    }


    products =
        JSON.parse(
            localStorage.getItem("products")
        ) || [];


    orders =
        JSON.parse(
            localStorage.getItem("orders")
        ) || [];


    let users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];


    const currentUser =
        JSON.parse(
            localStorage.getItem("user")
        );


    if (
        currentUser &&
        !users.some(
            u => u.email === currentUser.email
        )
    ) {

        users.push(currentUser);

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

    }


    const adminUserCount =
        document.getElementById(
            "adminUserCount"
        );

    const adminProductCount =
        document.getElementById(
            "adminProductCount"
        );

    const adminOrderCount =
        document.getElementById(
            "adminOrderCount"
        );

    const adminSales =
        document.getElementById(
            "adminSales"
        );


    if (adminUserCount) {

        adminUserCount.textContent =
            users.length;

    }


    if (adminProductCount) {

        adminProductCount.textContent =
            products.length;

    }


    if (adminOrderCount) {

        adminOrderCount.textContent =
            orders.length;

    }


    const totalSales =
        orders.reduce(
            (sum, order) =>
                sum + Number(order.total || 0),
            0
        );


    if (adminSales) {

        adminSales.textContent =
            "₹" + totalSales;

    }


    renderAdminUsers();

    renderAdminProducts();

    renderAdminOrders();

}


/* =====================================================
   ADMIN USERS TABLE
===================================================== */

function renderAdminUsers() {

    const table =
        document.getElementById(
            "adminUsersTable"
        );


    if (!table) {
        return;
    }


    let users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];


    const currentUser =
        JSON.parse(
            localStorage.getItem("user")
        );


    if (
        currentUser &&
        !users.some(
            u => u.email === currentUser.email
        )
    ) {

        users.push(currentUser);

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

    }


    if (!users.length) {

        table.innerHTML = `
            <tr>
                <td colspan="3">
                    No registered users.
                </td>
            </tr>
        `;

        return;

    }


    const loggedIn =
        localStorage.getItem(
            "loggedIn"
        ) === "true";


    table.innerHTML =
        users.map(user => `

            <tr>

                <td>
                    ${user.name}
                </td>

                <td>
                    ${user.email}
                </td>

                <td>
                    ${
                        loggedIn &&
                        currentUser &&
                        currentUser.email === user.email
                            ? "🟢 Logged In"
                            : "⚪ Logged Out"
                    }
                </td>

            </tr>

        `).join("");

}


/* =====================================================
   ADMIN PRODUCT TABLE
===================================================== */

function renderAdminProducts() {

    const table =
        document.getElementById(
            "adminProductsTable"
        );


    if (!table) {
        return;
    }


    if (!products.length) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No products available.
                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML =
        products.map(product => `

            <tr>

                <td>
                    ${product.emoji || "🛒"}
                    ${product.name}
                </td>

                <td>
                    ${product.category}
                </td>

                <td>
                    ₹${product.price}
                </td>

                <td>
                    ${product.stock}
                </td>

                <td>

                    <button
                        class="admin-action-btn"
                        onclick="deleteAdminProduct(${product.id})">

                        Delete

                    </button>

                </td>

            </tr>

        `).join("");

}


/* =====================================================
   ADD PRODUCT FROM ADMIN
===================================================== */

const adminAddProductBtn =
    document.getElementById(
        "adminAddProductBtn"
    );


if (adminAddProductBtn) {

    adminAddProductBtn.onclick =
        function () {

            const name =
                document.getElementById(
                    "adminProductName"
                ).value.trim();


            const category =
                document.getElementById(
                    "adminProductCategory"
                ).value.trim();


            const price =
                Number(
                    document.getElementById(
                        "adminProductPrice"
                    ).value
                );


            const stock =
                Number(
                    document.getElementById(
                        "adminProductStock"
                    ).value
                );


            const unit =
                document.getElementById(
                    "adminProductUnit"
                ).value.trim();


            const emoji =
                document.getElementById(
                    "adminProductEmoji"
                ).value.trim();


            if (
                !name ||
                !category ||
                !price ||
                price < 0 ||
                stock < 0 ||
                !unit
            ) {

                alert(
                    "Please fill all product details correctly."
                );

                return;

            }


            const newProduct = {

                id:
                    Date.now(),

                name:
                    name,

                category:
                    category,

                price:
                    price,

                unit:
                    unit,

                emoji:
                    emoji || "🛒",

                stock:
                    stock,

                offer:
                    0

            };


            products.push(
                newProduct
            );


            localStorage.setItem(
                "products",
                JSON.stringify(products)
            );


            document.getElementById(
                "adminProductName"
            ).value = "";

            document.getElementById(
                "adminProductCategory"
            ).value = "";

            document.getElementById(
                "adminProductPrice"
            ).value = "";

            document.getElementById(
                "adminProductStock"
            ).value = "";

            document.getElementById(
                "adminProductUnit"
            ).value = "";

            document.getElementById(
                "adminProductEmoji"
            ).value = "";


            renderAdminDashboard();

            renderCategories();

            renderProducts();


            alert(
                "Product added successfully!"
            );

        };

}


/* =====================================================
   DELETE PRODUCT
===================================================== */

function deleteAdminProduct(id) {

    const product =
        products.find(
            p => p.id === id
        );


    if (!product) {
        return;
    }


    const confirmDelete =
        confirm(
            `Delete ${product.name}?`
        );


    if (!confirmDelete) {
        return;
    }


    products =
        products.filter(
            p => p.id !== id
        );


    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );


    cart =
        cart.filter(
            item => item.id !== id
        );


    saveCart();


    renderAdminDashboard();

    renderCategories();

    renderProducts();

    renderCart();


    alert(
        "Product deleted successfully!"
    );

}


/* =====================================================
   ADMIN ORDERS TABLE
===================================================== */

function renderAdminOrders() {

    const table =
        document.getElementById(
            "adminOrdersTable"
        );


    if (!table) {
        return;
    }


    if (!orders.length) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    No orders yet.
                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML =
        orders.map(order => `

            <tr>

                <td>
                    ${order.orderId}
                </td>

                <td>
                    ${order.userName || "Guest"}
                </td>

                <td>
                    ₹${order.total}
                </td>

                <td>
                    ${order.status}
                </td>

                <td>
                    ${order.date}
                </td>

                <td>

                    <button
                        class="admin-action-btn"
                        onclick="updateOrderStatus('${order.orderId}')">

                        Update

                    </button>

                </td>

            </tr>

        `).join("");

}


/* =====================================================
   UPDATE ORDER STATUS
===================================================== */

function updateOrderStatus(orderId) {

    const order =
        orders.find(
            o => o.orderId === orderId
        );


    if (!order) {
        return;
    }


    const statuses = [
        "Order Placed",
        "Preparing",
        "Out for Delivery",
        "Delivered"
    ];


    const currentIndex =
        statuses.indexOf(
            order.status
        );


    const nextIndex =
        Math.min(
            currentIndex + 1,
            statuses.length - 1
        );


    if (currentIndex === statuses.length - 1) {

        alert(
            "Order is already delivered."
        );

        return;

    }


    order.status =
        statuses[nextIndex];


    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );


    const activeOrderId =
        localStorage.getItem(
            "orderId"
        );


    if (activeOrderId === orderId) {

        localStorage.setItem(
            "trackingStep",
            String(nextIndex)
        );

        trackingStep =
            nextIndex;

    }


    renderAdminDashboard();


    alert(
        `Order status updated to: ${order.status}`
    );

}


/* =====================================================
   ADMIN LOGOUT
===================================================== */

const adminLogoutBtn =
    document.getElementById(
        "adminLogoutBtn"
    );


if (adminLogoutBtn) {

    adminLogoutBtn.onclick =
        function () {

            localStorage.setItem(
                "adminLoggedIn",
                "false"
            );


            if (adminDashboard) {

                adminDashboard.style.display =
                    "none";

            }


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


            alert(
                "Admin logged out successfully!"
            );

        };

}


/* =====================================================
   INITIAL ADMIN STATE
===================================================== */

if (adminDashboard) {

    if (
        localStorage.getItem(
            "adminLoggedIn"
        ) === "true"
    ) {

        adminDashboard.style.display =
            "block";

        renderAdminDashboard();

    }

    else {

        adminDashboard.style.display =
            "none";

    }

}


/* =====================================================
   START WEBSITE
===================================================== */

updateProfileButton();

renderCategories();

renderProducts();

renderCart();