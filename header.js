/* Robust include for header/footer — tries multiple paths and logs results */
(function(){
  const repoName = "helixcer-logistics";
  const tries = [
    "/header.html",
    "/footer.html",
    "/header.js",
    "/" + repoName + "/header.html",
    "/" + repoName + "/footer.html",
    "/" + repoName + "/header.js",
    window.location.pathname.replace(/\/$/, "") + "/header.html",
    window.location.pathname.replace(/\/$/, "") + "/footer.html"
  ];

  function tryFetch(url){
    return fetch(url, {cache:'no-store'}).then(res=>{
      console.log("TRY", url, res.status);
      return {url, ok:res.ok, status:res.status, text: res.ok ? res.text() : null};
    }).catch(err=>{
      console.warn("ERR", url, err);
      return {url, ok:false, status:0, err};
    });
  }

  async function loadInto(id, fileCandidates){
    const target = document.getElementById(id);
    if(!target){ console.warn("Missing placeholder:", id); return; }
    for(const u of fileCandidates){
      const r = await tryFetch(u);
      if(r.ok){
        const txt = await r.text;
        target.innerHTML = txt;
        console.log("LOADED", id, "from", u);
        return true;
      }
    }
    console.warn("NONE LOADED for", id, fileCandidates);
    return false;
  }

  async function run(){
    // candidates for header/footer
    const headerCandidates = [
      "/header.html",
      "/helixcer-logistics/header.html",
      window.location.pathname.replace(/\/$/, "") + "/header.html",
      "./header.html"
    ];
    const footerCandidates = [
      "/footer.html",
      "/helixcer-logistics/footer.html",
      window.location.pathname.replace(/\/$/, "") + "/footer.html",
      "./footer.html"
    ];

    await loadInto("header-placeholder", headerCandidates);
    await loadInto("footer-placeholder", footerCandidates);

    // find nav links and highlight active (best-effort)
    setTimeout(()=>{
      const base = window.location.pathname.split("/").filter(Boolean);
      const isProject = base[0] === "helixcer-logistics";
      const current = (isProject ? base.slice(1).join("/") : base.join("/")) || "";
      document.querySelectorAll("nav a").forEach(a=>{
        const href = a.getAttribute("href") || "";
        const cleanHref = href.replace(/^\/+|\/+$/g,"");
        if(cleanHref === "" && current === "") a.classList.add("active");
        else if(cleanHref && current.startsWith(cleanHref)) a.classList.add("active");
      });
    }, 400);
  }

  // run after DOM is ready
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
