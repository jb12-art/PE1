// Shared Header / Footer to all .html pages

async function loadLayout() {
  // Load header
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (headerPlaceholder) {
    const headerRes = await fetch("/header.html");
    headerPlaceholder.innerHTML = await headerRes.text();
  }

  // Load footer
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    const footerRes = await fetch("/footer.html");
    footerPlaceholder.innerHTML = await footerRes.text();
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", loadLayout);
