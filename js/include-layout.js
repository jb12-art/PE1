// Shared Header / Footer to all .html pages

async function loadLayout() {
  // Determine the correct path for header/footer
  // If the current page is in a subfolder (URL contains a "/something/"),
  // use "../", otherwise use "./"
  const isInSubfolder =
    window.location.pathname.split("/").filter(boolean).length > 1;
  const basePath = isInSubfolder ? "../" : "./";

  try {
    // Load header
    const headerPlaceholder = document.getElementById("header-placeholder");
    if (headerPlaceholder) {
      const headerRes = await fetch(`${basePath}header.html`);
      if (!headerRes.ok) throw new Error("Failed to load header.html");
      headerPlaceholder.innerHTML = await headerRes.text();
    }

    // Load footer
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
      const footerRes = await fetch(`${basePath}footer.html`);
      if (!footerRes.ok) throw new Error("Failed to load footer.html");
      footerPlaceholder.innerHTML = await footerRes.text();
    }
  } catch (err) {
    console.error("Error loading layout:", err);
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", loadLayout);
