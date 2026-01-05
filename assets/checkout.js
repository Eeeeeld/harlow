// Load cart from localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// Product referencexs
const products = [
    { id: 1, title: "Daiquiri Dress", price: 119000 },
    { id: 2, title: "Clover Baby ~ Tanks", price: 139000 },
    { id: 3, title: "Chasing Denim", price: 99000 },
    { id: 4, title: "Southside Beach Shorts", price: 109000 }
];

// DOM elements
const summaryItems = document.getElementById("summary-items");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const placeOrderBtn = document.getElementById("place-order");

const SHIPPING_FEE = 10000;


//RENDER ORDER SUMMARY
function renderSummary() {
    if (cart.length === 0) {
        summaryItems.innerHTML = "<p>Your cart is empty.</p>";
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = "Cart is Empty";
        placeOrderBtn.style.opacity = "0.5";
        return;
    }

    let subtotal = 0;
    summaryItems.innerHTML = "";

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        const row = document.createElement("p");
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.innerHTML = `
            <span>${product.title} × ${item.quantity}</span>
            <strong>Rp ${itemTotal.toLocaleString()}</strong>
        `;
        summaryItems.appendChild(row);
    });

    subtotalEl.textContent = `Rp ${subtotal.toLocaleString()}`;
    totalEl.textContent = `Rp ${(subtotal + SHIPPING_FEE).toLocaleString()}`;
}

document.addEventListener("DOMContentLoaded", renderSummary);
