// Checkout, page 6
// checkout.js
// checkout.css

import { calculateCartTotal } from "./cart-utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const totalText = document.getElementById("cart-total");
  if (totalText) {
    const total = calculateCartTotal();
    totalText.textContent = total.toFixed(2);
  }
});
