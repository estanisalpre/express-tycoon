import React, { useEffect, useState } from 'react';
import { getUserData } from "../services/authService";
//import { Link } from 'react-router-dom';
import { topStats } from '../utils/Images';

function PlayerTopStats() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const userEmail = localStorage.getItem("userEmail");

        getUserData(userEmail)
        .then((data) => {
            if (data.error) {
            console.error("Error al obtener datos:", data.error);
            } else {
            setUserData(data);
            }
        })
        .catch((error) => {
            console.error("Error en la solicitud:", error);
        });
    });

  return (
    <section className='playerTopStatsContainer'>
      <ul>
        <li>
            <img src={topStats.xp} alt=''/>
            <span>XP: {userData ? userData.experience : "Cargando..."}</span>
        </li>
        <li>
            <img src={topStats.money} alt=''/>
            <span>Dinero: ${userData ? userData.money : "Cargando..."}</span>
        </li>
        <li>
            <img src={topStats.petrolStorage} alt=''/>
            <span>Combustible: 25 lt.</span>
        </li>
        <li>
            <img src={topStats.dolarCoin} alt=''/>
            <span>Precio Combustible: 3,5 lt  </span>
        </li>
      </ul>
    </section>
  );
}

export default PlayerTopStats;