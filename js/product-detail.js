// product-detail.js
// Product detail page

// PE1 - API Endpoint Online Shop.
// product-detail.js is styled in product-detail.css

// Import shared cart-function
import {
  addToCart,
  isUserLoggedIn,
  updateBasketDisplay,
} from "./cart-utils.js";

const API_URL = "https://v2.api.noroff.dev/online-shop";

const container = document.querySelector("#productContainer");
const loadingIndicator = document.querySelector("#loadingIndicator");

// Toggle basket dropdown
const basketToggle = document.getElementById("basketToggle");
const basketDropdown = document.getElementById("basketDropdown");

// =======================
// Fetch + Render product
// =======================
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
    const { data: product } = await response.json();

    if (!product) {
      container.textContent = "Product not found";
      return;
    }

    // Build UI
    const box = document.createElement("div");
    const image = document.createElement("img");
    const content = document.createElement("div");
    const title = document.createElement("h2");
    const description = document.createElement("p");
    const rating = document.createElement("p");
    const price = document.createElement("p");
    const discountedPrice = document.createElement("p");
    const tags = document.createElement("p");
    const backButton = document.createElement("a");
    const shareButton = document.createElement("button");
    const review = document.createElement("p");

    box.className = "box-detail";
    image.className = "image-detail";
    content.className = "content-detail";
    title.className = "title-detail";
    description.className = "description-detail";
    rating.className = "rating";
    price.className = "price";
    discountedPrice.className = "discounted-price";
    tags.className = "tags";
    backButton.className = "back-button";
    shareButton.className = "share-button";
    review.className = "review";

    shareButton.innerHTML = "🔗 Share";

    // Fill content
    if (product.image && product.image.url) {
      image.src = product.image.url;
      image.alt = product.image.alt || product.title;
    } else {
      image.src = "../images/placeholder.png"; //fallback image
      image.alt = "No image available";
    }
    title.textContent = product.title;

    // Handle price vs discounted-price
    if (product.discountedPrice && product.discountedPrice < product.price) {
      // Show old price with strikethrough
      price.textContent = `$${Number(product.price).toFixed(2)}`;
      price.classList.add("old-price"); // add CSS class for strikethrough

      // Show discounted price
      discountedPrice.textContent = `$${Number(product.discountedPrice).toFixed(
        2
      )}`;
    } else {
      // No discount = normal price
      price.textContent = `$${Number(product.price).toFixed(2)}`;
      discountedPrice.textContent = ""; // hide discounted price
    }

    // Rating product
    if (product.rating) {
      rating.textContent = `⭐${product.rating.toFixed(1)} / 5`;
    }

    // Tags on product (array + join with commas)
    if (product.tags && product.tags.length > 0) {
      tags.textContent = `Tags: ${product.tags.join(", ")}`;
    } else {
      tags.textContent = "No tags available";
    }

    // Share link
    const shareUrl = `${window.location.origin}${window.location.pathname}?id=${product.id}`;

    // Share function
    shareButton.addEventListener("click", async () => {
      if (navigator.share) {
        // Mobile web share API
        try {
          await navigator.share({
            title: product.title,
            text: "Check out this product",
            url: shareUrl,
          });
          console.log("Product shared successfully");
        } catch (err) {
          console.error("Share failed:", err);
        }
      } else {
        // Fallback: copy link to clipboard
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert("Link copied to clipboard: " + shareUrl);
        } catch (err) {
          console.error("Failed to copy link:", err);
        }
      }
    });

    // Review product (loop through array)
    if (product.reviews && product.reviews.length > 0) {
      const reviewList = document.createElement("ul");
      reviewList.className = "review-list";

      product.reviews.forEach((rev) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${rev.username}</strong>: ${rev.description} (⭐${rev.rating})`;
        reviewList.appendChild(li);
      });

      review.appendChild(reviewList);
    } else {
      review.textContent = "No reviews yet.";
    }

    description.textContent = product.description || "No description available";
    backButton.textContent = "Back to products";
    backButton.href = "../index.html";

    // Assemble content
    box.appendChild(image);
    box.appendChild(content);
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(rating);
    content.appendChild(price);
    content.appendChild(discountedPrice);
    content.appendChild(tags);

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

    content.appendChild(backButton);
    content.appendChild(shareButton);
    content.appendChild(review);

    container.appendChild(box);

    // error message if API call don't work.
  } catch (error) {
    console.error("Failed to load product", error);
    container.textContent = "refresh the page or try again later.";
  } finally {
    loadingIndicator.classList.add("hidden"); // hide loading
  }

  // ----- Cart / Basket -----
  if (basketToggle && basketDropdown) {
    basketToggle.addEventListener("click", () => {
      basketDropdown.classList.toggle("hidden");
      updateBasketDisplay();
    });
  }
}

fetchAndCreateProducts();
updateBasketDisplay();
