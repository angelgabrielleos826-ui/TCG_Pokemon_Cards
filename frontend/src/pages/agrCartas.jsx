import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/Agr_cartas.css";

const API_URL = "https://tcg-pokemon-cards.onrender.com";

export default function AgrCartas() {
  const [form, setForm] = useState({
    name: "",
    image: "",
    price: "",
    stock: ""
  });
  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "image") setPreview(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCard = {
      name: form.name,
      image: form.image,
      price: Number(form.price),
      stock: Number(form.stock)
    };

    try {
      const res = await fetch(`${API_URL}/cards/createCard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard)
      });

      const data = await res.json();
      console.log("Carta guardada:", data);
      alert("Carta creada en la base de datos ");

      setForm({ name: "", image: "", price: "", stock: "" });
      setPreview("");

    } catch (err) {
      console.error("Error al crear la carta:", err);
      alert("Hubo un error al crear la carta ");
    }
  };

  return (
    <div className="agr-cartas-page">

      <div className="volver-menu">
        <Link to="/home" className="btn-volver">← Volver al Menú</Link>
      </div>

      <div className="form-card">

        <div className="form-section">
          <h2>Agregar Carta</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre</label>
              <input type="text" name="name" required
                value={form.name} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Imagen (URL)</label>
              <input type="text" name="image" required
                value={form.image} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Precio</label>
              <input type="number" name="price" required
                value={form.price} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input type="number" name="stock" required
                value={form.stock} onChange={handleChange} />
            </div>

            <button type="submit" className="btn-crear">
              Crear Carta
            </button>
          </form>
        </div>

        <div className="preview-section">
          <h3>Vista previa</h3>
          {preview && <img src={preview} alt="Vista previa" />}
        </div>

      </div>
    </div>
  );
}