// script.js
// Uses shared cart-utils.js for cart logic.
// PE1 - API Endpoint Online Shop.
// Connected to Home page.
// script.js is styled in product-box.css

// Import shared cart-function
import {
  addToCart,
  isUserLoggedIn,
  updateBasketDisplay,
} from "./cart-utils.js";

const API_URL = "https://v2.api.noroff.dev/online-shop";

// ------ DOM refs -------
const container = document.querySelector("#productContainer");
const loadingIndicator = document.querySelector("#loadingIndicator"); // loading message

// Carousel Banner
const carousel = document.querySelector("#carousel");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

// Toggle basket dropdown
const basketToggle = document.getElementById("basketToggle");
const basketDropdown = document.getElementById("basketDropdown");

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

// =======================
// Fetch + Render products
// =======================
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

    box.className = "box";
    image.className = "image";
    content.className = "content";
    title.className = "title";
    price.className = "price";

    // Image
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

    // Price vs discounted-price
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

    // Assemble grid products
    content.appendChild(title);
    content.appendChild(price);

    // 'Add to Cart' button, hide/show function
    if (isUserLoggedIn()) {
      const addToCartBtn = document.createElement("button");
      addToCartBtn.className = "add-to-cart-button";
      addToCartBtn.textContent = "Add to Cart"; // add product to cart and checkout

      addToCartBtn.addEventListener("click", () => {
        addToCart(product);
        updateBasketDisplay(); // keep dropdown in sync
      });
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

// ----- Cart / Basket -----
if (basketToggle && basketDropdown) {
  basketToggle.addEventListener("click", () => {
    basketDropdown.classList.toggle("hidden");
    updateBasketDisplay();
  });
}

// Init
fetchAndCreateProducts();
updateBasketDisplay(); // Refresh dropdown UI
