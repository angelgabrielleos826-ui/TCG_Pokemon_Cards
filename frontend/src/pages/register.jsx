import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/auth";
import "../assets/css/register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Todos los campos son requeridos");
      return;
    }

    setLoading(true);
    try {
      await authService.register(email.trim(), password);
      window.location.href = "/login";
    } catch (error) {
      setErrorMsg(error.message || "No se pudo registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Crear Cuenta</h1>
        <form id="register-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
        {errorMsg && <div id="error-msg">{errorMsg}</div>}
      </div>
    </div>
  );
}