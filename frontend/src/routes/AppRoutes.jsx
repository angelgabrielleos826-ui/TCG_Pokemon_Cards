import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Register from "../pages/register";
import CommunityMarketplace from "../pages/communityMarketplace";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CommunityMarketplace />} />
      <Route path="/community" element={<CommunityMarketplace />} />
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
