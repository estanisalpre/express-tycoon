import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      if (response.success) {
        alert("Usuario registrado con éxito. Ahora inicia sesión.");
        navigate("/login");
      } else {
        alert("Error en el registro: " + response.message);
      }
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="user_name" placeholder="Nombre" value={formData.user_name} onChange={handleChange} required />
        <input type="email" name="user_email" placeholder="Email" value={formData.user_email} onChange={handleChange} required />
        <input type="password" name="user_password" placeholder="Contraseña" value={formData.user_password} onChange={handleChange} required />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
