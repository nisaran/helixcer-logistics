/* ---------------------------------------------------------
   AUTO-INCLUDE HEADER + FOOTER ON ALL PAGES
   --------------------------------------------------------- */

async function includeSection(targetId, file) {
  try {
    const res = await fetch("/" + file);
    if (!res.ok) {
      // GitHub Pages project site fallback
      const fallback = window.location.pathname.split("/")[1];
      const fallbackRes = await fetch("/" + fallback + "/" + file);

      if (fallbackRes.ok) {
        document.getElementById(targetId).innerHTML = await fallbackRes.text();
      }
      return;
    }
    document.getElementById(targetId).innerHTML = await res.text();
  } catch (e) {
    console.warn("Include failed:", file);
  }
}

/* Load header + footer (placeholders required in each page) */
includeSection("header-placeholder", "header.html");
includeSection("footer-placeholder", "footer.html");


/* ---------------------------------------------------------
   ACTIVE LINK HIGHLIGHT (works on GitHub Pages + custom domain)
   --------------------------------------------------------- */
function highlightActiveLink() {
  const path = window.location.pathname.replace(/\/+$/, ""); // remove trailing slash
  let current = path.split("/").pop();

  if (current === "") current = "home";

  const links = document.querySelectorAll("nav a");

  links.forEach(link => {
    const href = link.getAttribute("href").replace(/\/+$/, "");
    const page = href.split("/").pop() || "home";

    if (page === current) {
      link.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Delay needed because header is loaded dynamically
  setTimeout(highlightActiveLink, 300);
});
