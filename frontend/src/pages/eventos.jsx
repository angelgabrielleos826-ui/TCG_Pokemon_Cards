import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/EstiloEventos.css";
import Footer from "../components/Footer";


const eventosData = [
  {
    id: 1,
    nombre: "Torneo Pokémon TCG",
    fecha: "Sábado 15 de Febrero, 2026",
    hora: "10:00 AM - 6:00 PM",
    lugar: "Centro de Convenciones Cintermex, Monterrey",
    inscripcion: 150,
    descripcion: "Torneo oficial de Pokémon TCG formato estándar. Premios para los primeros 3 lugares incluyendo sobres, cartas promocionales y trofeos. ¡Todos los niveles bienvenidos!",
    imagen: "https://championships.pokemon.com/static-assets/images/subpage-header/regionals-logo.png",
    etiqueta: "PRÓXIMAMENTE",
    activo: true
  },
  {
    id: 2,
    nombre: "Digimon Card Game Championship",
    fecha: "Domingo 23 de Febrero, 2026",
    hora: "11:00 AM - 7:00 PM",
    lugar: "Plaza Sésamo, San Pedro Garza García",
    inscripcion: 200,
    descripcion: "Campeonato regional de Digimon Card Game. Formato suizo 5 rondas + top 8. Premios incluyen boxes sellados, playmat exclusivo y invitación al nacional.",
    imagen: "https://world.digimoncard.com/images/event/2025/championship/bnr.png?250321",
    etiqueta: "INSCRIPCIONES ABIERTAS",
    claseEtiqueta: "evento-activo",
    activo: true
  },
  {
    id: 3,
    nombre: "Yu-Gi-Oh! Duel Tournament",
    fecha: "Sábado 2 de Marzo, 2026",
    hora: "12:00 PM - 8:00 PM",
    lugar: "Fundidora Park Gaming Zone, Monterrey",
    inscripcion: 180,
    descripcion: "Torneo oficial Yu-Gi-Oh! TCG Advanced Format. Sistema suizo + eliminación directa. Premios: sobres de las últimas expansiones, tokens metálicos y mat oficial.",
    imagen: "https://www.yugioh-card.com/eu/wp-content/uploads/2022/07/events-03.webp",
    etiqueta: "PRÓXIMAMENTE",
    activo: true
  },
  {
    id: 4,
    nombre: "Torneo Casual Multi-TCG",
    fecha: "Domingo 26 de Enero, 2026",
    hora: "2:00 PM - 6:00 PM",
    lugar: "Comic Store MTY, Santa Catarina",
    inscripcion: 0,
    descripcion: "Evento casual para todos los TCGs. Ambiente relajado, intercambios de cartas, y mini torneos. Perfecto para principiantes y veteranos que buscan divertirse.",
    imagen: "https://www.yugioh-card.com/eu/wp-content/uploads/2022/07/events-05.webp",
    etiqueta: "FINALIZADO",
    claseEtiqueta: "evento-finalizado",
    activo: false
  }
];

