import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/css/EstiloEventos.css";

const API_URL = "http://localhost:3000/api";

const meetsData = [
  {
    id: 1,
    nombre: "Pokémon TCG Meet & Trade",
    fecha: "Sábado 7 de Marzo, 2026",
    hora: "4:00 PM - 8:00 PM",
    lugar: "Cafetería Board & Cards, Monterrey",
    entrada: 50,
    descripcion: "Evento especial para fans de Pokémon TCG. Intercambios de cartas, partidas amistosas, dinámicas y regalos sorpresa.",
    imagen: "https://pokechampionsdestiny.com/wp-content/uploads/2024/11/unnamed.jpg",
    etiqueta: "CUPO LIMITADO",
    claseEtiqueta: "evento-activo",
    activo: true
  },
  {
    id: 2,
    nombre: "Comunidad Digimon - Día Social",
    fecha: "Domingo 15 de Marzo, 2026",
    hora: "3:00 PM - 7:00 PM",
    lugar: "Plaza Fiesta San Agustín",
    entrada: 0,
    descripcion: "Reunión abierta para jugadores de Digimon Card Game. Actividades recreativas, deck building y networking entre jugadores.",
    imagen: "https://cdn.shopify.com/s/files/1/0896/5963/8102/files/TCG-Tournament.webp?v=1768841664",
    etiqueta: "PRÓXIMAMENTE",
    claseEtiqueta: "",
    activo: true
  },
  {
    id: 3,
    nombre: "Noche Casual Yu-Gi-Oh!",
    fecha: "Viernes 20 de Marzo, 2026",
    hora: "6:00 PM - 10:00 PM",
    lugar: "Fundidora Park - Área Gamer",
    entrada: 80,
    descripcion: "Evento nocturno con partidas casuales, retos amistosos y premios simbólicos. Ideal para relajarse y convivir.",
    imagen: "https://images.unsplash.com/photo-1511512578047-dfb367046420",
    etiqueta: "INSCRIPCIONES ABIERTAS",
    claseEtiqueta: "",
    activo: true
  },
  {
    id: 4,
    nombre: "Meet Multijuego Comunidad TCG",
    fecha: "Domingo 22 de Febrero, 2026",
    hora: "2:00 PM - 6:00 PM",
    lugar: "Comic Store MTY",
    entrada: 0,
    descripcion: "Convivencia para todos los TCGs con dinámicas y rifas. Gracias a todos los que asistieron.",
    imagen: "https://cdn.prod.website-files.com/635211fd6b73f08138eb152c/64d7374c04a893ff7e3a6768_AGC_134.webp",
    etiqueta: "FINALIZADO",
    claseEtiqueta: "evento-finalizado",
    activo: false
  }
];

