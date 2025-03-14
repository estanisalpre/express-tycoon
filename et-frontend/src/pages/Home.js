import React from "react"
import { Link } from 'react-router-dom';
import { features, howToPlay } from "../utils/Lists";
import { landing } from '../utils/Images'

function Home(){
    return(
        <section className="landingContainer">
            <section className="presentationContainer">
                <div className="leftPresentation">
                    <h1>
                        CONSTRUYE TU IMPERIO LOGÍSTICO Y DOMINA LAS RUTAS DEL MUNDO
                    </h1>
                    <h2>Gestiona flotas, optimiza rutas y conviértete en el rey del transporte</h2>
                    <div className="presBtnContainer"><Link className="ctaBtn" to='/register'>Juega gratis ahora</Link></div>
                    
                </div>
                <div className="rightPresentation"></div>
            </section>

            <section className="featuresContainer">
                <article className="aboutContainer">
                    <h2>SOBRE EXPRESS TYCOON</h2>
                    <p>
                        Express Tycoon te ofrece la oportunidad de gestionar un imperio logístico donde puedes personalizar, competir y expandir tu negocio mientras enfrentas desafíos dinámicos y realistas.
                    </p>
                    <h3>Nacimiento de la idea</h3>
                    <p>
                        La idea nace como proyecto para el examen final del Instituto de CESDE en 2025.
                    </p>
                </article>
                {features.map((feature,index) => (
                    <div className="feature" key={index}>
                        <h3> {feature.title} </h3>
                        <p> {feature.description} </p>
                    </div>
                ))}
            </section>
            
            <section className="howToPlayContainer">
                <article className="articleHowTo">
                    <h2>¿Cómo jugar Express Tycoon?</h2>
                </article>
                
                {howToPlay.map((value,index) => (
                    <div className="feature" key={index}>
                        <h3> {value.title} </h3>
                        <p> {value.description} </p>
                    </div>
                ))}
                <Link className="linkHowTo" to='/register'>¡Empieza gratis ya!</Link>
            </section>

            <section className="ctaContainer">
                <div className="leftCtaContainer">
                    <img src={landing.scania} alt=""/>
                    <img src={landing.mercedesFarm} alt=""/>
                    <img src={landing.mitsubishi} alt=""/>
                    <img src={landing.furgon} alt=""/>
                </div>
                <div className="rightCtaContainer">
                    <div className="cta">
                        <h3>¡100% Gratis!</h3>
                        <p>No pedimos dinero, ni tarjetas, ni suscripciones. Simplemente te registras, juegas cuando quieras desde tu celular y/o escritorio, 100% gratis.</p>
                        <Link className="linkCta" to='/register'>Comienza aquí</Link>
                    </div>
                    <div className="cta">
                        <h3>¡Únete a la comunidad!</h3>
                        <p>Únete a nuestra comunidad de jugadores en Discord o redes sociales. Comparte experiencias, consejos y haz preguntas a otros jugadores que estarán encantados de ayudarte.</p>
                        <Link className="linkCta" to='/'><img src="#" alt="Discord Icon"/>Únete ahora</Link>
                    </div>
                    <div className="cta">
                        <h3>¡Compite aquí!</h3>
                        <p>¿Quieres tener el mayor imperio de logística virtual? ¡Comienza a competir! Tenemos un ranking global que se actualiza permanentemente, con recompensas y eventos mensuales. ¿Qué esperas?</p>
                        <Link className="linkCta" to='/register'>Compite aquí</Link>
                    </div>
                </div>
            </section>
        </section> 
    )
}

export default Home;