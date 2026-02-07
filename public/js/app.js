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