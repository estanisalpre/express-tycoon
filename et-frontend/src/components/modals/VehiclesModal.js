import React, { useState, useEffect } from "react";
import { ui } from "../../utils/Images";

function VehiclesModal({ onClose }) {
  const [error, setError] = useState("");
  const [vehiclesData, setVehicles] = useState([]);

  useEffect(() => {
    async function fetchVehicles() {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("Error al obtener el ID del usuario");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/vehicles/vehicles-inventory?user_id=${userId}`
        );
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error("Error al obtener los garajes:", error);
        setError("Error al obtener los garajes");
      }
    }
    fetchVehicles();
  }, []);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>
          Vehículos: Administra tus vehículos
          <button onClick={onClose}>
            <img src={ui.close} alt="Ícono para cerrar modal" />
          </button>
        </h2>
        <section className="vehiclesContainer">
          {error && <p className="errorSpan">{error}</p>}
          {vehiclesData.length > 0 ? (
            <ul>
              {vehiclesData.map((vehicle) => (
                <li key={vehicle.trucks_id}>
                  <img src={vehicle.veh_img_url} alt={vehicle.veh_name} />
                  <h3>{vehicle.veh_name}</h3>
                  <p>Precio: {vehicle.veh_price}</p>
                  <p>Velocidad: {vehicle.veh_speed}</p>
                  <p>Tamaño: {vehicle.veh_size}</p>
                  <p>Descripción: {vehicle.veh_description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay vehículos disponibles.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default VehiclesModal;