export default function Eventos() {
  const [modalRegistro, setModalRegistro] = useState(null);
  const [modalRecibo, setModalRecibo] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "", anio: "", mes: "", dia: "", boletos: 1
  });

  const abrirModal = (evento) => {
    setModalRegistro(evento);
    setFormData({ nombre: "", anio: "", mes: "", dia: "", boletos: 1 });
  };

  const cerrarModal = () => setModalRegistro(null);

  const calcularTotal = () => {
    if (!modalRegistro) return 0;
    return formData.boletos * modalRegistro.inscripcion;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, anio, mes, dia, boletos } = formData;

    if (!nombre || !anio || !mes || !dia) {
      alert("Por favor completa todos los campos");
      return;
    }

    const recibo = {
      evento: modalRegistro.nombre,
      nombre,
      nacimiento: `${anio}-${mes}-${dia}`,
      boletos,
      total: `$${calcularTotal()} MXN`,
      fecha: new Date().toLocaleString(),
      folio: "TCG-" + Math.floor(Math.random() * 1000000)
    };

    setModalRegistro(null);
    setModalRecibo(recibo);
  };

  const descargarRecibo = () => {
    const ventana = window.open("", "_blank");
    ventana.document.write(`
      <html>
        <head><title>Recibo</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .recibo { max-width: 600px; margin: auto; border: 1px solid #000; padding: 20px; }
          h2 { text-align: center; }
        </style>
        </head>
        <body>
          <div class="recibo">
            <h2>Recibo de Pago</h2>
            <p><strong>Evento:</strong> ${modalRecibo.evento}</p>
            <p><strong>Nombre:</strong> ${modalRecibo.nombre}</p>
            <p><strong>Fecha de nacimiento:</strong> ${modalRecibo.nacimiento}</p>
            <p><strong>Boletos:</strong> ${modalRecibo.boletos}</p>
            <p><strong>Total pagado:</strong> ${modalRecibo.total}</p>
            <p><strong>Fecha de compra:</strong> ${modalRecibo.fecha}</p>
            <p><strong>Folio:</strong> ${modalRecibo.folio}</p>
          </div>
        </body>
      </html>
    `);
    ventana.document.close();
    ventana.print();
    ventana.close();
  };

  return (
    <div className="eventos-page">
      <header>
        <ul className="volver-li">
          <Link to="/home" className="btn-volver">Volver</Link>
        </ul>
        <h1>Torneos TCG Monterrey</h1>
        <p className="subtitulo">Encuentros y Batalla de Cartas</p>
      </header>

      <main className="contenedor-eventos">
        {eventosData.map((evento) => (
          <section className="evento" key={evento.id}>
            <div className="evento-imagen">
              <img src={evento.imagen} alt={evento.nombre} />
              <div className={`etiqueta ${evento.claseEtiqueta || ""}`}>
                {evento.etiqueta}
              </div>
            </div>
            <div className="evento-info">
              <h2>{evento.nombre}</h2>
              <div className="detalles">
                <p><strong>📅 Fecha:</strong> {evento.fecha}</p>
                <p><strong>🕐 Hora:</strong> {evento.hora}</p>
                <p><strong>📍 Lugar:</strong> {evento.lugar}</p>
                <p><strong>💰 Inscripción:</strong> {evento.inscripcion === 0 ? "Gratis" : `$${evento.inscripcion} MXN`}</p>
              </div>
              <p className="descripcion">{evento.descripcion}</p>
              {evento.activo ? (
                <button className="btn-registro" onClick={() => abrirModal(evento)}>
                  Registrarse Ahora
                </button>
              ) : (
                <button className="btn-registro" disabled>Evento Finalizado</button>
              )}
            </div>
          </section>
        ))}
      </main>

      {/* MODAL REGISTRO */}
      {modalRegistro && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && cerrarModal()}>
          <div className="modal-contenido">
            <button className="cerrar" onClick={cerrarModal}>×</button>
            <h2>Registro al Torneo</h2>
            <p><strong>Evento: {modalRegistro.nombre}</strong></p>
            <form onSubmit={handleSubmit}>
              <label>Nombre completo</label>
              <input type="text" placeholder="Nombre completo" required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />

              <label>Fecha de nacimiento</label>
              <div className="fecha">
                <input type="number" placeholder="Año" required
                  value={formData.anio}
                  onChange={(e) => setFormData({ ...formData, anio: e.target.value })} />
                <input type="number" placeholder="Mes" min="1" max="12" required
                  value={formData.mes}
                  onChange={(e) => setFormData({ ...formData, mes: e.target.value })} />
                <input type="number" placeholder="Día" min="1" max="31" required
                  value={formData.dia}
                  onChange={(e) => setFormData({ ...formData, dia: e.target.value })} />
              </div>

              <label>Cantidad de boletos</label>
              <input type="number" min="1" required
                value={formData.boletos}
                onChange={(e) => setFormData({ ...formData, boletos: Number(e.target.value) })} />

              <label>Total a pagar</label>
              <input type="text" readOnly value={`$${calcularTotal()} MXN`} />

              <button type="submit" className="btn-registro" style={{ marginTop: "15px" }}>
                Inscribirse
              </button>
            </form>
          </div>
        </div>
      )}

      {modalRecibo && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalRecibo(null)}>
          <div className="modal-contenido recibo">
            <button className="cerrar" onClick={() => setModalRecibo(null)}>×</button>
            <h2>Recibo de Pago</h2>
            <p><strong>Evento:</strong> {modalRecibo.evento}</p>
            <p><strong>Nombre:</strong> {modalRecibo.nombre}</p>
            <p><strong>Fecha de nacimiento:</strong> {modalRecibo.nacimiento}</p>
            <p><strong>Boletos:</strong> {modalRecibo.boletos}</p>
            <p><strong>Total pagado:</strong> {modalRecibo.total}</p>
            <p><strong>Fecha de compra:</strong> {modalRecibo.fecha}</p>
            <p><strong>Folio:</strong> {modalRecibo.folio}</p>
            <button className="btn-confirmar" onClick={descargarRecibo}>
              Descargar Recibo
            </button>
          </div>
        </div>
      )}

      <Footer/>
    </div>
  );
}