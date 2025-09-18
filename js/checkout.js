// Checkout, page 6
// checkout.js
// checkout.css

import { clearCart } from "./cart-utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const totalText = document.getElementById("cart-total");
  if (totalText) {
    const total = calculateCartTotal();
    totalText.textContent = total.toFixed(2);
  }

  // handle Buy Now Button
  const buyNowBtn = document.getElementById("buyNowBtn");
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      // Clear cart
      clearCart();
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const paymentRadios = document.querySelectorAll(
    'input[name="payment-method"]'
  );
  const cardFields = document.querySelector(".card-fields");
  const paypalFields = document.querySelector(".paypal-fields");
  const bankFields = document.querySelector(".bank-fields");

  // Show card fields by default (Credit card is checked in HTML)
  cardFields.classList.remove("hidden");
  paypalFields.classList.add("hidden");
  bankFields.classList.add("hidden");

  paymentRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      // show/hide sections based on button clicked
      if (radio.checked) {
        cardFields.classList.toggle("hidden", radio.value !== "card");
        paypalFields.classList.toggle("hidden", radio.value !== "paypal");
        bankFields.classList.toggle("hidden", radio.value !== "bank");
      }
    });
  });
});
