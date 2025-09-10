// cart-utils.js
// Shared cart logic for index.html, product-detail.html, and cart.html

// Get & Save Cart
export function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// User Login Check
export function isUserLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

// Add product to cart
export function addToCart(product) {
  if (!isUserLoggedIn()) {
    alert("Login to add items to your cart.");
    return;
  }

  let cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      discountedPrice:
        product.discountedPrice && product.discountedPrice < product.price
          ? product.discountedPrice
          : product.price,
      image: product.image?.url || "",
      quantity: 1,
    });
  }

  saveCart(cart);
}

// Update basket UI dropdown
export function updateBasketDisplay() {
  const basketList = document.getElementById("basketList");
  if (!basketList) return;

  const cart = getCart();
  basketList.innerHTML = "";

  if (cart.length === 0) {
    basketList.innerHTML = "<li>Your cart is empty</li>";
    return;
  }

  cart.forEach((item, index) => {
    const li = document.createElement("li");

    // product title + quantity + subtotal
    const textSpan = document.createElement("span");
    textSpan.textContent = `${item.title} (x${item.quantity}) - $${(
      item.discountedPrice * item.quantity
    ).toFixed(2)}`;

    // remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "remove-button";
    removeBtn.dataset.index = index;

    removeBtn.addEventListener("click", () => {
      let cart = getCart();
      cart.splice(index, 1); // remove item
      saveCart(cart);
      updateBasketDisplay(); // refresh dropdown
      renderCartPage(); // refresh cart page
    });

    li.appendChild(textSpan);
    li.appendChild(removeBtn);
    basketList.appendChild(li);
  });
}

// Render Cart Page
export function renderCartPage() {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalText = document.querySelector(".total-text");

  if (!cartItemsContainer || !totalText) return;

  const cart = getCart();
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty</p>";
    totalText.textContent = "Total: $0.00";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
    <img src="${item.image}" alt="${item.title}" class="cart-item-img" />
    <h3>${item.title}</h3>
    <p>$${item.discountedPrice.toFixed(2)}</p>
    <div class="quantity-controls">
    <button class="decrease" data-index="${index}">-</button>
    <span>${item.quantity}</span>
    <button class="increase" data-index="${index}">+</button>
    </div>
    <p>Subtotal: $${(item.discountedPrice * item.quantity).toFixed(2)}</p>
    <button class="remove-button" data-index="${index}">Remove</button>
    `;

    cartItemsContainer.appendChild(div);

    total += item.discountedPrice * item.quantity;
  });

  totalText.textContent = `Total: $${total.toFixed(2)}`;

  // Event listeners for +, -, remove
  document.querySelectorAll(".increase").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let cart = getCart();
      const index = e.target.dataset.index;
      cart[index].quantity += 1;
      saveCart(cart);
      renderCartPage();
    });
  });

  document.querySelectorAll(".decrease").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let cart = getCart();
      const index = e.target.dataset.index;
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        cart.splice(index, 1);
      }
      saveCart(cart);
      renderCartPage();
    });
  });

  // ----- Cart / Basket -----
  // When the code is 'off', Cart view in cart.html / checkout.html is off.
  // if (basketToggle && basketDropdown) {
  //   basketToggle.addEventListener("click", () => {
  //     basketDropdown.classList.toggle("hidden");
  //   });
  // }
}

// Clear cart
export function clearCart() {
  localStorage.removeItem("cart");
  updateBasketDisplay();
  renderCartPage();
}
