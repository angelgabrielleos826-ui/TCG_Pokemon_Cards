import { Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import "../assets/css/home.css";
import Footer from "../components/Footer";


import charizard from "../assets/resources/charizard.jpg";
import digimon from "../assets/resources/digimon.jpg";
import yugioh from "../assets/resources/yu-gi-oh.jpg";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <header>
        <h1>Sitio oficial de venta y eventos de TCG en Monterrey!</h1>
        <nav>
          <ul>
            <li><Link to="/pokemon">Pokémon</Link></li>
            <li><Link to="/digimon">Digimon</Link></li>
            <li><Link to="/yugioh">Yu-Gi-Oh</Link></li>
            <li><Link to="/eventos">Torneos</Link></li>
            <li><Link to="/community">Comunidad</Link></li>
          </ul>
        </nav>
      </header>

      <div className="contenido">
        <div className="articulos">

          {/* POKEMON */}
          <div className="secciones tarjeta-juego">
            <div className="texto-seccion">
              <h2>Pokémon</h2>
              <p>Las cartas TCG Pokémon (Trading Card Game) son cartas coleccionables estratégicas para un juego de dos jugadores donde se usan mazos personalizados para batallar, evolucionar Pokémon y usar habilidades.</p>
              <div className="stats">
                <span className="badge">150+ cartas</span>
                <span className="badge popular">Popular</span>
              </div>
              <Link to="/pokemon" className="btn-ver-coleccion">Ver Colección →</Link>
            </div>
            <div className="imagen-seccion">
              <img src={charizard} alt="Charizard" />
            </div>
          </div>

          {/* DIGIMON */}
          <div className="secciones tarjeta-juego">
            <div className="texto-seccion">
              <h2>Digimon</h2>
              <p>El Digimon Card Game (TCG) es un juego de cartas coleccionables lanzado por Bandai en 2020, basado en la franquicia Digimon. Los jugadores compiten en batallas estratégicas utilizando mazos de 50 cartas para reducir la seguridad del oponente a cero, evolucionando criaturas, usando cartas de opciones y entrenadores (Tamer).</p>
              <div className="stats">
                <span className="badge">80+ cartas</span>
                <span className="badge nuevo">Nuevo</span>
              </div>
              <Link to="/digimon" className="btn-ver-coleccion">Ver Colección →</Link>
            </div>
            <div className="imagen-seccion">
              <img src={digimon} alt="Digimon" />
            </div>
          </div>

          {/* YU-GI-OH */}
          <div className="secciones tarjeta-juego">
            <div className="texto-seccion">
              <h2>Yu-Gi-Oh!</h2>
              <p>Yu-Gi-Oh! TCG (Trading Card Game) es un juego de cartas coleccionables y competitivo basado en el manga y anime, desarrollado por Konami. Dos duelistas usan mazos de monstruos, magias y trampas para reducir los 8,000 puntos de vida del oponente a cero, siendo uno de los juegos estratégicos más populares a nivel mundial.</p>
              <div className="stats">
                <span className="badge">200+ cartas</span>
                <span className="badge clasico">Clásico</span>
              </div>
              <Link to="/yugioh" className="btn-ver-coleccion">Ver Colección →</Link>
            </div>
            <div className="imagen-seccion">
              <img src={yugioh} alt="Yu-Gi-Oh" />
            </div>
          </div>

        </div>

        <div className="menu-secundario">
          <h3>Enlaces Rápidos</h3>
          <Link to="/eventos">Próximos Torneos</Link>
          <Link to="/pokemon">Nuevas Cartas</Link>
          <a href="#">Noticias TCG</a>
          <Link to="/meets">Próximos Eventos</Link>
          <Link to="/community">Comunidad</Link>
        </div>
      </div>

      <Footer />
      {user?.role === "admin" && (
        <Link to="/agregar-carta" className="btn-agregar-carta">+</Link>
      )}
    </div>
  );
}