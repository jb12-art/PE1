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

document.addEventListener("DOMContentLoaded", () => {
  const paymentRadios = document.querySelectorAll(
    'input[name="payment-method"]'
  );
  const cardFields = document.querySelector(".card-fields");
  const paypalFields = document.querySelector(".paypal-fields");
  const bankFields = document.querySelector(".bank-fields");

  paymentRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      cardFields.classList.toggle("hidden", radio.value !== "card");
      paypalFields.classList.toggle("hidden", radio.value !== "paypal");
      bankFields.classList.toggle("hidden", radio.value !== "bank");
    });
  });
});
