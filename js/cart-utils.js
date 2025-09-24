// cart-utils.js
// Shared cart logic for index.html, product-detail.html, cart.html and checkout.html

// --- CART STORAGE --- //
export function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// --- USER LOGIN CHECK --- //
export function isUserLoggedIn() {
  const token = localStorage.getItem("accessToken");
  const user = localStorage.getItem("user");
  return !!(token && user); // true if both exist
}

// --- ADD PRODUCT TO CART --- //
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
  updateBasketDisplay(); // update UI immediately after adding
}

// --- UPDATE BASKET DROPDOWN --- //
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

    const textSpan = document.createElement("span");
    textSpan.textContent = `${item.title} (x${item.quantity}) - $${(
      item.discountedPrice * item.quantity
    ).toFixed(2)}`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "remove-button";
    removeBtn.dataset.index = index;

    removeBtn.addEventListener("click", () => {
      let cart = getCart();
      cart.splice(index, 1);
      saveCart(cart);
      updateBasketDisplay();
      renderCartPage();
    });

    li.appendChild(textSpan);
    li.appendChild(removeBtn);
    basketList.appendChild(li);
  });
}

// --- RENDER FULL CART PAGE --- //
export function renderCartPage() {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalText = document.getElementById("cart-total");

  if (!cartItemsContainer || !totalText) return;

  const cart = getCart();
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      "<p class='cart-empty-text'>Your cart is empty.</p>";
    totalText.textContent = "0.00";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const box = document.createElement("div");
    box.className = "cart-item";

    const image = document.createElement("img");
    image.className = "cart-item-img";
    image.src = item.image || "images/placeholder.png";
    image.alt = item.title;

    const content = document.createElement("div");
    content.className = "content-cart";

    const title = document.createElement("h2");
    title.className = "title-cart";
    title.textContent = item.title;

    const priceEl = document.createElement("p");
    priceEl.className = "price-cart";

    if (item.discountedPrice < item.price) {
      priceEl.innerHTML = `<span class="original-price">$${item.price.toFixed(
        2
      )}</span>
      <span class="discounted-price">$${item.discountedPrice.toFixed(
        2
      )}</span>`;
    } else {
      priceEl.textContent = `Price: $${item.price.toFixed(2)}`;
    }

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
    subtotalEl.className = "subtotal-cart";
    subtotalEl.textContent = `Subtotal: $${(
      item.discountedPrice * item.quantity
    ).toFixed(2)}`;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-button-cart";
    removeBtn.textContent = "Remove";
    removeBtn.dataset.index = index;

    content.appendChild(title);
    content.appendChild(priceEl);
    content.appendChild(qtyLabel);
    content.appendChild(subtotalEl);
    content.appendChild(removeBtn);

    box.appendChild(image);
    box.appendChild(content);
    cartItemsContainer.appendChild(box);

    total += item.discountedPrice * item.quantity;
  });

  totalText.textContent = total.toFixed(2);

  // Quantity change handler
  document.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const cart = getCart();
      const i = e.target.dataset.index;
      const newQty = Math.max(1, parseInt(e.target.value));
      cart[i].quantity = newQty;
      saveCart(cart);
      renderCartPage();
      updateBasketDisplay();
    });
  });

  // Remove buttons
  document
    .querySelectorAll(".remove-button, .remove-button-cart")
    .forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const cart = getCart();
        const i = e.target.dataset.index;
        cart.splice(i, 1);
        saveCart(cart);
        renderCartPage();
        updateBasketDisplay();
      });
    });
}

// --- TOTAL FOR CHECKOUT --- //
export function calculateCartTotal() {
  const cart = getCart();
  return cart.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0
  );
}

// --- CLEAR CART --- //
export function clearCart() {
  localStorage.removeItem("cart");
  updateBasketDisplay();
  renderCartPage();
}
