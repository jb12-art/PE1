// Shared Header / Footer to all .html pages

async function loadLayout() {
  // Dynamically find site base (Works both locally and on GitHub Pages)
  const repoName = window.location.hostname.includes("github.io")
    ? window.location.pathname.split("/")[1] + "/"
    : "";

  const siteBase = window.location.origin + "/" + repoName;

  const headerURL = siteBase + "header.html";
  const footerURL = siteBase + "footer.html";

  try {
    const headerPlaceholder = document.getElementById("header-placeholder");
    if (headerPlaceholder) {
      const headerRes = await fetch(headerURL);
      if (!headerRes.ok) throw new Error("Failed to load header.html");
      headerPlaceholder.innerHTML = await headerRes.text();
    }

    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
      const footerRes = await fetch(footerURL);
      if (!footerRes.ok) throw new Error("Failed to load footer.html");
      footerPlaceholder.innerHTML = await footerRes.text();
    }
  } catch (err) {
    console.error("Error loading header/footer:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadLayout);
