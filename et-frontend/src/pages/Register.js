import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { Link } from "react-router-dom";
import { landing } from '../utils/Images';

function Register() {
  const [formData, setFormData] = useState({
    user_name: "",
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
      const response = await registerUser(formData);
  
      if (response.status === 200) {
        navigate("/login");
      } else {
        setError(response.message || "Ocurrió un error inesperado. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error inesperado en el registro:", error);
      setError(error.message || "Ocurrió un error inesperado. Inténtalo de nuevo.");
    }
  };

  return (
    <section className="registerContainer">
      <section className="leftRegisterContainer">
        <img src={landing.mitsubishi} alt=""/>
      </section>
      <section className="rightRegisterContainer">
        <h1>Regístrate gratis</h1>
        <form onSubmit={handleSubmit}>
        {error && <span className="errorText">{error}</span>}
          <input type="text" name="user_name" placeholder="Nombre" value={formData.user_name} onChange={handleChange} required />
          
          <input type="email" name="user_email" placeholder="Email" value={formData.user_email} onChange={handleChange} required />
          
          <input type="password" name="user_password" placeholder="Contraseña" value={formData.user_password} onChange={handleChange} required />
          
          <button id="regBtn" type="submit">Registrarse</button>
        </form>
        <p>¿Ya tienes cuenta? <Link className="linkLoginReg" to="/login">Iniciar sesión</Link></p>
      </section>
    </section>
  );
}

export default Register;