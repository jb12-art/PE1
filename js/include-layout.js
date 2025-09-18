// Shared Header / Footer to all .html pages

async function loadLayout() {
  const headerPlaceholder = document.getElementById("header-placeholder");
  const footerPlaceholder = document.getElementById("footer-placeholder");

  try {
    if (headerPlaceholder) {
      const headerRes = await fetch("header.html"); // adjust "../" based on folder depth
      if (!headerRes.ok) throw new Error("Failed to load header.html");
      headerPlaceholder.innerHTML = await headerRes.text();
    }

    if (footerPlaceholder) {
      const footerRes = await fetch("footer.html"); // adjust "../" based on folder depth
      if (!footerRes.ok) throw new Error("Failed to load footer.html");
      footerPlaceholder.innerHTML = await footerRes.text();
    }
  } catch (err) {
    console.error("Error loading header/footer:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadLayout);
