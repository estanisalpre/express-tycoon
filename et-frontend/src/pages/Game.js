import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUserData } from "../services/authService";
import CentralWall from '../components/CentralWall';
import PlayerMenu from "../components/PlayerMenu";
import { globalImages, navMenuIcons, playerStatsIcon, socialIcons } from "../utils/Images";

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
        <span className="special-span">Redirecciones</span>
        <Link class="linkLeftMenu" path="/"><img src={navMenuIcons.home} alt="Icon"/>Inicio</Link>
        <Link class="linkLeftMenu" path="/"><img src="#" alt="Icon"/>Sobre ExpressTycoon</Link>

        <span className="special-span">Funcionalidades</span>
        <Link class="linkLeftMenu" path="/"><img src={navMenuIcons.ranking} alt="Icon"/>Ranking Global</Link>
        <Link class="linkLeftMenu" path="/"><img src={navMenuIcons.tutorial} alt="Icon"/>Tutorial</Link>
        <Link class="linkLeftMenu" path="/"><img src={navMenuIcons.share} alt="Icon"/>Invitar amigo(s)</Link>

        <span className="special-span">Información</span>
        <Link class="linkLeftMenu" path="/"><img src={navMenuIcons.events} alt="Icon"/>Eventos</Link>
        <Link class="linkLeftMenu" path="/"><img src={navMenuIcons.questions} alt="Icon"/>Preguntas Frecuentes</Link>
        <Link class="linkLeftMenu" path="/"><img src={navMenuIcons.security} alt="Icon"/>Seguridad</Link>

        <span className="special-span">Contacto</span>
        <Link class="linkLeftMenu" path="/"><img src={navMenuIcons.contact} alt="Icon"/>Contacto</Link>
        <Link class="linkLeftMenu" path="/"><img src={navMenuIcons.support} alt="Icon"/>Ayuda & Soporte</Link>
        <Link id="logoutBtn" class="linkLeftMenu" path="/logout"><img src={navMenuIcons.logout} alt="Icon"/>Salir</Link>

        <span className="special-span">Redes</span>
        <div className="socialMedia">
            <img src={socialIcons.youtubeLogo} alt="Youtube Channel Logo Redirection"/>
            <img src={socialIcons.linkedinLogo} alt="Linkedin Logo Redirection"/>
            <img src={socialIcons.githubLogo} alt="Github Project Logo Redirection"/>
            <img src={socialIcons.playstoreLogo} alt="Playstore Logo Redirection"/>
        </div>

        <span class="creditSpan">Developed by Estanis S. Previte</span>
      </aside>

      <CentralWall />

      <aside id="rightMenu">
        <div className="playerProfileContainer">
          <img src={globalImages.defaultProfile} alt="Profile Img" />
          <span className="welcomeMessage">Bienvenido, {userData.user_name}</span>
        </div>
        
        <div className="playerStats">
          <span className="stats playerLevel">
            <img src={playerStatsIcon.level} alt="Icon" /> Nivel: {userData.level}
            <Link className="link" path="/">Ver Niveles</Link>
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
            <img src={navMenuIcons.config} alt="Icon" /> Configuración
          </span>
          <span className="stats editProfileBtn">
            <img src={navMenuIcons.editProfile} alt="Icon" /> Editar Perfil
          </span>
        </div>
      </aside>

      <PlayerMenu/>
    </section>
  );
}

export default Game;