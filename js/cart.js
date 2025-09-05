// Cart, page 5
// connects to:
//  index.html page 1,
//  product-detail page 2,
// checkout.html

// cart.js
document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  // Clear cart button
  document.getElementById("clearCartBtn").addEventListener("click", () => {
    localStorage.removeItem("cart");
    renderCart();
  });
});

function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalText = document.getElementById("cart-total");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalText.textContent = "0.00";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const price =
      item.discountedPrice && item.discountedPrice < item.price
        ? item.discountedPrice
        : item.price;

    const subtotal = price * item.quantity;
    total += subtotal;

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = `
      <p>${item.title}</p>
      <p>Price: $${price.toFixed(2)}</p>
      <label>Qty:
      <input type="number" min="1" value="${
        item.quantity
      }" data-index="${index} class="qty-input"></label>
      <p>Subtotal: $${subtotal.toFixed(2)}</p>
      <button class="remove-btn" data-index="${index}">Remove</button>`;
    cartItemsContainer.appendChild(itemDiv);
  });

  totalText.textContent = total.toFixed(2);

  // Quantity update
  document.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const i = e.target.getAttribute("data-index");
      const newQty = Math.max(1, parseInt(e.target.value));
      cart[i].quantity = newQty;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });

  // Remove item
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const i = e.target.getAttribute("data-index");
      cart.splice(i, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });
}

import { renderCartPage, clearCart } from "./cart-utils.js";

document.addEventListener("DOMContentLoaded", () => {
  renderCartPage();

  const clearBtn = document.createElement("button");
  clearBtn.textContent = "Clear Cart";
  clearBtn.addEventListener("click", clearCart);

  const checkoutBtn = document.createElement("button");
  checkoutBtn.textContent = "Proceed to Checkout";
  checkoutBtn.addEventListener("click", () => {
    window.location.href = "checkout/index.html";
  });

  document.querySelector(".main-page").appendChild(clearBtn);
  document.querySelector(".main-page").appendChild(checkoutBtn);
});
