import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/EstiloYu-gi-oh.css";

const cartas = [
  { nombre: "Blue-Eyes White Dragon",           img: "https://images.ygoprodeck.com/images/cards/89631139.jpg" },
  { nombre: "Dark Magician",                    img: "https://images.ygoprodeck.com/images/cards/46986414.jpg" },
  { nombre: "Dark Magician Girl",               img: "https://images.ygoprodeck.com/images/cards/38033121.jpg" },
  { nombre: "Pot of Greed",                     img: "https://images.ygoprodeck.com/images/cards/55144522.jpg" },
  { nombre: "Summoned skull",                   img: "https://images.ygoprodeck.com/images/cards/70781052.jpg" },
  { nombre: "Sangan",                           img: "https://images.ygoprodeck.com/images/cards/26202165.jpg" },
  { nombre: "Blue-Eyes Ultimate Dragon",        img: "https://images.ygoprodeck.com/images/cards/23995346.jpg" },
  { nombre: "Monster Reborn",                   img: "https://images.ygoprodeck.com/images/cards/83764718.jpg" },
  { nombre: "Obelisk the tormentor",            img: "https://images.ygoprodeck.com/images/cards/10000000.jpg" },
  { nombre: "Harpie Lady Sisters",              img: "https://images.ygoprodeck.com/images/cards/12206212.jpg" },
  { nombre: "Cyberdark Edge",                   img: "https://images.ygoprodeck.com/images/cards/77625948.jpg" },
  { nombre: "Terrential Tribute",               img: "https://images.ygoprodeck.com/images/cards/53582587.jpg" },
  { nombre: "Exodia The Foebidden One",         img: "https://images.ygoprodeck.com/images/cards/33396948.jpg" },
  { nombre: "Thunder King Rai-OH",              img: "https://images.ygoprodeck.com/images/cards/71564252.jpg" },
  { nombre: "Number 33: Chronomaly Machu Mech", img: "https://images.ygoprodeck.com/images/cards/39139935.jpg" },
];

const API_URL = "http://localhost:3000/api";

export default function Yugioh() {
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
    <div className="yugioh-page">
      <header>
        <ul className="volver-li">
          <Link to="/home" className="btn-volver">Volver</Link>
        </ul>
        <h1>Mi Colección Yu-Gi-Oh!</h1>
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