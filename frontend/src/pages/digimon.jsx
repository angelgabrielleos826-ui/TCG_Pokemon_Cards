import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/EstiloDigimon.css";

const cartas = [
  { nombre: "Yokomon",          img: "https://images.digimoncard.io/images/cards/BT1-001.jpg" },
  { nombre: "DarkTyrannomon",   img: "https://images.digimoncard.io/images/cards/BT1-019.jpg" },
  { nombre: "WaeGreymon",       img: "https://images.digimoncard.io/images/cards/BT1-025.jpg" },
  { nombre: "Gabumon",          img: "https://images.digimoncard.io/images/cards/BT1-029.jpg" },
  { nombre: "Gorillamon",       img: "https://images.digimoncard.io/images/cards/BT1-037.jpg" },
  { nombre: "Zudomon",          img: "https://images.digimoncard.io/images/cards/BT1-041.jpg" },
  { nombre: "MagnaAngemon",     img: "https://images.digimoncard.io/images/cards/BT1-060.jpg" },
  { nombre: "Togemon",          img: "https://images.digimoncard.io/images/cards/BT1-074.jpg" },
  { nombre: "Omnimon",          img: "https://images.digimoncard.io/images/cards/BT1-084.jpg" },
  { nombre: "Gigimon",          img: "https://images.digimoncard.io/images/cards/BT2-001.jpg" },
  { nombre: "Lavogaritamon",    img: "https://images.digimoncard.io/images/cards/BT2-016.jpg" },
  { nombre: "UlforceVeedramon", img: "https://images.digimoncard.io/images/cards/BT2-032.jpg" },
  { nombre: "Zubamon",          img: "https://images.digimoncard.io/images/cards/BT3-008.jpg" },
  { nombre: "RagnaLoardmon",    img: "https://images.digimoncard.io/images/cards/BT3-019.jpg" },
  { nombre: "Hell's Gate",      img: "https://images.digimoncard.io/images/cards/BT4-112.jpg" },
];

const API_URL = "http://localhost:3000/api";

export default function Digimon() {
  const navigate = useNavigate();
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [agregando, setAgregando]         = useState(false);

  const toggleSeleccion = (nombre) => {
    setSeleccionadas((prev) =>
      prev.includes(nombre) ? prev.filter((c) => c !== nombre) : [...prev, nombre]
    );
  };

  const irAlCarrito = async () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      alert("Debes iniciar sesión para usar el carrito");
      navigate("/login");
      return;
    }

    setAgregando(true);

    try {
      const res = await fetch(`${API_URL}/cards`);
      const todasLasCartas = await res.json();

      for (const nombre of seleccionadas) {
        const carta = todasLasCartas.find((c) => c.name === nombre);
        if (carta) {
          await fetch(`${API_URL}/cart/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ cardId: carta._id, quantity: 1 }),
          });
        }
      }
    } catch (e) {
      console.error("Error agregando al carrito:", e);
    }

    setAgregando(false);
    navigate("/cart");
  };

  return (
    <div className="digimon-page">
      <header>
        <ul className="volver-li">
          <Link to="/home" className="btn-volver">Volver</Link>
        </ul>
        <h1>Mi Colección Digimon</h1>
      </header>

      <main className="galeria">
        <div className="cartas">
          {cartas.map((carta) => (
            <div
              key={carta.nombre}
              className={`carta ${seleccionadas.includes(carta.nombre) ? "seleccionada" : ""}`}
              onClick={() => toggleSeleccion(carta.nombre)}
            >
              <img src={carta.img} alt={carta.nombre} />
            </div>
          ))}
        </div>
      </main>

      {seleccionadas.length > 0 && (
        <button id="btn-agregar-carrito" onClick={irAlCarrito} disabled={agregando}>
          {agregando ? "Agregando..." : `Agregar ${seleccionadas.length} carta(s) al carrito 🛒`}
        </button>
      )}
    </div>
  );
}