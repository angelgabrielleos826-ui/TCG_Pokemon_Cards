let monedaActual = "MXN";
let tipoCambio = 0.05823;
const API_BASE_URL = "http://localhost:3000/api";

let carritoActual = { items: [] };
const listaCarrito = document.getElementById("listaCarrito");
const totalElement = document.getElementById("total");
const btnMoneda = document.getElementById("btnMoneda");

function formatearMoneda(valor, moneda = monedaActual) {
  const numero = Number(valor || 0);
  return moneda === "USD"
    ? `US$${numero.toFixed(2)} USD`
    : `$${numero.toFixed(2)} MXN`;
}

async function actualizarTipoCambio() {
  try {
    const response = await fetch(`${API_BASE_URL}/tipo-cambio`);
    if (!response.ok) throw new Error("No se pudo consultar tipo de cambio");

    const data = await response.json();
    if (typeof data.USD === "number" && Number.isFinite(data.USD)) {
      tipoCambio = data.USD;
    }
  } catch (error) {
    console.error("Error obteniendo tipo de cambio:", error);
  }
}

async function cargarYMostrarCarrito() {
  const data = await obtenerCarritoBackend();

  if (!data) {
    carritoActual = { items: [] };
    mostrarCarrito();
    return;
  }

  if (data.cart && Array.isArray(data.cart.items)) {
    carritoActual = data.cart;
  } else if (Array.isArray(data.items)) {
    carritoActual = { items: data.items };
  } else {
    carritoActual = { items: [] };
  }

  mostrarCarrito();
}

if (btnMoneda) {
  btnMoneda.addEventListener("click", async () => {
    monedaActual = monedaActual === "MXN" ? "USD" : "MXN";

    if (monedaActual === "USD") {
      await actualizarTipoCambio();
    }

    btnMoneda.textContent = monedaActual === "MXN" ? "Cambiar a USD" : "Cambiar a MXN";
    mostrarCarrito();
  });
}

function mostrarCarrito() {
  if (!listaCarrito || !totalElement) return;

  listaCarrito.innerHTML = "";

  if (!carritoActual || !Array.isArray(carritoActual.items) || carritoActual.items.length === 0) {
    listaCarrito.innerHTML = "<li style='text-align: center; padding: 20px;'>Tu carrito está vacío</li>";
    totalElement.textContent = formatearMoneda(0);
    return;
  }

  let totalCalculado = 0;

  carritoActual.items.forEach((item) => {
    const card = item.card || {};
    const quantity = Number(item.quantity || 0);
    const precioBase = Number(card.price || 0);

    const precio = monedaActual === "USD" ? precioBase * tipoCambio : precioBase;
    const subtotal = precio * quantity;

    totalCalculado += subtotal;

    const li = document.createElement("li");
    li.style.cssText = `
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px;
      border: 1px solid #ddd;
      margin-bottom: 10px;
      border-radius: 8px;
      background: white;
    `;

    li.innerHTML = `
      <img src="${card.image || ""}" alt="${card.name || "Carta"}"
        style="width: 100px; height: auto; border-radius: 5px;">

      <div style="flex: 1;">
        <h3 style="margin: 0 0 5px 0;">${card.name || "Carta"}</h3>

        <p style="margin: 3px 0;">
          Precio unitario: ${formatearMoneda(precio)}
        </p>

        <p style="margin: 3px 0; font-weight: bold;">
          Subtotal: ${formatearMoneda(subtotal)}
        </p>
      </div>

      <div style="display: flex; align-items: center; gap: 10px;">
        <button class="btn-menos" data-id="${card._id || ""}"
          style="padding: 5px 15px; cursor: pointer;">-</button>

        <span style="font-weight: bold; min-width: 30px; text-align: center;">
          ${quantity}
        </span>

        <button class="btn-mas" data-id="${card._id || ""}"
          style="padding: 5px 15px; cursor: pointer;">+</button>

        <button class="btn-eliminar" data-id="${card._id || ""}"
          style="padding: 5px 15px; cursor: pointer;
          background: #ff4444; color: white; border: none; border-radius: 5px;">
          Eliminar
        </button>
      </div>
    `;

    listaCarrito.appendChild(li);
  });

  totalElement.textContent = formatearMoneda(totalCalculado);
}

if (listaCarrito) {
  listaCarrito.addEventListener("click", async (e) => {
    const cardId = e.target.dataset.id;
    if (!cardId) return;

    if (e.target.classList.contains("btn-mas")) {
      await agregarCartaAlBackend(cardId, 1);
      await cargarYMostrarCarrito();
    } else if (e.target.classList.contains("btn-menos")) {
      await agregarCartaAlBackend(cardId, -1);
      await cargarYMostrarCarrito();
    } else if (e.target.classList.contains("btn-eliminar")) {
      if (confirm("¿Eliminar esta carta del carrito?")) {
        await eliminarCartaDelBackend(cardId);
        await cargarYMostrarCarrito();
      }
    }
  });
}

function configurarBotonVaciar() {
  const btnVaciar = document.querySelector('button[onclick="vaciarCarrito()"]');

  if (btnVaciar) {
    btnVaciar.removeAttribute("onclick");

    btnVaciar.addEventListener("click", async () => {
      if (confirm("¿Seguro que quieres vaciar todo el carrito?")) {
        await vaciarCarritoBackend();
        await cargarYMostrarCarrito();
      }
    });
  }
}

(async function initCarrito() {
  if (!listaCarrito || !totalElement) return;

  await actualizarTipoCambio();
  await cargarYMostrarCarrito();
  configurarBotonVaciar();
})();

