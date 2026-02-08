// cartPage.js - Lógica para la página Cart.html

let carritoActual = null;
let totalActual = 0;

// Elementos del DOM
const listaCarrito = document.getElementById("listaCarrito");
const totalElement = document.getElementById("total");

// Cargar y mostrar el carrito
async function cargarYMostrarCarrito() {
  const data = await obtenerCarritoBackend();
  
  if (!data) {
    listaCarrito.innerHTML = "<li>Error al cargar el carrito</li>";
    return;
  }

  carritoActual = data.cart;
  totalActual = data.total;

  mostrarCarrito();
}

// Renderizar carrito en HTML
function mostrarCarrito() {
  listaCarrito.innerHTML = "";

  if (!carritoActual || carritoActual.items.length === 0) {
    listaCarrito.innerHTML = "<li style='text-align: center; padding: 20px;'>Tu carrito está vacío 🛒</li>";
    totalElement.textContent = "0";
    return;
  }

  carritoActual.items.forEach(item => {
    const { card, quantity } = item;
    const subtotal = card.price * quantity;

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
      <img src="${card.image}" alt="${card.name}" style="width: 100px; height: auto; border-radius: 5px;">
      <div style="flex: 1;">
        <h3 style="margin: 0 0 5px 0;">${card.name}</h3>
        <p style="margin: 3px 0;">Precio unitario: $${card.price}</p>
        <p style="margin: 3px 0; font-weight: bold;">Subtotal: $${subtotal}</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <button class="btn-menos" data-id="${card._id}" style="padding: 5px 15px; cursor: pointer; font-size: 18px;">-</button>
        <span style="font-weight: bold; font-size: 18px; min-width: 30px; text-align: center;">${quantity}</span>
        <button class="btn-mas" data-id="${card._id}" style="padding: 5px 15px; cursor: pointer; font-size: 18px;">+</button>
        <button class="btn-eliminar" data-id="${card._id}" style="padding: 5px 15px; cursor: pointer; background: #ff4444; color: white; border: none; border-radius: 5px;">🗑️</button>
      </div>
    `;

    listaCarrito.appendChild(li);
  });

  totalElement.textContent = totalActual;
}

// Manejar clics en botones del carrito
listaCarrito.addEventListener("click", async (e) => {
  const cardId = e.target.dataset.id;

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

// Botón vaciar carrito
function configurarBotonVaciar() {
  // Buscar el botón de vaciar que ya existe
  const btnVaciar = document.querySelector('button[onclick="vaciarCarrito()"]');
  
  if (btnVaciar) {
    // Eliminar el evento anterior
    btnVaciar.removeAttribute('onclick');
    
    // Agregar nuevo evento
    btnVaciar.addEventListener('click', async () => {
      if (confirm("¿Seguro que quieres vaciar todo el carrito?")) {
        await vaciarCarritoBackend();
        await cargarYMostrarCarrito();
      }
    });
  }
}

// Inicializar la página
if (listaCarrito && totalElement) {
  cargarYMostrarCarrito();
  configurarBotonVaciar();
}