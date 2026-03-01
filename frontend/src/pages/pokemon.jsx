import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/EstiloPokemon.css";
import BtnCarrito from "../components/BtnCarrito";

const cartas = [
  { nombre: "Oddish",           img: "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_1.png" },
  { nombre: "Gloom",            img: "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_2.png" },
  { nombre: "Vileplume",        img: "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_3.png" },
  { nombre: "Mega-Heracross EX",img: "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_4.png" },
  { nombre: "Lotad",            img: "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_5.png" },
  { nombre: "Lombre",           img: "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_6.png" },
  { nombre: "Ludicolo",         img: "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_7.png" },
  { nombre: "Genesect",         img: "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_8.png" },
  { nombre: "Nymble",           img: "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_9.png" },
  { nombre: "Lokix",            img: "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_10.png" },
  { nombre: "Charmander",       img: "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_11.png" },
  { nombre: "Charmeleon",       img: "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_12.png" },
  { nombre: "Mega-Charizard X EX", img: "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_13.png" },
  { nombre: "Moltres",          img: "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_14.png" },
  { nombre: "Darumaka",         img: "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_15.png" },
];

const API_URL = "https://tcg-pokemon-cards.onrender.com";

export default function Pokemon() {
  const navigate = useNavigate();
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [agregando, setAgregando] = useState(false);

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
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
    <div className="pokemon-page">
      <header>
        <ul className="volver-li">
          <Link to="/home" className="btn-volver">Volver</Link>
        </ul>
        <h1>Mi Colección Pokemon</h1>
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
            <BtnCarrito />
    </div>
  );
}