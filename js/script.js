// PE1 - API Endpoint Online Shop.
// Connected to Home page.
// script.js is styled in product.css

const API_URL = "https://v2.api.noroff.dev/online-shop";
const container = document.querySelector("#productContainer");
const loadingIndicator = document.querySelector("#loadingIndicator"); // loading message

let allProducts = []; // store all products globally

async function fetchAndCreateProducts() {
  try {
    loadingIndicator.classList.remove("hidden"); // show 'Loading products.' message if API products is loading.
    const response = await fetch(API_URL);
    const data = await response.json();
    allProducts = data.data; // Store fetched products

    displayProducts(allProducts); // Display all products first.
  } catch (err) {
    console.error("Error fetching products:", err);
    container.innerHTML =
      "<p class='error-message'>Failed to load products. Please refresh the page or try again later.</p>"; // styles in, product.css
  } finally {
    loadingIndicator.classList.add("hidden"); // Hide loading
  }
}

function displayProducts(products) {
  container.innerHTML = ""; // Clear previous products

  products.forEach((product) => {
    const box = document.createElement("div");
    const image = document.createElement("img");
    const content = document.createElement("div");
    const title = document.createElement("h2");
    const description = document.createElement("p");
    const price = document.createElement("p");
    const addToCartBtn = document.createElement("button"); // add product to cart and checkout

    box.className = "box";
    image.className = "image";
    content.className = "content";
    title.className = "title";
    description.className = "description";
    price.className = "price";
    addToCartBtn.className = "add-to-cart-button"; // add product to cart and checkout

    image.src = product.image.url;
    image.alt = product.image.alt;

    // Make title link to product page
    const titleLink = document.createElement("a");
    titleLink.href = `product/index.html?id=${product.id}`;
    description.textContent = product.description;
    titleLink.textContent = product.title;
    title.appendChild(titleLink);

    price.textContent = `$${product.price}`;
    addToCartBtn.textContent = "Add to Cart"; // add product to cart and checkout

    // add product to cart and checkout
    // Add to cart handler
    addToCartBtn.addEventListener("click", () => {
      addToCart(product);
    });

    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(price);
    content.appendChild(addToCartBtn); // add product to cart and checkout, styles in: styles.css
    box.appendChild(image);
    box.appendChild(content);

    container.appendChild(box);
  });
}

// Alerting you when you add product to checkout
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateBasketDisplay(); // Refresh basket dropdown
  alert(`${product.title} added to cart`);
}

// basket
const basketToggle = document.getElementById("basketToggle");
const basketDropDown = document.getElementById("basketDropDown");
const basketList = document.getElementById("basketList");

// Toggle basket visibility
basketToggle.addEventListener("click", () => {
  basketDropDown.classList.toggle("hidden");
  updateBasketDisplay();
});

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
    li.innerHTML = `${item.title} - $${item.price} <button class="remove-button" data-index="${index}">Remove</button>`;
    basketList.appendChild(li);
  });

  // Attach event listeners to remove buttons
  document.querySelectorAll(".remove-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const indexToRemove = parseInt(e.target.getAttribute("data-index"));
      removeFromCart(indexToRemove);
    });
  });
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1); // Remove the item at the given index
  localStorage.setItem("cart", JSON.stringify(cart));
  updateBasketDisplay(); // Refresh UI
}

fetchAndCreateProducts();
