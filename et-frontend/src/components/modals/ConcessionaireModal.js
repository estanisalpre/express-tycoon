import React, { useEffect, useState } from "react";
import { ui } from "../../utils/Images";

function ConcessionaireModal({ onClose }) {
  const [vehicles, setVehicles] = useState([]);
  const [money, setMoney] = useState(0);
  const [error, setError] = useState("");
  const [garagesByCity, setGaragesByCity] = useState({});
  const [selectedGarage, setSelectedGarage] = useState("")

  useEffect(() => {
    const fetchGarages = async () => {
        const userId = localStorage.getItem("userId");

        try {
            const response = await fetch(`http://localhost:5000/user/garages/${userId}`);
            if (!response.ok) {
                throw new Error("Error al obtener los garajes del usuario");
            }
            const data = await response.json();

            const groupedGarages = data.reduce((acc, garage) => {
                const cityName = garage.city_name;
                if (!acc[cityName]) {
                    acc[cityName] = [];
                }
                acc[cityName].push(garage);
                return acc;
            }, {});

            setGaragesByCity(groupedGarages);
        } catch (error) {
            console.error("Error al obtener los garajes:", error);
            setError("Error al cargar los garajes.");
        }
    };

    fetchGarages();
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:5000/vehicles");
        if (!response.ok) {
          throw new Error("Error al obtener vehículos");
        }
        const data = await response.json();
        setVehicles(data); 
      } catch (error) {
        console.error("Error al obtener vehículos:", error);
        setError("Error al cargar los vehículos.");
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    const fetchMoney = async () => {
      const userEmail = localStorage.getItem("userEmail");
      try {
        const response = await fetch(`http://localhost:5000/user/${userEmail}`);
        if (!response.ok) {
          throw new Error("Error al obtener el dinero del usuario");
        }
        const data = await response.json();
        setMoney(data.money); 
      } catch (error) {
        console.error("Error al obtener el dinero del usuario:", error);
      }
    };

    fetchMoney();
  }, []);

  const handleBuyVehicle = async (vehId, garageId) => {
    const userId = localStorage.getItem("userId");

    console.log("Comprando vehículo:", { player_id: userId, veh_id: vehId });

    try {
        const response = await fetch("http://localhost:5000/vehicles/buy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ player_id: userId, veh_id: vehId, garage_id: garageId  }),
        });

        if (!response.ok) {
            throw new Error("Error al comprar el vehículo");
        }

        const data = await response.json();

        if (data.success) {
            setMoney(data.newMoney);
            alert("Vehículo comprado con éxito.");
        } else {
            setError(data.error || "Error al comprar el vehículo.");
        }
    } catch (error) {
        console.error("Error al comprar el vehículo:", error);
        setError("Error en el servidor.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>
          Concesionaria: Adquiere nuevos vehículos
          <button onClick={onClose}>
            <img src={ui.close} alt="Ícono para cerrar modal" />
          </button>
        </h2>
        {error && <p className="error-text">{error}</p>}
        <div className="vehicle-list">
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <div key={vehicle.veh_id} className="vehicle-item">
                <img src={vehicle.veh_img_url} alt={vehicle.veh_name} />
                <h2>{vehicle.veh_name}</h2>
                <p>{vehicle.veh_description}</p>
                <p className="priceVeh">Precio: ${vehicle.veh_price}</p>
                <p className="speedVeh">Velocidad: {vehicle.veh_speed} km/h</p>
                <p className="sizeVeh">Capacidad: {vehicle.veh_size} kg</p>

                <select
                    value={selectedGarage}
                    onChange={(e) => setSelectedGarage(e.target.value)}
                >
                    <option value="">Selecciona un garaje</option>
                    {Object.entries(garagesByCity).map(([cityName, garages]) => (
                        <optgroup key={cityName} label={cityName}>
                            {garages.map((garage) => (
                                <option key={garage.garage_id} value={garage.garage_id}>
                                    {`Garaje (Tamaño: ${garage.garage_size})`}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>

                <button
                    onClick={() => handleBuyVehicle(vehicle.veh_id, selectedGarage)}
                    disabled={money < vehicle.veh_price || !selectedGarage}
                >
                    Comprar
                </button>
            </div>
            ))
          ) : (
            <p>No hay vehículos disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConcessionaireModal;