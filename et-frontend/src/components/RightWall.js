import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getUserData } from "../services/authService";
import { navMenuIcons, globalImages, playerStatsIcon } from '../utils/Images';

function LeftWall({setActiveModal}) {
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
    <aside id="rightMenu">
        <div className="playerProfileContainer">
        <img src={globalImages.defaultProfile} alt="Profile Img" />
        <span className="welcomeMessage">Bienvenido, {userData.user_name}</span>
        </div>
        
        <div className="playerStats">
        <span className="stats playerLevel">
            <img src={playerStatsIcon.level} alt="Icon" /> Nivel: {userData.level}
            <button className="link" onClick={() => setActiveModal("levels")}>Ver Niveles</button>
        </span>
        <span className="stats playerCompany">
            <img src={playerStatsIcon.company} alt="Icon" /> Empresa: {userData.company_name}
        </span>
        <span className="stats playerGarages">
            <img src={playerStatsIcon.garages} alt="Icon" /> Garajes: {userData.garages}
        </span>
        <span className="stats playerVehicles">
            <img src={playerStatsIcon.vehicles} alt="Icon" /> Vehículos: {userData.vehicles}
        </span>
        <span className="stats playerRoutes">
            <img src={playerStatsIcon.routes} alt="Icon" /> Rutas: {userData.routes}
        </span>
        <span className="stats playerEmployees">
            <img src={playerStatsIcon.employees} alt="Icon" /> Empleados: {userData.employees}
        </span>
        <span className="stats playerSuccessDeliveries">
            <img src={playerStatsIcon.successdeliveries} alt="Icon" /> Entregas realizadas: {userData.success_deliveries}
        </span>
        <span className="stats configBtn">
            <button className="" onClick={() => setActiveModal("config")}><img src={navMenuIcons.config} alt="Icon" /> Configuración</button>
        </span>
        <span className="stats editProfileBtn">
            <button className="" onClick={() => setActiveModal("edit-profile")}><img src={navMenuIcons.config} alt="Icon" /> Editar Perfil</button>
        </span>
        </div>
    </aside>
  );
}

export default LeftWall;