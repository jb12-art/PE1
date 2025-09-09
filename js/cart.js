// Cart, page 5
// connects to:
//  index.html page 1,
//  product-detail page 2,
// checkout.html

// cart.js
// const container = document.querySelector("#productContainer");
// const loadingIndicator = document.querySelector("#loadingIndicator");

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

    // Create cart box items
    const box = document.createElement("div");
    box.classList.add("cart-item");

    const image = document.createElement("img");
    image.className = "image-cart";
    image.src = item.image || "images/placeholder.png";
    image.alt = item.title;

    const content = document.createElement("div");
    content.className = "content-cart";

    const title = document.createElement("h2");
    title.className = "title-cart";
    title.textContent = item.title;

    const description = document.createElement("p");
    description.className = "description-cart";
    description.textContent = item.description || "";

    const priceEl = document.createElement("p");
    priceEl.textContent = `Price: $${price.toFixed(2)}`;

    const qtyLabel = document.createElement("label");
    qtyLabel.textContent = "Qty: ";

    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.min = "1";
    qtyInput.value = item.quantity;
    qtyInput.dataset.index = index;
    qtyInput.className = "qty-input";

    qtyLabel.appendChild(qtyInput);

    const subtotalEl = document.createElement("p");
    subtotalEl.textContent = `Subtotal: $${subtotal.toFixed(2)}`;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-button";
    removeBtn.textContent = "Remove";
    removeBtn.setAttribute("data-index", index);

    // Assemble content
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(priceEl);
    content.appendChild(qtyLabel);
    content.appendChild(subtotalEl);
    content.appendChild(removeBtn);

    box.appendChild(image);
    box.appendChild(content);

    cartItemsContainer.appendChild(box);
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
  document.querySelectorAll(".remove-button").forEach((btn) => {
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

  const clearBtn = document.getElementById("clearCartBtn");
  clearBtn.textContent = "Clear Cart";
  clearBtn.addEventListener("click", clearCart);

  const checkoutBtn = document.getElementById("checkboxBtn");
  checkoutBtn.textContent = "Proceed to Checkout";
  checkoutBtn.addEventListener("click", () => {
    window.location.href = "checkout.html";
  });

  document.querySelector(".main-page").appendChild(clearBtn);
  document.querySelector(".main-page").appendChild(checkoutBtn);
});
