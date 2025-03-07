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
                <div className="cta">
                    <h3>¡100% Gratis!</h3>
                    <p>No pedimos dinero, ni tarjetas, ni suscripciones. Simplemente te registras, juegas cuando quieras desde tu celular y/o escritorio, 100% gratis.</p>
                    <Link to='/register'>Comienza aquí</Link>
                </div>
                <div className="cta">
                    <h3>¡Únete a la comunidad!</h3>
                    <p>Únete a nuestra comunidad de jugadores en Discord o redes sociales. Comparte experiencias, consejos y haz preguntas a otros jugadores que estarán encantados de ayudarte.</p>
                    <Link to='/'><img src="#" alt="Discord Icon"/>Únete ahora</Link>
                </div>
                <div className="cta">
                    <h3>¡Compite aquí!</h3>
                    <p>¿Quieres tener el mayor imperio de logística virtual? ¡Comienza a competir! Tenemos un ranking global que se actualiza permanentemente, con recompensas y eventos mensuales. ¿Qué esperas?</p>
                    <Link to='/register'>Compite aquí</Link>
                </div>
            </section>

            <section className="faqContainer">
            <h3>¿Cómo comienzo a jugar "Express Tycoon"?</h3>
            <p>
                Para comenzar, solo necesitas registrarte y seleccionar una ciudad para iniciar tu primer garaje. Luego, compra tu primer camión y comienza a crear rutas personalizadas para transportar mercancías. ¡Con cada entrega realizada, tu negocio crecerá!                ¡Es hora de ponerte al volante de tu propia empresa logística! En "Express Tycoon", cada decisión cuenta. Sigue estos simples pasos para comenzar tu camino hacia el éxito y la expansión de tu imperio:
            </p>
            <h3>¿Cómo gano dinero en el juego?</h3>
            <p>
                El dinero en "Express Tycoon" se gana principalmente a través de las entregas realizadas entre ciudades. Cuanto más largas y rentables sean las rutas que crees, mayor será tu ganancia. Además, puedes obtener dinero extra completando misiones y desafíos diarios.                ¡Es hora de ponerte al volante de tu propia empresa logística! En "Express Tycoon", cada decisión cuenta. Sigue estos simples pasos para comenzar tu camino hacia el éxito y la expansión de tu imperio:
            </p>
            <h3>¿Puedo jugar sin conexión a Internet?</h3>
            <p>
                No, "Express Tycoon" es un juego en línea que requiere conexión a Internet para acceder a todas las funciones y competir con otros jugadores en el ranking global. ¡Mantente conectado para no perderte de nada!                ¡Es hora de ponerte al volante de tu propia empresa logística! En "Express Tycoon", cada decisión cuenta. Sigue estos simples pasos para comenzar tu camino hacia el éxito y la expansión de tu imperio:
            </p>
            <h3>¿Cómo gestiono mi flota de camiones?</h3>
            <p>
                Puedes comprar, vender y mejorar tus camiones dentro del juego. Además, deberás realizarles mantenimiento para asegurarte de que sigan funcionando de manera óptima. Cuida tu flota y hazla crecer conforme progresas en el juego.                ¡Es hora de ponerte al volante de tu propia empresa logística! En "Express Tycoon", cada decisión cuenta. Sigue estos simples pasos para comenzar tu camino hacia el éxito y la expansión de tu imperio:
            </p>
            <h3>¿Qué puedo hacer si tengo problemas técnicos o dudas sobre el juego?</h3>
            <p>
                Si encuentras algún problema técnico o tienes dudas sobre el juego, puedes acceder a nuestro centro de soporte dentro del menú del juego o contactarnos a través de nuestras redes sociales. Nuestro equipo estará encantado de ayudarte.                ¡Es hora de ponerte al volante de tu propia empresa logística! En "Express Tycoon", cada decisión cuenta. Sigue estos simples pasos para comenzar tu camino hacia el éxito y la expansión de tu imperio:
            </p>
            </section>
        </section> 
    )
}

export default Home;