// Operacion base para la pagina
document.addEventListener("DOMContentLoaded", async () => {
    
    const btnCrear = document.getElementById("btnCrearEvento");
    
    try {
        const res = await fetch("http://localhost:3000/api/auth/me", {
            credentials: "include"
        });

        if (!res.ok) return;

        const user = await res.json();

        if (user.role === "admin") {
            document.getElementById("btnCrearEvento").style.display = "block";
        }
    } catch (err) {
        console.log("No autenticado");
    }

    if (btnCrear) {
        btnCrear.addEventListener("click", () => {
            console.log("CLICK DETECTADO");
            mostrarFormulario();
        });
    }

    cargarEventos();
});

function mostrarFormulario() {

    if (document.getElementById("modalEvento")) return;

    const formHTML = `
        <div id="modalEvento" class="modal modal-crear-evento">
            <div class="modal-contenido evento-form">
                <span class="cerrar" onclick="cerrarModal()">×</span>
                <h2>Crear Nuevo Evento</h2>

                <div class="form-grid">
                    <div>
                        <label>Nombre</label>
                        <input id="nombre" type="text" placeholder="Ej. Torneo Yu-Gi-Oh!">
                    </div>

                    <div>
                        <label>Fecha</label>
                        <input id="fecha" type="date">
                    </div>

                    <div>
                        <label>Hora Inicio</label>
                        <input id="horaInicio" type="time">
                    </div>

                    <div>
                        <label>Hora Fin</label>
                        <input id="horaFin" type="time">
                    </div>

                    <div>
                        <label>Lugar</label>
                        <input id="lugar" type="text" placeholder="Ej. Fundidora">
                    </div>

                    <div>
                        <label>Entrada ($)</label>
                        <input id="entrada" type="number" min="0">
                    </div>

                    <div class="full">
                        <label>Descripción</label>
                        <textarea id="descripcion" rows="3"></textarea>
                    </div>

                    <div class="full">
                        <label>URL Imagen</label>
                        <input id="imagen" type="text" placeholder="https://...">
                    </div>
                </div>

                <button class="btn-registro" onclick="crearEvento()">Guardar Evento</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", formHTML);
    document.getElementById("modalEvento").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modalEvento").remove();
}

async function crearEvento() {

    const data = {
        nombre: document.getElementById("nombre").value,
        fecha: document.getElementById("fecha").value,
        horaInicio: document.getElementById("horaInicio").value,
        horaFin: document.getElementById("horaFin").value,
        lugar: document.getElementById("lugar").value,
        entrada: parseFloat(document.getElementById("entrada").value),
        descripcion: document.getElementById("descripcion").value,
        imagen: document.getElementById("imagen").value,
        activo: true
    };

        console.log("ENVIANDO:", data);

    try {
        const res = await fetch("http://localhost:3000/api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(data)
        });

        const text = await res.text();
        console.log("RESPUESTA BACKEND:", text);

        if (res.ok) {
            alert("Evento creado correctamente");
            location.reload();
        } else {
            alert("Error backend: " + text);
        }

    } catch (error) {
        console.error("ERROR FETCH:", error);
    }
}

async function cargarEventos() {

    const res = await fetch("http://localhost:3000/api/events");
    const data = await res.json();

    const contenedor = document.querySelector(".contenedor-eventos");

    const eventos = data.items;

    if (!eventos || eventos.length === 0) {
        contenedor.innerHTML = `
            <p style="color:white; text-align:center;">
                No hay eventos registrados todavía.
            </p>
        `;
        return;
    }

    eventos.forEach(evento => {
        renderEvento(evento);
    });
}

function formatearHora(hora) {
    if (!hora) return "";

    const [h, m] = hora.split(":");
    const date = new Date();
    date.setHours(h, m);

    return date.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}

function renderEvento(evento) {

    const contenedor = document.querySelector(".contenedor-eventos");
    const fecha = new Date(evento.fecha).toLocaleDateString("es-MX");

    const imagen = evento.imagen || 
        "https://images.unsplash.com/photo-1511512578047-dfb367046420";

    const card = `
        <section class="evento">
            <div class="evento-imagen">
                <img src="${imagen}" alt="Evento">
                <div class="etiqueta ${evento.activo ? 'evento-activo' : 'evento-finalizado'}">
                    ${evento.activo ? "ACTIVO" : "FINALIZADO"}
                </div>
            </div>

            <div class="evento-info">
                <h2>${evento.nombre}</h2>

                <div class="detalles">
                    <p><strong>Fecha:</strong> ${fecha}</p>
                    <p><strong>Hora:</strong>
                        ${formatearHora(evento.horaInicio)} -
                        ${formatearHora(evento.horaFin)}
                    </p>
                    <p><strong>Lugar:</strong> ${evento.lugar}</p>
                    <p><strong>Entrada:</strong> $${evento.entrada}</p>
                </div>

                <p class="descripcion">${evento.descripcion}</p>

                ${
                    evento.activo
                    ? `
                    <button class="btn-registro"
                        onclick="abrirRegistro('${evento._id}', ${evento.entrada}, '${evento.nombre}')">
                        Reservar Lugar
                    </button>
                    `
                    : `<button class="btn-registro" disabled>Evento Finalizado</button>`
                }
            </div>
        </section>
    `;

    contenedor.insertAdjacentHTML("beforeend", card);
}

function abrirRegistro(eventId, precio, nombre) {

    if (document.getElementById("modalRegistro")) return;

    const modal = `
        <div id="modalRegistro" class="modal">
            <div class="modal-contenido registro-form">

                <span class="cerrar" onclick="cerrarRegistro()">×</span>

                <h2>${nombre}</h2>

                <div class="form-grid">

                    <div class="full">
                        <label>Nombre Completo</label>
                        <input id="nombreCompleto" type="text">
                    </div>

                    <div>
                        <label>Fecha de Nacimiento</label>
                        <input id="fechaNacimiento" type="date">
                    </div>

                    <div>
                        <label>Boletos</label>
                        <input id="boletos" type="number" min="1" value="1"
                            onchange="calcularTotal(${precio})">
                    </div>

                    <div class="full">
                        <h3>Total: $<span id="totalPago">${precio}</span></h3>
                    </div>

                    <hr>

                    <div class="full">
                        <label>Número de Tarjeta</label>
                        <input id="tarjetaNumero" maxlength="16">
                    </div>

                    <div>
                        <label>CVV</label>
                        <input 
                            id="tarjetaCVV"
                            type="text"
                            maxlength="3"
                            pattern="\d{3}"
                            inputmode="numeric"
                        >
                    </div>

                    <div>
                        <label>Vencimiento</label>
                        <input 
                            id="tarjetaVencimiento"
                            placeholder="MM/YY"
                            maxlength="5"
                            pattern="^(0[1-9]|1[0-2])\/\d{2}$"
                            oninput="formatearVencimiento(this)"
                        >
                    </div>

                </div>

                <button class="btn-registro"
                    onclick="registrarseEvento('${eventId}', ${precio})">
                    Confirmar Pago
                </button>

            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modal);
    document.getElementById("modalRegistro").style.display = "flex";
}

