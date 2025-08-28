// PE1 - API Endpoint Online Shop.
// product-detail.js is styled in product-detail.css

const API_URL = "https://v2.api.noroff.dev/online-shop";

const container = document.querySelector("#productContainer");
const loadingIndicator = document.querySelector("#loadingIndicator");

// Fetch + Render products
async function fetchAndCreateProducts() {
  try {
    loadingIndicator.classList.remove("hidden"); // show loading

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
      container.textContent = "No product ID provided.";
      return;
    }

    const response = await fetch(`${API_URL}/${id}`);
    const data = await response.json();
    const product = data.data;

    const box = document.createElement("div");
    const image = document.createElement("img");
    const content = document.createElement("div");
    const title = document.createElement("h2");
    const description = document.createElement("p");
    const price = document.createElement("p");
    const addToCartBtn = document.createElement("button"); // add product to cart and checkout
    const backButton = document.createElement("a");

    box.className = "box-detail";
    image.className = "image";
    content.className = "content";
    title.className = "title-detail";
    description.className = "description";
    price.className = "price";
    addToCartBtn.className = "add-to-cart-button"; // add product to cart and checkout
    backButton.className = "back-button";

    // Fill content
    image.src = product.image.url;
    image.alt = product.image.alt || product.title;
    title.textContent = product.title;
    price.textContent = `$${Number(product.price).toFixed(2)}`;
    description.textContent = product.description || "No description available";
    addToCartBtn.textContent = "Add to Cart";
    backButton.textContent = "Back to products";
    backButton.href = "../index.html";

    box.appendChild(image);
    box.appendChild(content);
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(price);
    content.appendChild(addToCartBtn);
    content.appendChild(backButton);

    // error message if API call don't work.
    container.appendChild(box);
  } catch (error) {
    console.error(
      "Faled to load product, refresh the page or try again later."
    );
  } finally {
    loadingIndicator.classList.add("hidden"); // hide loading
  }
}

fetchAndCreateProducts();
