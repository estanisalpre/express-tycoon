import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUserData } from "../services/authService";
import CentralWall from '../components/CentralWall';
import PlayerMenu from "../components/PlayerMenu";

// Import images
import HomeIcon from '../assets/buttons/home.png'
//import LogoExTycoon from '../assets/buttons/exTycoon-icon.png'
import RankingIcon from '../assets/buttons/ranking.png'
import TutorialIcon from '../assets/buttons/tutorial.png'
import ShareIcon from '../assets/buttons/share.png'
import EventsIcon from '../assets/buttons/events.png'
import QuestionsIcon from '../assets/buttons/question.png'
import SecurityIcon from '../assets/buttons/security.png'
import ContactIcon from '../assets/buttons/chat.png'
import LogoutIcon from '../assets/buttons/logout.png'
import SupportIcon from '../assets/buttons/support.png'
import YoutubeLogo from '../assets/social/youtube.png'
import LinkedinLogo from '../assets/social/linkedin.png'
import GithubLogo from '../assets/social/github.png'
import PlayStoreLogo from '../assets/social/playstore.png'


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
        <Link class="linkLeftMenu" path="/"><img src={HomeIcon} alt="Icon"/>Inicio</Link>
        <Link class="linkLeftMenu" path="/"><img src="#" alt="Icon"/>Sobre ExpressTycoon</Link>
        <span className="special-span">Funcionalidades</span>
        <Link class="linkLeftMenu" path="/"><img src={RankingIcon} alt="Icon"/>Ranking Global</Link>
        <Link class="linkLeftMenu" path="/"><img src={TutorialIcon} alt="Icon"/>Tutorial</Link>
        <Link class="linkLeftMenu" path="/"><img src={ShareIcon} alt="Icon"/>Invitar amigo(s)</Link>
        <span className="special-span">Información</span>
        <Link class="linkLeftMenu" path="/"><img src={EventsIcon} alt="Icon"/>Eventos</Link>
        <Link class="linkLeftMenu" path="/"><img src={QuestionsIcon} alt="Icon"/>Preguntas Frecuentes</Link>
        <Link class="linkLeftMenu" path="/"><img src={SecurityIcon} alt="Icon"/>Seguridad</Link>
        <span className="special-span">Contacto</span>
        <Link class="linkLeftMenu" path="/"><img src={ContactIcon} alt="Icon"/>Contacto</Link>
        <Link class="linkLeftMenu" path="/"><img src={SupportIcon} alt="Icon"/>Ayuda & Soporte</Link>
        <Link id="logoutBtn" class="linkLeftMenu" path="/logout"><img src={LogoutIcon} alt="Icon"/>Salir</Link>
        <span className="special-span">Redes</span>
        <div className="socialMedia">
            <img src={YoutubeLogo} alt="Youtube Channel Logo Redirection"/>
            <img src={LinkedinLogo} alt="Linkedin Logo Redirection"/>
            <img src={GithubLogo} alt="Github Project Logo Redirection"/>
            <img src={PlayStoreLogo} alt="Playstore Logo Redirection"/>
        </div>
        <span class="creditSpan">Developed by Estanis S. Previte</span>
      </aside>

      <CentralWall />

      <aside id="rightMenu">
        <h2>Bienvenido, {userData.user_name}</h2>
        <p>Email: {userData.user_email}</p>
        <p>First time: {userData.first_time === 1 ? "Sí" : "No"}</p>
        <p>Money: {userData.money}</p>
        <p>Nivel: {userData.level}</p>
        <p>Experiencia: {userData.experience}</p>
      </aside>

      <PlayerMenu/>
    </section>
  );
}

export default Game;