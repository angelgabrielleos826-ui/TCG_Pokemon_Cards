//Utilizamos IA para la conbinacion de cartManager,Script, checkout, cardpage
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/EstiloCart.css";

const API_URL = "http://localhost:3000/api";

// ─── cartManager.js ───────────────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem("jwt_token");
}

async function apiObtenerCartas() {
  try {
    const res = await fetch(`${API_URL}/cards`);
    if (!res.ok) throw new Error("Error al cargar cartas");
    return await res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function apiObtenerCarrito() {
  const token = getToken();
  try {
    const res = await fetch(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Error al cargar carrito");
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function apiAgregarCarta(cardId, quantity = 1) {
  const token = getToken();
  try {
    const res = await fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cardId, quantity }),
    });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function apiEliminarCarta(cardId) {
  const token = getToken();
  try {
    const res = await fetch(`${API_URL}/cart/remove/${cardId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function apiVaciarCarrito() {
  const token = getToken();
  try {
    const res = await fetch(`${API_URL}/cart/clear`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function apiConfirmarCompra(orderData) {
  const token = getToken();
  try {
    const res = await fetch(`${API_URL}/orders/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al procesar la compra");
    return { ok: true, ticket: data.ticket };
  } catch (e) {
    console.error(e);
    return { ok: false, error: e.message };
  }
}

async function apiObtenerTipoCambio() {
  try {
    const res = await fetch(`${API_URL}/tipo-cambio`);
    if (!res.ok) throw new Error("No se pudo consultar tipo de cambio");
    const data = await res.json();
    if (typeof data.USD === "number" && Number.isFinite(data.USD)) {
      return data.USD;
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

// ─── Sub-componente Campo ─────────────────────────────────────────────────────

function Campo({ label, id, placeholder, maxLength, value, onChange, type = "text" }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Cart() {
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  const [cartas, setCartas]         = useState([]);
  const [carrito, setCarrito]       = useState([]);
  const [usarUSD, setUsarUSD]       = useState(false);
  const [tipoCambio, setTipoCambio] = useState(0.05823); // fallback
  const [cargando, setCargando]     = useState(true);

  // Modal
  const [modalAbierto, setModalAbierto]   = useState(false);
  const [compraExitosa, setCompraExitosa] = useState(false);
  const [ticket, setTicket]               = useState(null);
  const [errorMsg, setErrorMsg]           = useState("");
  const [procesando, setProcesando]       = useState(false);

  // Formulario
  const formInicial = {
    fullName: "", phone: "", address: "", city: "", zip: "",
    cardType: "", cardHolder: "", cardNumber: "", cardExpiry: "", cardCVV: "",
  };
  const [form, setForm] = useState(formInicial);

  // ── Auth ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!getToken()) {
      alert("Debes iniciar sesión para usar el carrito");
      navigate("/login");
    }
  }, [navigate]);

  // ── Cargar carrito (Script.js → cargarYMostrarCarrito) ────────────────────
  const cargarCarrito = useCallback(async () => {
    const data = await apiObtenerCarrito();
    if (!data) { setCarrito([]); return; }

    // Soporta { cart: { items } } o { items } directamente
    if (data.cart?.items) setCarrito(data.cart.items);
    else if (Array.isArray(data.items)) setCarrito(data.items);
    else setCarrito([]);
  }, []);

  // ── Carga inicial ──────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      setCargando(true);
      const [cartasData, tc] = await Promise.all([
        apiObtenerCartas(),
        apiObtenerTipoCambio(),
      ]);
      setCartas(cartasData);
      if (tc) setTipoCambio(tc);
      await cargarCarrito();
      setCargando(false);
    })();
  }, [cargarCarrito]);

  // ── Moneda (Script.js → btnMoneda click) ──────────────────────────────────
  const toggleMoneda = async () => {
    const nuevaMoneda = !usarUSD;
    if (nuevaMoneda) {
      // Actualizar tipo de cambio al cambiar a USD
      const tc = await apiObtenerTipoCambio();
      if (tc) setTipoCambio(tc);
    }
    setUsarUSD(nuevaMoneda);
  };

  // ── Formateo (Script.js → formatearMoneda) ────────────────────────────────
  const fmt = (mxn) => {
    const numero = Number(mxn || 0);
    return usarUSD
      ? `US$${(numero * tipoCambio).toFixed(2)} USD`
      : `$${numero.toFixed(2)} MXN`;
  };

  // ── Total ──────────────────────────────────────────────────────────────────
  const totalMXN = carrito.reduce((acc, item) => {
    const precio = Number(item.card?.price || item.price || 0);
    const qty    = Number(item.quantity || 0);
    return acc + precio * qty;
  }, 0);

  // ── Acciones carrito (Script.js → botones +/-/eliminar/vaciar) ────────────
  const agregarCarta = async (cardId, quantity = 1) => {
    const ok = await apiAgregarCarta(cardId, quantity);
    if (ok) await cargarCarrito();
    else alert("Error al agregar carta. Verifica tu conexión.");
  };

  const cambiarCantidad = async (cardId, delta) => {
    await apiAgregarCarta(cardId, delta);
    await cargarCarrito();
  };

  const eliminarCarta = async (cardId) => {
    if (!confirm("¿Eliminar esta carta del carrito?")) return;
    await apiEliminarCarta(cardId);
    await cargarCarrito();
  };

  const vaciarCarrito = async () => {
    if (!confirm("¿Seguro que quieres vaciar todo el carrito?")) return;
    const ok = await apiVaciarCarrito();
    if (ok) setCarrito([]);
  };

  // ── Modal ─────────────────────────────────────────────────────────────────
  const abrirModal = () => {
    if (carrito.length === 0 || totalMXN <= 0) {
      alert("Tu carrito está vacío. Agrega cartas antes de pagar.");
      return;
    }
    setModalAbierto(true);
    setCompraExitosa(false);
    setTicket(null);
    setErrorMsg("");
    setForm(formInicial);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setCompraExitosa(false);
    setTicket(null);
  };

  // ── Formulario (checkout.js → input handlers) ─────────────────────────────
  const handleChange = (e) => {
    const { id, value } = e.target;

    // Solo letras en nombre (checkout.js)
    if (id === "fullName" || id === "cardHolder") {
      setForm((f) => ({ ...f, [id]: value.replace(/[0-9]/g, "") }));
      return;
    }

    // Formato 1234 5678 9012 3456
    if (id === "cardNumber") {
      const digits    = value.replace(/\D/g, "").slice(0, 16);
      const formatted = digits.match(/.{1,4}/g)?.join(" ") || digits;
      setForm((f) => ({ ...f, cardNumber: formatted }));
      return;
    }

    // Formato MM/AA
    if (id === "cardExpiry") {
      const digits    = value.replace(/\D/g, "").slice(0, 4);
      const formatted = digits.length >= 3
        ? `${digits.slice(0, 2)}/${digits.slice(2)}`
        : digits;
      setForm((f) => ({ ...f, cardExpiry: formatted }));
      return;
    }

    setForm((f) => ({ ...f, [id]: value }));
  };

  // ── Confirmar compra (checkout.js → confirmarCompra) ─────────────────────
  const confirmarCompra = async () => {
    const requeridos = Object.keys(formInicial);
    if (requeridos.some((k) => !form[k]?.trim())) {
      setErrorMsg("Por favor llena todos los campos.");
      return;
    }

    setErrorMsg("");
    setProcesando(true);

    const moneda = usarUSD ? "USD" : "MXN";
    const total  = usarUSD ? totalMXN * tipoCambio : totalMXN;

    const { ok, ticket: ticketData, error } = await apiConfirmarCompra({
      shippingInfo: {
        fullName: form.fullName,
        phone:    form.phone,
        address:  form.address,
        city:     form.city,
        zip:      form.zip,
      },
      cardInfo: {
        cardType:   form.cardType,
        cardHolder: form.cardHolder,
        cardNumber: form.cardNumber.replace(/\s/g, ""),
      },
      total,
      currency: moneda,
    });

    setProcesando(false);

    if (ok) {
      setCompraExitosa(true);
      setTicket(ticketData);   // ticket viene directo del backend igual que checkout.js
      setCarrito([]);
    } else {
      setErrorMsg(error || "Error al procesar el pago. Intenta nuevamente.");
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="cart-page">

      {/* HEADER */}
      <h1>
        Tienda TCG
        <button className="btn-moneda" onClick={toggleMoneda}>
          {usarUSD ? "Cambiar a MXN" : "Cambiar a USD"}
        </button>
      </h1>

      <div className="contenedor">

        {/* ── PRODUCTOS (cardPaje.js → cargarProductos / mostrarProductos) ── */}
        <section className="productos">
          {cargando ? (
            <p style={{ color: "#fff", width: "100%", textAlign: "center" }}>
              Cargando cartas...
            </p>
          ) : cartas.length === 0 ? (
            <p style={{ color: "#fff", width: "100%", textAlign: "center" }}>
              No hay cartas disponibles.
            </p>
          ) : (
            cartas.map((carta) => (
              <div className="card" key={carta._id}>
                <img
                  src={carta.image}
                  alt={carta.name}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200x280?text=TCG";
                  }}
                />
                <p><strong>{carta.name}</strong></p>
                <p>{fmt(carta.price)}</p>
                <button onClick={() => agregarCarta(carta._id, 1)}>
                  Agregar al carrito
                </button>
              </div>
            ))
          )}
        </section>

        {/* ── CARRITO (Script.js → mostrarCarrito) ── */}
        <aside className="carrito">
          <h2>Carrito</h2>

          {carrito.length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center", padding: "20px 0" }}>
              Tu carrito está vacío
            </p>
          ) : (
            <ul className="lista-carrito">
              {carrito.map((item) => {
                const card    = item.card || {};
                const qty     = Number(item.quantity || 0);
                const precioMXN = Number(card.price || item.price || 0);
                const cardId  = card._id || item.cardId;

                return (
                  <li key={cardId}>
                    <img
                      src={card.image || ""}
                      alt={card.name || "Carta"}
                      style={{ width: "60px", borderRadius: "5px", flexShrink: 0 }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <div style={{ flex: 1 }}>
                      <strong>{card.name || "Carta"}</strong>
                      <p style={{ fontSize: "0.85rem", margin: "3px 0" }}>
                        Unitario: {fmt(precioMXN)}
                      </p>
                      <p style={{ fontSize: "0.85rem", fontWeight: "bold" }}>
                        Subtotal: {fmt(precioMXN * qty)}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <button
                        className="btn-cantidad"
                        onClick={() => cambiarCantidad(cardId, -1)}
                      >−</button>
                      <span style={{ minWidth: "24px", textAlign: "center" }}>{qty}</span>
                      <button
                        className="btn-cantidad"
                        onClick={() => cambiarCantidad(cardId, 1)}
                      >+</button>
                      <button
                        className="btn-eliminar-item"
                        onClick={() => eliminarCarta(cardId)}
                      >Eliminar</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <p className="total">Total: <span>{fmt(totalMXN)}</span></p>

          <button className="btn-vaciar" onClick={vaciarCarrito}>
            Vaciar carrito
          </button>
          <button className="btn-pagar" onClick={abrirModal}>
            Pagar
          </button>
        </aside>

      </div>

      {/* ── MODAL DE PAGO (checkout.js) ─────────────────────────────────── */}
      {modalAbierto && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && cerrarModal()}
        >
          <div className="modal">
            <button className="modal-close" onClick={cerrarModal}>✕</button>

            {!compraExitosa ? (
              <>
                <h2>Finalizar Compra</h2>

                <div className="resumen-pago">
                  <span>Total a pagar:</span>
                  <span>{fmt(totalMXN)}</span>
                </div>

                {/* Envío */}
                <div className="form-seccion">
                  <h3>Datos de Envío</h3>
                  <div className="form-grupo">
                    <Campo label="Nombre completo" id="fullName" placeholder="Ej. Juan Pérez García"    value={form.fullName} onChange={handleChange} />
                    <Campo label="Teléfono"         id="phone"    placeholder="Ej. 8112345678" maxLength={10} value={form.phone}    onChange={handleChange} />
                    <Campo label="Dirección"        id="address"  placeholder="Calle, número, colonia"  value={form.address} onChange={handleChange} />
                    <div className="form-fila">
                      <Campo label="Ciudad"         id="city"     placeholder="Ej. Monterrey"           value={form.city}    onChange={handleChange} />
                      <Campo label="Código Postal"  id="zip"      placeholder="Ej. 64000" maxLength={5} value={form.zip}     onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {/* Tarjeta */}
                <div className="form-seccion">
                  <h3>Datos de Tarjeta</h3>
                  <div className="form-grupo">
                    <div className="campo">
                      <label htmlFor="cardType">Tipo de tarjeta</label>
                      <select id="cardType" value={form.cardType} onChange={handleChange}>
                        <option value="">-- Selecciona --</option>
                        <option value="visa">Visa</option>
                        <option value="mastercard">Mastercard</option>
                        <option value="amex">American Express</option>
                      </select>
                    </div>
                    <Campo label="Nombre en la tarjeta" id="cardHolder" placeholder="Como aparece en tu tarjeta"      value={form.cardHolder} onChange={handleChange} />
                    <Campo label="Número de tarjeta"    id="cardNumber" placeholder="1234 5678 9012 3456" maxLength={19} value={form.cardNumber} onChange={handleChange} />
                    <div className="form-fila">
                      <Campo label="Vencimiento" id="cardExpiry" placeholder="MM/AA" maxLength={5} value={form.cardExpiry} onChange={handleChange} />
                      <Campo label="CVV"         id="cardCVV"    placeholder="123"   maxLength={3} value={form.cardCVV}    onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {errorMsg && <p className="error-msg">⚠️ {errorMsg}</p>}

                <button
                  className="btn-confirmar"
                  onClick={confirmarCompra}
                  disabled={procesando}
                >
                  {procesando ? "Procesando..." : "Confirmar Compra"}
                </button>
              </>
            ) : (
              /* ÉXITO + TICKET (checkout.js → mostrarTicket) */
              <div className="mensaje-exito">
                <h3>¡Compra realizada!</h3>
                <p>Tu pedido ha sido registrado correctamente.<br />¡Gracias por tu compra!</p>

                {ticket && (
                  <div className="ticket-container">
                    <h2>Ticket de compra</h2>
                    <p><strong>Orden:</strong> {ticket.numeroOrden}</p>
                    <p><strong>Fecha:</strong> {new Date(ticket.fecha || ticket.createdAt || Date.now()).toLocaleString("es-MX")}</p>
                    <p><strong>Método de pago:</strong> {ticket.metodoPago || "Tarjeta"}</p>
                    <p><strong>Moneda:</strong> {ticket.currency || (usarUSD ? "USD" : "MXN")}</p>

                    <ul className="ticket-list">
                      {(ticket.productos || []).map((p, i) => (
                        <li className="ticket-item" key={i}>
                          <span>{p.nombre} x{p.cantidad}</span>
                          <strong>{fmt(p.subtotal)}</strong>
                        </li>
                      ))}
                    </ul>

                    <p className="ticket-total">
                      <strong>Total:</strong> {fmt(ticket.total)}
                    </p>
                  </div>
                )}

                <button className="btn-confirmar" onClick={cerrarModal}>
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="cart-footer">
        <Link to="/home">← Volver al inicio</Link>
      </footer>

    </div>
  );
}
