const contenedor = document.getElementById("productos");
const listaCarrito = document.getElementById("listaCarrito");
const total = document.getElementById("total");

let carrito = [];

// === 1️⃣ Cargar cartas desde MongoDB ===
async function cargarProductos() {
  try {
    const res = await fetch("http://localhost:3000/api/cards");
    const productos = await res.json();
    mostrarProductos(productos);
  } catch (err) {
    console.error("Error cargando cartas:", err);
  }
}

// === 2️⃣ Mostrar cartas en la página ===
function mostrarProductos(productos) {
  contenedor.innerHTML = "";
  productos.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <p>${p.name}</p>
      <p>$${p.price}</p>
      <button onclick="agregar('${p._id}', '${p.name}', ${p.price}, '${p.image}')">Agregar</button>
    `;

    contenedor.appendChild(div);
  });
}

// === 3️⃣ Agregar carta al carrito (en memoria) ===
function agregar(id, nombre, precio, img) {
  carrito.push({ id, nombre, precio, img });
  actualizarCarrito();
}

// === 4️⃣ Actualizar lista del carrito ===
function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let suma = 0;

  carrito.forEach((p, i) => {
    suma += p.precio;
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${p.img}" width="40" style="vertical-align: middle; margin-right: 10px;">
      ${p.nombre} - $${p.precio}
      <button onclick="eliminar(${i})">❌</button>
    `;
    listaCarrito.appendChild(li);
  });

  total.textContent = suma;
}

// === 5️⃣ Eliminar una carta del carrito ===
function eliminar(i) {
  carrito.splice(i, 1);
  actualizarCarrito();
}

// === 6️⃣ Vaciar carrito ===
function vaciarCarrito() {
  carrito = [];
  actualizarCarrito();
}

// === 7️⃣ Cargar cartas al abrir la página ===
cargarProductos();