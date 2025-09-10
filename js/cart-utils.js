// cart-utils.js
// Shared cart logic for index.html, product-detail.html, cart.html and checkout.html

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
  const totalText = document.getElementById("cart-total");

  if (!cartItemsContainer || !totalText) return;

  const cart = getCart();
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
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

    const description = document.createElement("p");
    description.className = "description-cart";
    description.textContent = item.description || "";

    const priceEl = document.createElement("p");
    priceEl.className = "price-cart";
    priceEl.textContent = `Price: $${item.discountedPrice.toFixed(2)}`;

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
    removeBtn.className = "remove-button";
    removeBtn.textContent = "Remove";
    removeBtn.dataset.index = index;

    // assemble content
    content.appendChild(title);
    content.appendChild(description);
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

  // Quantity update
  document.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const cart = getCart();
      const i = e.target.dataset.index;
      const newQty = Math.max(1, parseInt(e.target.value));
      cart[i].quantity = newQty;
      saveCart(cart);
      renderCartPage();
    });
  });

  // Remove item
  document.querySelectorAll(".remove-button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const cart = getCart();
      const i = e.target.dataset.index;
      cart.splice(i, 1);
      saveCart(cart);
      renderCartPage();
    });
  });
}

// Total price in checkout.html
export function calculateCartTotal() {
  const cart = getCart();
  return cart.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0
  );
}

// Clear cart
export function clearCart() {
  localStorage.removeItem("cart");
  updateBasketDisplay();
  renderCartPage();
}
