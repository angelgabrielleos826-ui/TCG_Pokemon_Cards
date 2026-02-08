//-- Clase Pedido: encargada de representar un pedido y su estado
class Pedido {
  constructor(nombre, est = "En proceso"){
    this.nombre = nombre;
    this.estado = est;
  }

  cambiarEstado(){
    this.estado = this.estado === "En proceso"
      ? "Finalizado"
      : "En proceso";
  }
}

  // --- Clase GestPedido: gestion de los nuevos pedidos
class GestPedido {
  constructor() {
    this.pedidos = [];
  }

  regisPedido(nombre) {
    const pedido = new Pedido(nombre);
    this.pedidos.push(pedido);
  }

  obtPedidos() {
    return this.pedidos;
  }

  cambiarEstado(ind) {
    this.pedidos[ind].cambiarEstado();
  }
}

// --- Seleccion de elementos importantes ---
const cartas = document.querySelectorAll('.carta');
const btnAgregarCarrito = document.getElementById('btn-agregar-carrito');
const listaCarrito = document.getElementById('lista-carrito');

// --- Variables ---
let seleccionadas = [];
let carrito = [];

// --- Seleccionar cartas ---
cartas.forEach(carta => {
  carta.addEventListener('click', () => {
    const nombre = carta.dataset.nombre;
    carta.classList.toggle('seleccionada');

    if (carta.classList.contains('seleccionada')) {
      seleccionadas.push(nombre);
    } else {
      seleccionadas = seleccionadas.filter(c => c !== nombre);
    }

    // Mostrar / ocultar el botón flotante
    btnAgregarCarrito.classList.toggle('oculto', seleccionadas.length === 0);
  });
});

// --- Agregar cartas seleccionadas al carrito ---
btnAgregarCarrito.addEventListener('click', () => {
  seleccionadas.forEach(nombre => {
    carrito.push(new Pedido(nombre));
  });

  renderizarCarrito();

  // Limpiar selección
  seleccionadas = [];
  cartas.forEach(c => c.classList.remove('seleccionada'));
  btnAgregarCarrito.classList.add('oculto');
});

// --- Mostrar carrito ---
function renderizarCarrito() {
  listaCarrito.innerHTML = '';

  carrito.forEach((pedido, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>
      ${pedido.nombre}
      <strong>(${pedido.estado})</strong>
      </span>
      <div>
        <button class="editar" data-index="${index}">Editar</button>
        <button class="estado" data-index="${index}">Cambiar Estado</button>
        <button class="eliminar" data-index="${index}">Eliminar</button>
      </div>
    `;
    listaCarrito.appendChild(li);
  });
  // Mostrar el carrito con animación
  const contenedorCarrito = document.getElementById('carrito');
  contenedorCarrito.classList.toggle('mostrar', carrito.length > 0);
  }


// --- Editar o eliminar cartas del carrito ---
listaCarrito.addEventListener('click', e => {
  const index = Number(e.target.dataset.index);

  if (e.target.classList.contains('eliminar')) {
    carrito.splice(index, 1);
    renderizarCarrito();
  }

  if (e.target.classList.contains('editar')) {
    const nuevoNombre = prompt(
      'Nuevo nombre del pedido:',
       carrito[index].nombre
    );
    if (nuevoNombre) {
      carrito[index].nombre = nuevoNombre;
      renderizarCarrito();
    }
  }
  if (e.target.classList.contains('estado')) {
    carrito[index].cambiarEstado(); 
    renderizarCarrito();
  }
});

// ============================================================
// EXTENSIÓN PARA CONECTAR CON EL BACKEND
// ============================================================

let cartasDelBackend = [];
let btnIrAlCarrito = null;

// Crear botón para ir al carrito (si no existe)
function crearBotonIrCarrito() {
  if (document.getElementById('btn-ir-carrito-backend')) return;

  const btn = document.createElement('button');
  btn.id = 'btn-ir-carrito-backend';
  btn.innerHTML = '🛒 COMPRAR!';
  btn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background-color: #FF9800;
    color: white;
    padding: 15px 25px;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-size: 18px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    z-index: 1000;
  `;
  
  btn.addEventListener('click', () => {
    window.location.href = 'Cart.html';
  });
  
  document.body.appendChild(btn);
}

// Modificar el botón "Agregar al carrito" para usar el backend
async function conectarConBackend() {
  // Cargar cartas del backend
  if (typeof obtenerCartasBackend === 'function') {
    cartasDelBackend = await obtenerCartasBackend();
  }

  // Crear botón para ir al carrito
  crearBotonIrCarrito();

  // Modificar el evento del botón "Agregar al carrito"
  const btnOriginal = document.getElementById('btn-agregar-carrito');
  
  if (btnOriginal) {
    // Clonar el botón para eliminar eventos anteriores
    const btnNuevo = btnOriginal.cloneNode(true);
    btnOriginal.parentNode.replaceChild(btnNuevo, btnOriginal);

    // Agregar nuevo evento que usa el backend
    btnNuevo.addEventListener('click', async () => {
      if (!verificarAutenticacion()) return;

      let exitosos = 0;

      for (const nombreCarta of seleccionadas) {
        const cardId = buscarIdPorNombre(nombreCarta, cartasDelBackend);
        
        if (cardId) {
          const ok = await agregarCartaAlBackend(cardId, 1);
          if (ok) exitosos++;
        } else {
          console.error(`No se encontró el ID para: ${nombreCarta}`);
        }
      }

      if (exitosos > 0) {
        alert(`${exitosos} carta(s) agregada(s) al carrito ✅`);
      }

      // Limpiar selección (mantener la lógica original)
      seleccionadas = [];
      cartas.forEach(c => c.classList.remove('seleccionada'));
      btnNuevo.classList.add('oculto');
    });
  }
}

// Inicializar conexión con backend
if (typeof obtenerCartasBackend === 'function') {
  conectarConBackend();
}