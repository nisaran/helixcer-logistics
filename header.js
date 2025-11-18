/* Detect base path (GitHub Pages or custom domain) */
let BASE_PATH = "/";

const pathParts = window.location.pathname.split("/").filter(Boolean);

/* If hosted on GitHub Pages project site → /helixcer-logistics/ */
if (pathParts.length > 0 && pathParts[0] === "helixcer-logistics") {
  BASE_PATH = "/helixcer-logistics/";
}

/* Load partials */
async function includeSection(targetId, file) {
  const url = BASE_PATH + file;

  try {
    const res = await fetch(url);
    if (res.ok) {
      document.getElementById(targetId).innerHTML = await res.text();
    } else {
      console.warn("Failed:", url);
    }
  } catch (e) {
    console.warn("Error loading:", url);
  }
}

includeSection("header-placeholder", "header.html");
includeSection("footer-placeholder", "footer.html");

/* Highlight active menu */
function highlightActiveLink() {
  const current = window.location.pathname.replace(BASE_PATH, "") || "home";
  const links = document.querySelectorAll("nav a");

  links.forEach(a => {
    let href = a.getAttribute("href").replace("/", "");
    if (href === "") href = "home";

    if (current.startsWith(href)) {
      a.classList.add("active");
    }
  });
}

/* Wait for header to load first */
setTimeout(highlightActiveLink, 400);

/* Auto-close mobile menu */
document.addEventListener("click", (e) => {
  if (e.target.closest("nav a")) {
    document.body.classList.remove("show-menu");
  }
});
