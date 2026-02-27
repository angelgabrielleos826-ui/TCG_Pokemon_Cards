import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/register.css";

export default function Register() {
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
    // TODO: conectar con backend
    console.log("Register con:", { email, password });
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
          <button type="submit">Registrarse</button>
        </form>
        <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
        {errorMsg && <div id="error-msg">{errorMsg}</div>}
      </div>
    </div>
  );
}