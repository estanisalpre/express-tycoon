import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const [formData, setFormData] = useState({
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
      const response = await loginUser(formData); 

      if (response.user_id) {
        alert("Login exitoso!!");

        localStorage.setItem("userEmail", response.user_email);
        localStorage.setItem("userName", response.user_name);
        localStorage.setItem("userId", response.user_id);
        localStorage.setItem("firstTime", response.first_time);

        navigate("/game");
      } else {
        alert("Error en el login: " + response.error);
      }
    } catch (error) {
      console.error("Error en el login:", error);
    }
  };

  return (
    <section>
      <section>
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Iniciar sesión</button>
        </form>
      </section>
    </section>
  );
}

export default Login;