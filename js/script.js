// PE1 - API Endpoint Online Shop.
// Connected to Home page.
// script.js is styled in product-box.css

const API_URL = "https://v2.api.noroff.dev/online-shop";

// ------ DOM refs -------
const container = document.querySelector("#productContainer");
const loadingIndicator = document.querySelector("#loadingIndicator"); // loading message

// Carousel Banner
const carousel = document.querySelector("#carousel");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

// Basket
const basketToggle = document.getElementById("basketToggle");
const basketDropdown = document.getElementById("basketDropdown");
const basketList = document.getElementById("basketList");

// ---- State ----
let allProducts = []; // store all products globally
let latestProducts = [];
let currentIndex = 0;

// show/hide 'Login to add products to cart' text
document.addEventListener("DOMContentLoaded", () => {
  const helpText = document.querySelector(".help-text");
  if (isUserLoggedIn() && helpText) {
    helpText.style.display = "none";
  }
});

// show email/username + logout button
document.addEventListener("DOMContentLoaded", () => {
  const userBox = document.getElementById("userBox");
  const helpText = document.querySelector(".help-text");
  const regLogDiv = document.querySelector(".register-login-div");

  if (isUserLoggedIn()) {
    // Hide "Login to add products" text
    if (helpText) helpText.style.display = "none";
    // Hide Register/Login buttons
    if (regLogDiv) regLogDiv.style.display = "none";

    // Show user box
    const user = JSON.parse(localStorage.getItem("registeredUser"));
    if (userBox && user) {
      userBox.style.display = "block";
      userBox.innerHTML = `${user.email} <button id="logoutBtn">Sign out</button>`;

      // Logout handler
      document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("cart");
        window.location.reload(); // refresh to update UI
      });
    }
  } else {
    // If not logged in, show Register/Login buttons and hide user box
    if (regLogDiv) regLogDiv.style.display = "flex";
    if (userBox) userBox.style.display = "none";
  }
});

// hide/show. 'Add to Cart' button when user is not-logged in/logged in.
function isUserLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

// Fetch + Render products
async function fetchAndCreateProducts() {
  try {
    loadingIndicator.classList.remove("hidden"); // show 'Loading products.' message if API products is loading.
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    allProducts = Array.isArray(data?.data) ? data.data : []; // Store fetched products

    // Render product grid
    displayProducts(allProducts); // Display all products first.

    // Render top banner carousel (3 latest)
    displayCarousel(allProducts); // moved here so it only runs on success
  } catch (err) {
    console.error("Error fetching products:", err);
    container.innerHTML =
      "<p class='error-message'>Failed to load products. Please refresh the page or try again later.</p>"; // styles in, product.css
    // show a fallback error in the carousel too

    if (carousel) {
      carousel.innerHTML = "<p class='error-message'>No banner available.</p>";
    }
  } finally {
    loadingIndicator.classList.add("hidden"); // Hide loading
  }
}