export default function Meets() {
  const [eventosBackend, setEventosBackend] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalRegistro, setModalRegistro] = useState(null);
  const [modalCrear, setModalCrear] = useState(false);

  const [formRegistro, setFormRegistro] = useState({
    nombreCompleto: "", fechaNacimiento: "", boletos: 1,
    tarjetaNumero: "", tarjetaCVV: "", tarjetaVencimiento: ""
  });

  const [formCrear, setFormCrear] = useState({
    nombre: "", fecha: "", horaInicio: "", horaFin: "",
    lugar: "", entrada: 0, descripcion: "", imagen: ""
  });

  // Verificar si es admin
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
        if (!res.ok) return;
        const user = await res.json();
        if (user.role === "admin") setIsAdmin(true);
      } catch {
        console.log("No autenticado");
      }
    })();
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    try {
      const res = await fetch(`${API_URL}/events`);
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        setEventosBackend(data.items);
      }
    } catch (err) {
      console.error("Error cargando eventos:", err);
    }
  };

  const formatearHora = (hora) => {
    if (!hora) return "";
    const [h, m] = hora.split(":");
    const date = new Date();
    date.setHours(h, m);
    return date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const calcularTotal = () => {
    if (!modalRegistro) return 0;
    return formRegistro.boletos * modalRegistro.entrada;
  };

  const abrirModal = (evento) => {
    setModalRegistro(evento);
    setFormRegistro({ nombreCompleto: "", fechaNacimiento: "", boletos: 1, tarjetaNumero: "", tarjetaCVV: "", tarjetaVencimiento: "" });
  };

  const cerrarModal = () => setModalRegistro(null);

  const formatearVencimiento = (value) => {
    let digits = value.replace(/\D/g, "");
    if (digits.length >= 3) {
      digits = digits.substring(0, 2) + "/" + digits.substring(2, 4);
    }
    return digits;
  };

  const registrarseEvento = async (e) => {
    e.preventDefault();
    const { nombreCompleto, fechaNacimiento, boletos, tarjetaNumero, tarjetaVencimiento } = formRegistro;

    if (!nombreCompleto || !fechaNacimiento || !tarjetaNumero || !tarjetaVencimiento) {
      alert("Completa todos los campos");
      return;
    }

    if (!/^\d{16}$/.test(tarjetaNumero)) {
      alert("La tarjeta debe tener 16 números");
      return;
    }

    const lastFour = tarjetaNumero.slice(-4);
    const totalPagado = boletos * modalRegistro.entrada;

    try {
      const res = await fetch(`${API_URL}/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          evento: modalRegistro._id || modalRegistro.id,
          nombreCompleto, fechaNacimiento, boletos,
          lastFour, tarjetaVencimiento, totalPagado
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Registro completado");
        cerrarModal();
      } else {
        alert(data.error || "Error al registrar");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    }
  };

  const crearEvento = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formCrear, activo: true })
      });

      if (res.ok) {
        alert("Evento creado correctamente");
        setModalCrear(false);
        cargarEventos();
      } else {
        const text = await res.text();
        alert("Error: " + text);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const todosLosEventos = [...meetsData, ...eventosBackend.map(e => ({
    ...e,
    fecha: new Date(e.fecha).toLocaleDateString("es-MX"),
    hora: `${formatearHora(e.horaInicio)} - ${formatearHora(e.horaFin)}`,
    etiqueta: e.activo ? "ACTIVO" : "FINALIZADO",
    claseEtiqueta: e.activo ? "evento-activo" : "evento-finalizado"
  }))];

  return (
    <div className="eventos-page">
      <header>
        <ul className="volver-li">
          <Link to="/home" className="btn-volver">Volver</Link>
        </ul>
        <h1>Meets & Eventos TCG Monterrey</h1>
        <p className="subtitulo">Convivencias, intercambios y comunidad</p>
      </header>

      <main className="contenedor-eventos">
        {todosLosEventos.map((evento, index) => (
          <section className="evento" key={evento._id || evento.id || index}>
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
                <p><strong>💰 Entrada:</strong> {evento.entrada === 0 ? "Gratis" : `$${evento.entrada} MXN`}</p>
              </div>
              <p className="descripcion">{evento.descripcion}</p>
              {evento.activo ? (
                <button className="btn-registro" onClick={() => abrirModal(evento)}>
                  {evento.entrada === 0 ? "Confirmar Asistencia" : "Reservar Lugar"}
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
            <h2>{modalRegistro.nombre}</h2>
            <form onSubmit={registrarseEvento}>
              <label>Nombre Completo</label>
              <input type="text" required value={formRegistro.nombreCompleto}
                onChange={(e) => setFormRegistro({ ...formRegistro, nombreCompleto: e.target.value })} />

              <label>Fecha de Nacimiento</label>
              <input type="date" required value={formRegistro.fechaNacimiento}
                onChange={(e) => setFormRegistro({ ...formRegistro, fechaNacimiento: e.target.value })} />

              <label>Boletos</label>
              <input type="number" min="1" value={formRegistro.boletos}
                onChange={(e) => setFormRegistro({ ...formRegistro, boletos: Number(e.target.value) })} />

              <h3>Total: ${calcularTotal()} MXN</h3>

              <label>Número de Tarjeta</label>
              <input type="text" maxLength={16} required value={formRegistro.tarjetaNumero}
                onChange={(e) => setFormRegistro({ ...formRegistro, tarjetaNumero: e.target.value })} />

              <label>CVV</label>
              <input type="text" maxLength={3} required value={formRegistro.tarjetaCVV}
                onChange={(e) => setFormRegistro({ ...formRegistro, tarjetaCVV: e.target.value })} />

              <label>Vencimiento</label>
              <input type="text" placeholder="MM/YY" maxLength={5} required value={formRegistro.tarjetaVencimiento}
                onChange={(e) => setFormRegistro({ ...formRegistro, tarjetaVencimiento: formatearVencimiento(e.target.value) })} />

              <button type="submit" className="btn-registro" style={{ marginTop: "15px" }}>
                Confirmar Pago
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREAR EVENTO (solo admin) */}
      {modalCrear && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalCrear(false)}>
          <div className="modal-contenido">
            <button className="cerrar" onClick={() => setModalCrear(false)}>×</button>
            <h2>Crear Nuevo Evento</h2>
            <form onSubmit={crearEvento}>
              <label>Nombre</label>
              <input type="text" required value={formCrear.nombre}
                onChange={(e) => setFormCrear({ ...formCrear, nombre: e.target.value })} />

              <label>Fecha</label>
              <input type="date" required value={formCrear.fecha}
                onChange={(e) => setFormCrear({ ...formCrear, fecha: e.target.value })} />

              <label>Hora Inicio</label>
              <input type="time" value={formCrear.horaInicio}
                onChange={(e) => setFormCrear({ ...formCrear, horaInicio: e.target.value })} />

              <label>Hora Fin</label>
              <input type="time" value={formCrear.horaFin}
                onChange={(e) => setFormCrear({ ...formCrear, horaFin: e.target.value })} />

              <label>Lugar</label>
              <input type="text" required value={formCrear.lugar}
                onChange={(e) => setFormCrear({ ...formCrear, lugar: e.target.value })} />

              <label>Entrada ($)</label>
              <input type="number" min="0" value={formCrear.entrada}
                onChange={(e) => setFormCrear({ ...formCrear, entrada: Number(e.target.value) })} />

              <label>Descripción</label>
              <textarea rows="3" value={formCrear.descripcion}
                onChange={(e) => setFormCrear({ ...formCrear, descripcion: e.target.value })} />

              <label>URL Imagen</label>
              <input type="text" value={formCrear.imagen}
                onChange={(e) => setFormCrear({ ...formCrear, imagen: e.target.value })} />

              <button type="submit" className="btn-registro" style={{ marginTop: "15px" }}>
                Guardar Evento
              </button>
            </form>
          </div>
        </div>
      )}

      {isAdmin && (
        <button className="fab" onClick={() => setModalCrear(true)}>+</button>
      )}

      <footer>
        <p>📧 Contacto: comunidad@tcgmonterrey.com | 📱 WhatsApp: +52 81 1023 6329</p>
        <p>© 2026 TCG Monterrey - Comunidad Oficial</p>
      </footer>
    </div>
  );
}