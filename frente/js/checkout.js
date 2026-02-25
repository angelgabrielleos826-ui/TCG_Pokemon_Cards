// checkout.js - Lógica del modo de pago
const API_URL_ORDERS = "http://localhost:3000/api";

function abrirModalPago() {
    const totalVisible = document.getElementById("total").textContent;

    if (!totalVisible || totalVisible === "0") {
        alert("Tu carrito está vacío. Agrega cartas antes de pagar.");
        return;
    }

    document.getElementById("totalModal").textContent = totalVisible;
    document.getElementById("formPago").style.display = "block";
    document.getElementById("mensajeExito").classList.remove("activo");
    document.getElementById("errorMsg").classList.remove("activo");
    const ticketContainer = document.getElementById("ticketContainer");
    if (ticketContainer) ticketContainer.classList.remove("activo");
    document.getElementById("modalPago").classList.add("activo");
}

function cerrarModalPago() {
    document.getElementById("modalPago").classList.remove("activo");
    limpiarFormulario();
}

function limpiarFormulario() {
    const campos = ["fullName", "phone", "address", "city", "zip",
        "cardHolder", "cardNumber", "cardExpiry", "cardCVV"];

    campos.forEach(id => document.getElementById(id).value = "");
    document.getElementById("cardType").value = "";
    document.getElementById("errorMsg").classList.remove("activo");
}

function validarFormulario() {
    const campos = ["fullName", "phone", "address", "city", "zip",
                    "cardType", "cardHolder", "cardNumber", "cardExpiry", "cardCVV"];
    for (const campo of campos) {
        if (!document.getElementById(campo).value.trim()) return false;
    }
    return true;
}

function formatMoney(value) {  //de la linea 50 hasta la 78 utilice IA
    const number = Number(value || 0);
    return number.toFixed(2);
}

function mostrarTicket(ticket) {
    const ticketContainer = document.getElementById("ticketContainer");
    if (!ticketContainer || !ticket) return;

    const fecha = new Date(ticket.fecha || ticket.createdAt || Date.now()).toLocaleString("es-MX");

    const productos = (ticket.productos || []).map((p) => `
        <li class="ticket-item">
            <span>${p.nombre} x${p.cantidad}</span>
            <strong>$${formatMoney(p.subtotal)}</strong>
        </li>
    `).join("");

    ticketContainer.innerHTML = `
        <h2>Ticket de compra</h2>
        <p><strong>Orden:</strong> ${ticket.numeroOrden}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Método de pago:</strong> ${ticket.metodoPago || "Tarjeta"}</p>
        <ul class="ticket-list">${productos}</ul>
        <p class="ticket-total"><strong>Total:</strong> $${formatMoney(ticket.total)}</p>
    `;

    ticketContainer.classList.add("activo");
}

async function confirmarCompra() {
    if (!validarFormulario()) {
        document.getElementById("errorMsg").classList.add("activo");
        return;
    }

    const btnConfirmar = document.getElementById("btnConfirmar");
    btnConfirmar.disabled = true;
    btnConfirmar.textContent = "Procesando...";

    const shippingInfo = {
        fullName: document.getElementById("fullName").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        city: document.getElementById("city").value.trim(),
        zip: document.getElementById("zip").value.trim()
    };

    const cardInfo = {
        cardType: document.getElementById("cardType").value,
        cardHolder: document.getElementById("cardHolder").value.trim(),
        cardNumber: document.getElementById("cardNumber").value.replace(/\s/g, "")
    };

    const total = parseFloat(document.getElementById("total").textContent);

    const token = localStorage.getItem("jwt_token");

    try {
        const response = await fetch(`${API_URL_ORDERS}/orders/checkout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                shippingInfo,
                cardInfo,
                total
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Error al procesar la compra");
        }

        document.getElementById("formPago").style.display = "none";
        document.getElementById("mensajeExito").classList.add("activo");
        mostrarTicket(data.ticket);

        if (typeof cargarCarrito === "function") {
            await cargarCarrito();
        }

        btnConfirmar.disabled = false;
        btnConfirmar.textContent = "Confirmar Compra";
    } catch (error) {
        console.error("Error en checkout:", error);
        const errorMsg = document.getElementById("errorMsg");
        errorMsg.textContent = `${error.message}`;
        errorMsg.classList.add("activo");
        btnConfirmar.disabled = false;
        btnConfirmar.textContent = "Confirmar Compra";
    }
}

// Formateo automático del número de tarjeta
document.addEventListener("DOMContentLoaded", () => {     //Aqui utilice IA
    const inputNumero = document.getElementById("cardNumber");
    if (inputNumero) {
        inputNumero.addEventListener("input", (e) => {
            let valor = e.target.value.replace(/\D/g, "");
            valor = valor.match(/.{1,4}/g)?.join(" ") || valor;
            e.target.value = valor;
        });
    }

    const inputExpiry = document.getElementById("cardExpiry");
    if (inputExpiry) {
        inputExpiry.addEventListener("input", (e) => {
            let valor = e.target.value.replace(/\D/g, "");
            if (valor.length >= 3) {
                valor = valor.slice(0, 2) + "/" + valor.slice(2, 4);
            }
            e.target.value = valor;
        });
    }
    // Solo letras en nombre completo y nombre de tarjeta   utilice IA en esto tambien 
    const inputFullName = document.getElementById("fullName");
    if (inputFullName) {
        inputFullName.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/[0-9]/g, "");
        });
    }

    const inputCardHolder = document.getElementById("cardHolder");
    if (inputCardHolder) {
        inputCardHolder.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/[0-9]/g, "");
        });
    } 

    const overlay = document.getElementById("modalPago");
    if (overlay) {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) cerrarModalPago();
        });
    }
});
