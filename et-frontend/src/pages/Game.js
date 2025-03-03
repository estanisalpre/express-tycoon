import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../services/authService"; // Importa la función correcta
import CentralWall from '../components/CentralWall';
import PlayerMenu from "../components/PlayerMenu";

function Game() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      navigate("/login");
      return;
    }

    getUserData(userEmail)
      .then((data) => {
        if (data.error) {
          console.error("Error al obtener datos:", data.error);
          navigate("/login");
        } else {
          setUserData(data);
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
        navigate("/login");
      });
  }, [navigate]);

  if (!userData) {
    return <div>Cargando...</div>;
  }

  return (
    <section id="fatherContainer">
      <aside id="leftMenu">
        <h2>Bienvenido, {userData.user_name}</h2>
        <p>Email: {userData.user_email}</p>
        <p>First time: {userData.first_time === 1 ? "Sí" : "No"}</p>
      </aside>

      <CentralWall />

      <aside id="rightMenu">
        <p>Money: {userData.money}</p>
        <p>Nivel: {userData.level}</p>
        <p>Experiencia: {userData.experience}</p>
      </aside>

      <PlayerMenu/>
    </section>
  );
}

export default Game;