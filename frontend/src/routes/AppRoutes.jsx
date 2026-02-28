import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Register from "../pages/register";
import Home from "../pages/home";
import Pokemon from "../pages/pokemon";
import Digimon from "../pages/digimon";
import Yugioh from "../pages/yu-gi-oh";
import Eventos from "../pages/eventos";
import AgrCartas from "../pages/agrCartas";
import Cart from "../pages/cart";
import CommunityMarketplace from "../pages/communityMarketplace";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pokemon" element={<Pokemon />} />
      <Route path="/digimon" element={<Digimon />} />
      <Route path="/yugioh" element={<Yugioh />} />
      <Route path="/eventos" element={<Eventos />} />
      <Route path="/agregar-carta" element={<AgrCartas />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/community" element={<CommunityMarketplace />} />
    </Routes>
  );
};

export default AppRoutes;