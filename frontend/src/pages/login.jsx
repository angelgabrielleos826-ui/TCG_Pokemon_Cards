import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/auth";
import "../assets/css/login.css";

export default function Login() {
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
      const data = await authService.login(email.trim(), password);
      // ✅ AGREGADO: guardar token en localStorage
      if (data?.jwt_token) {
        localStorage.setItem("jwt_token", data.jwt_token);
      }
      window.location.href = "/home";
    } catch (error) {
      setErrorMsg(error.message || "No se pudo iniciar sesion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Iniciar Sesión</h1>

        <form id="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <p>¿No tiene cuenta? <Link to="/register">Regístrate aquí</Link></p>

        {errorMsg && <div id="error-msg">{errorMsg}</div>}
      </div>
    </div>
  );
}