function calcularTotal(precio){

    const boletos =
        parseInt(document.getElementById("boletos").value) || 1;

    document.getElementById("totalPago").innerText =
        boletos * precio;
}

function cerrarRegistro() {
    document.getElementById("modalRegistro").remove();
}

async function registrarseEvento(eventId, precio) {

    const nombreCompleto =
        document.getElementById("nombreCompleto").value.trim();

    const fechaNacimiento =
        document.getElementById("fechaNacimiento").value;

    const boletos =
        parseInt(document.getElementById("boletos").value) || 1;

    const tarjetaNumero =
        document.getElementById("tarjetaNumero").value.trim();

    const tarjetaVencimiento =
        document.getElementById("tarjetaVencimiento").value.trim();

    // Validaciones básicas
    if (!nombreCompleto || !fechaNacimiento || !tarjetaNumero || !tarjetaVencimiento) {
        alert("Completa todos los campos");
        return;
    }

    if (!/^\d{16}$/.test(tarjetaNumero)) {
        alert("La tarjeta debe tener 16 números");
        return;
    }

    const lastFour = tarjetaNumero.slice(-4);

    const totalPagado = boletos * precio;

    try {

        const res = await fetch(
            "http://localhost:3000/api/registrations",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    evento: eventId,
                    nombreCompleto,
                    fechaNacimiento,
                    boletos,
                    lastFour,
                    tarjetaVencimiento,
                    totalPagado
                })
            }
        );

        const data = await res.json();
        console.log("RESPUESTA REGISTRO:", data);

        if (res.ok) {
            alert("✅ Registro completado");
            cerrarRegistro();
        } else {
            alert(data.error || "Error al registrar");
        }

    } catch (err) {
        console.error(err);
        alert("Error de conexión");
    }
}

function formatearVencimiento(input){

    let value = input.value.replace(/\D/g, "");

    if(value.length >= 3){
        value =
            value.substring(0,2) +
            "/" +
            value.substring(2,4);
    }

    input.value = value;
}