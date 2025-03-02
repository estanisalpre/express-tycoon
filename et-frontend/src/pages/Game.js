import React, { useEffect, useState } from "react"
import axios from "axios"

function Game(){
    const [cities, setCities] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/cities")
        .then(response => {
            setCities(response.data)
        })
        .catch(error => console.error("Error al obtener ciudades:", error));
    }, []);

    return(
        <div>
            <h1>Ciudades disponibles 🌍</h1>
            <ul>
                {cities.map((city, index) => (
                <li key={index}>{city.city_name}</li>
                ))}
            </ul>
        </div>
    )
}

export default Game;



