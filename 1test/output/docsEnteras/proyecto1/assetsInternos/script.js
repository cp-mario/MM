//Este script se cargara en cada html de la documentacion al ejecutarlo



//Iconos
const iconExpand = `
<svg width="18" height="18" viewBox="0 0 32 32" fill="none">
  <rect x="2" y="2" width="28" height="28" rx="4" fill="#1E88E5"/>
  <rect x="6" y="6" width="20" height="20" rx="3" fill="none" stroke="#64B5F6" stroke-width="2"/>
  <line x1="16" y1="10" x2="16" y2="22" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="10" y1="16" x2="22" y2="16" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

const iconCollapse = `
<svg width="18" height="18" viewBox="0 0 32 32" fill="none">
  <rect x="2" y="2" width="28" height="28" rx="4" fill="#1E88E5"/>
  <rect x="6" y="6" width="20" height="20" rx="3" fill="none" stroke="#64B5F6" stroke-width="2"/>
  <line x1="10" y1="16" x2="22" y2="16" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;






// ===============================================================
// 1. Calcular prefix según profundidad dentro de /pages/
// ===============================================================




let nombreProyecto


fetch(prefix + "config.json")
  .then(res => res.json())
  .then(data => {
    nombreProyecto = data.project.title
});



// ===============================================================
// 2. Cargar sidebar.html
// ===============================================================
fetch(prefix + "assetsInternos/sidebar.html")
  .then(res => {
    if (!res.ok) throw new Error("No se pudo cargar sidebar.html");
    return res.text();
  })
  .then(html => {
    document.getElementById("sidebar-container").innerHTML = html;
    cargarMenuHamburguesa()

    // ===============================================================
    // 3. Cargar index.json autogenerado por el parser
    // ===============================================================
    return fetch(prefix + "assetsInternos/index.json");
  })
  .then(res => {
    if (!res.ok) throw new Error("No se pudo cargar index.json");
    return res.json();
  })
  .then(indexData => {
    // ===============================================================
    // 4. Construir el menú dinámico usando index.json
    // ===============================================================
    const menu = document.querySelector("#sidebar-menu");
    if (!menu) return;

    // --- ORDENAR: huérfanos arriba, carpetas después ---
    const orphans = indexData.filter(n => n.type === "file");
    const folders = indexData.filter(n => n.type === "folder");

    orphans.sort((a, b) => a.name.localeCompare(b.name));
    folders.sort((a, b) => a.name.localeCompare(b.name));

    const ordered = [...orphans, ...folders];

    // --- Renderizado original ---
  
document.getElementById("sidebar-title").href = prefix;
document.getElementById("sidebar-title").textContent = nombreProyecto;


function renderNode(node, container) {
  if (node.type === "file") {
    const a = document.createElement("a");
    a.href = prefix + "pages/" + node.path;
    a.textContent = node.name;
    a.style.display = "block";
    container.appendChild(a);
    return;
  }

  if (node.type === "folder") {
  const header = document.createElement("div");
  header.classList.add("folder-header");

  const icon = document.createElement("span");
  icon.classList.add("folder-icon");
  icon.innerHTML = iconExpand; // empieza cerrado

  const title = document.createElement("span");
  title.textContent = node.name;
  title.classList.add("folder-title");

  header.appendChild(icon);
  header.appendChild(title);
  container.appendChild(header);

  const sub = document.createElement("div");
  sub.classList.add("folder-content", "collapsed"); // empieza cerrado
  sub.style.marginLeft = "15px";
  container.appendChild(sub);

  node.children.forEach(child => renderNode(child, sub));

  header.addEventListener("click", () => {
    const collapsed = sub.classList.toggle("collapsed");
    icon.innerHTML = collapsed ? iconExpand : iconCollapse;
  });
}
}




  // Renderizar todo en orden
  ordered.forEach(node => renderNode(node, menu));
  // ===============================================================
  // 5. Resaltar la página actual
  // ===============================================================
  const currentPath = path.replace(/^\//, "");
  const links = document.querySelectorAll("#sidebar-menu a");
  links.forEach(a => {
    if (a.href.endsWith(currentPath)) {
      a.classList.add("active");
    }
  });
})
.catch(err => {
  console.error("❌ Error cargando sidebar o índice:", err);
  document.getElementById("sidebar-container").innerHTML =
    '<p style="padding:10px">⚠️ Menú no disponible</p>';
});


//Menu hamburguesa

function cargarMenuHamburguesa(){
  const btn = document.getElementById("icon-btn");
  const btn2 = document.getElementById("icon-btn2");
  const nav = document.getElementById("sidebar");
  const main = document.getElementsByTagName("main")[0]

  // Evento de botones
  btn.addEventListener("click", () => {
    nav.classList.toggle("show");
    btn2.classList.toggle("active");
    main.classList.toggle("sidebarActiva");
  });

  btn2.addEventListener("click", () => {
    nav.classList.toggle("show");
    btn2.classList.toggle("active");
    main.classList.toggle("sidebarActiva");
  });

  // Media query para detectar móvil
  const mq = window.matchMedia("(max-width: 999px)");

  // Función que se ejecuta SOLO cuando se cruza el límite 999px
  function handleChange(e) {
    if (e.matches) {
      // Hemos pasado a móvil
      nav.classList.remove("show");
      btn2.classList.remove("active");
      main.classList.remove("sidebarActiva");
    } else {
      // Hemos pasado a PC
      nav.classList.add("show");
      btn2.classList.add("active");
      main.classList.add("sidebarActiva");
    }
  }

  // Ejecutar al cargar
  handleChange(mq);

  // Ejecutar SOLO cuando se cruza 999px
  mq.addEventListener("change", handleChange);
}