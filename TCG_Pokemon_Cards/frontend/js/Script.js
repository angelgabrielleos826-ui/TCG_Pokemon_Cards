const productos = [
    { id: 1, nombre: "Carta 1", precio: 50, img: "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_1.png" },
    { id: 2, nombre: "Carta 2", precio: 40, img: "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_2.png" },
    { id: 3, nombre: "Carta 3", precio: 60, img: "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_3.png" },
    { id: 4, nombre: "Carta 4", precio: 35, img: "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_4.png" }
];

let carrito = [];

const contenedor = document.getElementById("productos");
const listaCarrito = document.getElementById("listaCarrito");
const total = document.getElementById("total");

/* Mostrar productos */
productos.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
        <img src="${p.img}">
        <p>${p.nombre}</p>
        <p>$${p.precio}</p>
        <button onclick="agregar(${p.id})">Agregar</button>
    `;

    contenedor.appendChild(div);
});

/* Agregar al carrito */
function agregar(id) {
    const producto = productos.find(p => p.id === id);
    carrito.push(producto);
    actualizarCarrito();
}

/* Actualizar carrito */
function actualizarCarrito() {
    listaCarrito.innerHTML = "";
    let suma = 0;

    carrito.forEach((p, i) => {
        suma += p.precio;

        const li = document.createElement("li");
        li.innerHTML = `${p.nombre} - $${p.precio} 
            <button onclick="eliminar(${i})">❌</button>`;

        listaCarrito.appendChild(li);
    });

    total.textContent = suma;
}

/* Eliminar */
function eliminar(i) {
    carrito.splice(i, 1);
    actualizarCarrito();
}

/* Vaciar */
function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
}
