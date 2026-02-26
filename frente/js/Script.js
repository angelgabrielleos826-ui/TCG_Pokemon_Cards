const contenedor = document.getElementById("productos");
const API_CARDS_URL = "http://localhost:3000/api/cards";

async function cargarProductos() {
  if (!contenedor) return;

  try {
    const res = await fetch(API_CARDS_URL);
    if (!res.ok) throw new Error("No se pudieron cargar las cartas");

    const productos = await res.json();
    mostrarProductos(productos);
  } catch (err) {
    console.error("Error cargando cartas:", err);
  }
}

function mostrarProductos(productos) {
  if (!contenedor) return;

  contenedor.innerHTML = "";

  productos.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <p>${p.name}</p>
      <p>$${Number(p.price).toFixed(2)} MXN</p>
      <button class="btn-agregar" data-id="${p._id}">Agregar</button>
    `;

    contenedor.appendChild(div);
  });
}

if (contenedor) {
  contenedor.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-agregar");
    if (!btn) return;

    const cardId = btn.dataset.id;
    if (!cardId) return;

    const ok = await agregarCartaAlBackend(cardId, 1);
    if (ok && typeof cargarYMostrarCarrito === "function") {
      await cargarYMostrarCarrito();
    }
  });
}

cargarProductos();
