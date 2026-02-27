import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Todos los campos son requeridos");
      return;
    }
    console.log("Login con:", { email, password });
  };

  return (
    <div className="login-page">
        
      <div className="login-container">
        <h1>Iniciar Sesión</h1>

        <form id="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />

          <button type="submit">Iniciar Sesión</button>
        </form>

        <p>¿No tiene cuenta? <Link to="/register">Regístrate aquí</Link></p>

        {errorMsg && <div id="error-msg">{errorMsg}</div>}
      </div>
    </div>
  );
}