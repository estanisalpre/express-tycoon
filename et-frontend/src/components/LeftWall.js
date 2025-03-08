import React from 'react';
import { socialIcons, navMenuIcons } from '../utils/Images';

function LeftWall({ setActiveModal }) {

  return (
    <aside id="leftMenu">
      <span className="special-span">Redirecciones</span>
      <button class="linkLeftMenu" onClick={() => setActiveModal("start")}><img src={navMenuIcons.home} alt="Icon"/>Inicio</button>
      <button class="linkLeftMenu" onClick={() => setActiveModal("about")}><img src="#" alt="Icon"/>Sobre ExpressTycoon</button>
      <span className="special-span">Funcionalidades</span>
      <button class="linkLeftMenu" onClick={() => setActiveModal("ranking")}><img src={navMenuIcons.ranking} alt="Icon"/>Ranking Global</button>
      <button class="linkLeftMenu" onClick={() => setActiveModal("tutorial")}><img src={navMenuIcons.tutorial} alt="Icon"/>Tutorial</button>
      <button class="linkLeftMenu" onClick={() => setActiveModal("share")}><img src={navMenuIcons.share} alt="Icon"/>Invitar amigo(s)</button>
      <span className="special-span">Información</span>
      <button class="linkLeftMenu" onClick={() => setActiveModal("events")}><img src={navMenuIcons.events} alt="Icon"/>Eventos & Noticias</button>
      <button class="linkLeftMenu" onClick={() => setActiveModal("faqs")}><img src={navMenuIcons.questions} alt="Icon"/>Preguntas Frecuentes</button>
      <button class="linkLeftMenu" onClick={() => setActiveModal("security")}><img src={navMenuIcons.security} alt="Icon"/>Seguridad</button>
      <span className="special-span">Contacto</span>
      <button class="linkLeftMenu" onClick={() => setActiveModal("contact")}><img src={navMenuIcons.contact} alt="Icon"/>Contacto</button>
      <button class="linkLeftMenu" onClick={() => setActiveModal("support")}><img src={navMenuIcons.support} alt="Icon"/>Ayuda & Soporte</button>
      <button id="logoutBtn" class="linkLeftMenu"><img src={navMenuIcons.logout} alt="Icon"/>Salir</button>
      <span className="special-span">Redes</span>
      <div className="socialMedia">
          <img src={socialIcons.youtubeLogo} alt="Youtube Channel Logo Redirection"/>
          <img src={socialIcons.linkedinLogo} alt="Linkedin Logo Redirection"/>
          <img src={socialIcons.githubLogo} alt="Github Project Logo Redirection"/>
          <img src={socialIcons.playstoreLogo} alt="Playstore Logo Redirection"/>
      </div>
      <span class="creditSpan">Developed by Estanis S. Previte</span>
    </aside>
  );
}

export default LeftWall;