document.addEventListener("DOMContentLoaded", () => {

    let precioBoleto = 0;
    let nombreEvento = "";

    // ===== MODAL REGISTRO =====
    const modal = document.getElementById("modalRegistro");
    const cerrarBtn = document.getElementById("cerrarModal");
    const boletosInput = document.getElementById("boletos");
    const totalInput = document.getElementById("total");
    const eventoTexto = document.getElementById("eventoSeleccionado");

    function abrirModal(precio, evento) {
        precioBoleto = precio;
        nombreEvento = evento;

        boletosInput.value = 1;
        eventoTexto.textContent = "Evento: " + nombreEvento;

        modal.style.display = "flex";
        document.body.style.overflow = "hidden";

        calcularTotal();
    }

    function cerrarModal() {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }

    function calcularTotal() {
        const cantidad = Number(boletosInput.value) || 0;
        const total = cantidad * precioBoleto;
        totalInput.value = "$" + total + " MXN";
    }

    cerrarBtn.addEventListener("click", cerrarModal);

    modal.addEventListener("click", e => {
        if (e.target === modal) cerrarModal();
    });

    boletosInput.addEventListener("input", calcularTotal);

    window.abrirModal = abrirModal;

    // ===== MODAL RECIBO =====
    const modalRecibo = document.getElementById("modalRecibo");
    const btnCerrarRecibo = document.querySelector(".cerrar-recibo");

    btnCerrarRecibo.addEventListener("click", () => {
        modalRecibo.style.display = "none";
        document.body.style.overflow = "auto";
    });

    modalRecibo.addEventListener("click", e => {
        if (e.target === modalRecibo) {
            modalRecibo.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });

    const formRegistro = document.getElementById("formRegistro");

    formRegistro.addEventListener("submit", (e) => {
        e.preventDefault();
        mostrarRecibo();
    });

    function mostrarRecibo() {
        const nombre = document.getElementById("nombre").value;
        const anio = document.getElementById("anio").value;
        const mes = document.getElementById("mes").value;
        const dia = document.getElementById("dia").value;

        if (!nombre || !anio || !mes || !dia) {
            alert("Por favor completa todos los campos");
            return;
        }

        document.getElementById("rEvento").textContent = nombreEvento;
        document.getElementById("rNombre").textContent = nombre;
        document.getElementById("rNacimiento").textContent =
            `${anio}-${mes}-${dia}`;
        document.getElementById("rBoletos").textContent = boletosInput.value;
        document.getElementById("rTotal").textContent = totalInput.value;
        document.getElementById("rFecha").textContent =
            new Date().toLocaleString();
        document.getElementById("rFolio").textContent =
            "TCG-" + Math.floor(Math.random() * 1000000);

        modal.style.display = "none";
        modalRecibo.style.display = "flex";
    }

    window.mostrarRecibo = mostrarRecibo;

        function descargarRecibo() {
        const recibo = document.querySelector('.modal-contenido.recibo');

        const ventana = window.open('', '_blank');

        ventana.document.write(`
            <html>
            <head>
                <title>Recibo</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                    }

                    .recibo {
                        max-width: 600px;
                        margin: auto;
                        border: 1px solid #000;
                        padding: 20px;
                    }

                    h2 {
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                ${recibo.outerHTML}
            </body>
            </html>
        `);

        ventana.document.close();
        ventana.focus();

        ventana.print();
        ventana.close();
    }

    window.descargarRecibo = descargarRecibo;
    
});