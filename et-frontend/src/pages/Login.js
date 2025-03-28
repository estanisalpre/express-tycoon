import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { employeesImages } from '../utils/Images';
import { Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    user_email: "",
    user_password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await loginUser(formData);

      if (response.user_id) {
        console.log("Login exitoso")
        
        localStorage.setItem("userEmail", response.user_email);
        localStorage.setItem("userName", response.user_name);
        localStorage.setItem("userId", response.user_id);
        localStorage.setItem("firstTime", response.first_time);

        navigate("/game");
      } else {
        setError("Error en el login: " + response.error);
      }
    } catch (error) {
      console.error("Error en el login:", error);
      setError(error.message || "Ocurrió un error inesperado. Inténtalo de nuevo.");
    }
  };

  return (
    <section className="loginContainer">
      <section className="leftLoginContainer">
        <img src={employeesImages.happyEmployee} alt="" />
      </section>
      <section className="rightLoginContainer">
        <h1>Iniciar sesión</h1>
        <form onSubmit={handleSubmit}>
          {error && <span className="errorText">{error}</span>}
          <input
            type="email"
            name="user_email"
            placeholder="Email"
            value={formData.user_email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="user_password"
            placeholder="Contraseña"
            value={formData.user_password}
            onChange={handleChange}
            required
          />
          <button id="loginBtn" type="submit">Iniciar sesión</button>
        </form>
        <p>¿Aún no tienes cuenta? <Link className="linkLoginReg" to="/register">Registrarme</Link></p>
      </section>
    </section>
  );
}

export default Login;