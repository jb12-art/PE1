// Cart, page 5
// connects to:
//  index.html page 1,
//  product-detail page 2,
// checkout.html

// cart.js
// const container = document.querySelector("#productContainer");
// const loadingIndicator = document.querySelector("#loadingIndicator");

// Cart page logic - uses shared cart-utils.js
import { renderCartPage, clearCart } from "./cart-utils.js";

document.addEventListener("DOMContentLoaded", () => {
  // Render cart items on page load
  renderCartPage();

  // Clear cart button
  const clearBtn = document.getElementById("clearCartBtn");
  if (clearBtn) {
    clearBtn.textContent = "Clear Cart";
    clearBtn.addEventListener("click", clearCart);
  }

  // Proceed to checkout button
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.textContent = "Proceed to Checkout";
    checkoutBtn.addEventListener("click", () => {
      window.location.href = "checkout.html";
    });
  }
});
