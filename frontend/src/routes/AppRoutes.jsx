import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Register from "../pages/register";
import Home from "../pages/home";
import Pokemon from "../pages/pokemon";
import Digimon from "../pages/digimon";
import Yugioh from "../pages/yu-gi-oh";
import Eventos from "../pages/eventos";
import AgrCartas from "../pages/agrCartas";  // ← cambia a mayúscula la C
import Cart from "../pages/cart";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pokemon" element={<Pokemon />} />
      <Route path="/digimon" element={<Digimon />} />
      <Route path="/yugioh" element={<Yugioh />} />
      <Route path="/eventos" element={<Eventos />} />
      <Route path="/agregar-carta" element={<AgrCartas />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
};

export default AppRoutes;