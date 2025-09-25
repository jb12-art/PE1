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

  // error message below the Buy Now button
  const errorMessage = document.createElement("p");
  errorMessage.id = "formErrorMessage";
  errorMessage.className = "form-error-message hidden";
  errorMessage.textContent = "Fill out all required fields.";
  buyNowBtn.parentNode.appendChild(errorMessage);

  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      // 1) Grab all required inputs
      const requiredInputs = document.querySelectorAll(
        ".payment-form input[required], .address-form input[required]"
      );

      let allValid = true;

      requiredInputs.forEach((input) => {
        if (!input.value.trim()) {
          allValid = false;
          input.classList.add("input-error"); // add a red border if empty
        }
      });

      if (!allValid) {
        event.preventDefault(); // Stop navigation to success.html
        errorMessage.classList.remove("hidden");
        return;
      }

      // 2) If valid - proceed with checkout
      errorMessage.classList.add("hidden"); // hide message if valid
      clearCart(); // clear cart before navigating
    });

    // Remove error highlight when user starts typing
    const requiredInputs = document.querySelectorAll(
      ".payment-form input[required], .address-form input[required]"
    );

    requiredInputs.forEach((input) => {
      input.addEventListener("input", () => {
        if (input.value.trim()) {
          input.classList.remove("input-error");
        }
      });
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