// =======================
// Product grid rendering
// =======================
function displayProducts(products) {
  container.innerHTML = ""; // Clear previous products

  products.forEach((product) => {
    const box = document.createElement("div");
    const image = document.createElement("img");
    const imageLink = document.createElement("a");
    const content = document.createElement("div");
    const title = document.createElement("h2");
    const price = document.createElement("p");
    const addToCartBtn = document.createElement("button"); // add product to cart and checkout

    box.className = "box";
    image.className = "image";
    content.className = "content";
    title.className = "title";
    price.className = "price";
    addToCartBtn.className = "add-to-cart-button"; // add product to cart and checkout

    const imgUrl = product?.image?.url || "";
    const imgAlt = product?.image?.alt || product?.title || "Product image";
    image.src = imgUrl;
    image.alt = imgAlt;

    // Wrap grid product image in a link
    imageLink.href = `./product/product.html?id=${product.id}`;
    imageLink.appendChild(image);

    // Title link to specific product page
    const titleLink = document.createElement("a");
    titleLink.href = `./product/product.html?id=${product.id}`;
    titleLink.textContent = product.title || "Untitled product";
    title.appendChild(titleLink);

    // Handle price vs discounted-price
    if (product.discountedPrice && product.discountedPrice < product.price) {
      price.innerHTML = `<span class="old-price">$${Number(
        product.price
      ).toFixed(2)}</span>
  <span class="discounted-price">$${Number(product.discountedPrice).toFixed(
    2
  )}</span>`;
    } else {
      price.textContent = `$${Number(product.price || 0).toFixed(2)}`;
    }

    addToCartBtn.textContent = "Add to Cart"; // add product to cart and checkout

    // add product to cart and checkout
    // Add to cart handler
    addToCartBtn.addEventListener("click", () => addToCart(product));

    // Assemble grid products
    content.appendChild(title);
    content.appendChild(price);
    if (isUserLoggedIn()) {
      content.appendChild(addToCartBtn); // styled in: product-box.css
    }
    box.appendChild(imageLink);
    box.appendChild(content);
    container.appendChild(box);
  });
}
// =====================
// Carousel (3 latest)
// ====================
function displayCarousel(products) {
  if (!carousel) return;

  carousel.innerHTML = "";

  // Take the last 3 products (treating "latest" as the last in the array)
  latestProducts = Array.isArray(products) ? products.slice(-3) : [];

  if (latestProducts.length === 0) {
    carousel.innerHTML = "<p>No products to show.</p>";
    return;
  }

  latestProducts.forEach((product) => {
    const box = document.createElement("div");
    box.className = "carousel-item";

    const image = document.createElement("img");
    image.className = "image";
    image.src = product?.image?.url || "";
    image.alt = product?.image?.alt || product?.title || "Product image";

    const title = document.createElement("h2");
    title.className = "title";
    title.textContent = product.title || "Untitled product";

    const price = document.createElement("p");
    price.className = "price";

    if (product.discountedPrice && product.discountedPrice < product.price) {
      price.innerHTML = `<span class="old-price">$${Number(
        product.price
      ).toFixed(2)}</span>
      <span class="discounted-price">$${Number(product.discountedPrice).toFixed(
        2
      )}</span>`;
    } else {
      price.textContent = `$${Number(product.price || 0).toFixed(2)}`;
    }

    const link = document.createElement("a");
    link.className = "banner-button-detail";
    link.textContent = "See more details";
    link.href = `./product/product.html?id=${product.id}`;

    // Assemble carousel
    box.appendChild(image);
    box.appendChild(title);
    box.appendChild(price);
    box.appendChild(link);
    carousel.appendChild(box);
  });

  // Start at first product item every time we refresh
  currentIndex = 0;
  updateCarousel();
}

function updateCarousel() {
  const items = carousel ? carousel.querySelectorAll(".carousel-item") : [];
  if (!items.length) return;

  items.forEach((item, index) => {
    item.style.transform = `translateX(${(index - currentIndex) * 100}%)`;
  });
}

// Prev/Next handlers with looping
if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    if (!latestProducts.length) return;
    currentIndex =
      (currentIndex - 1 + latestProducts.length) % latestProducts.length;
    updateCarousel();
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    if (!latestProducts.length) return;
    currentIndex = (currentIndex + 1) % latestProducts.length;
    updateCarousel();
  });
}

// ==========================
// ----- Cart / Basket -----
// ==========================
// Add product to cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // dicsountedPrice if valid, otherwise normal price
  const hasDiscount =
    product.discountedPrice && product.discountedPrice < product.price;
  const price = hasDiscount
    ? Number(product.discountedPrice)
    : Number(product.price);

  // Check if product already in cart
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1; // increase qty
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: Number(product.price),
      discountedPrice: hasDiscount ? Number(product.discountedPrice) : null,
      quantity: 1,
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateBasketDisplay();

  const cartItem = {
    id: product.id,
    title: product.title,
    price: Number(product.price), // store final price
    discountedPrice: hasDiscount ? Number(product.discountedPrice) : null,
  };

  cart.push(cartItem);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateBasketDisplay(); // Refresh basket dropdown
}

// Toggle basket visibility
if (basketToggle && basketDropdown) {
  basketToggle.addEventListener("click", () => {
    basketDropdown.classList.toggle("hidden");
    updateBasketDisplay();
  });
}

// Update basket UI
function updateBasketDisplay() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  basketList.innerHTML = "";

  if (cart.length === 0) {
    basketList.innerHTML = "<li>Your cart is empty.</li>";
    return;
  }

  // Cart items and Remove-button with class"" to style, styles.css
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.classList.add("basket-item");

    if (item.discountedPrice && item.discountedPrice < item.price) {
      li.innerHTML = `${
        item.title
      } - <span class="old-price">$${item.price.toFixed(2)}</span>
      <span class="discounted-price">$${item.discountedPrice.toFixed(2)}</span>
            <button class="remove-button" data-index="${index}">Remove</button>
`;
    } else {
      li.innerHTML = `
        ${item.title} - $${Number(item.price).toFixed(2)} 
        <button class="remove-button" data-index="${index}">Remove</button>
        `;
    }

    basketList.appendChild(li);
  });

  // Attach event listeners to remove button
  basketList.querySelectorAll(".remove-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const indexToRemove = parseInt(e.target.getAttribute("data-index"), 10);
      removeFromCart(indexToRemove);
    });
  });
}

function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1); // Remove the item at the given index
  localStorage.setItem("cart", JSON.stringify(cart));
  updateBasketDisplay(); // Refresh UI
}

fetchAndCreateProducts();
