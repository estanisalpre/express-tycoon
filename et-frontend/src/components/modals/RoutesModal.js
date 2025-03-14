import React, { useState, useEffect } from "react";
import { ui } from "../../utils/Images";

function RoutesModal({ onClose }) {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreateRouteModal, setShowCreateRouteModal] = useState(false);
    const [destinationCity, setDestinationCity] = useState("");
    const [originCityData, setOriginCityData] = useState(null);
    const [destinationCityData, setDestinationCityData] = useState(null);
    const [citySearchResults, setCitySearchResults] = useState([]);
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
        const fetchRoutes = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const response = await fetch(`http://localhost:5000/routes?user_id=${userId}`);
                const data = await response.json();

                if (data.success) {
                    setRoutes(data.routes);
                } else {
                    setRoutes([]);
                }
            } catch (err) {
                console.error("Error al obtener rutas:", err);
                setError("Error al cargar las rutas.");
            } finally {
                setLoading(false);
            }
        };

        fetchRoutes();
    }, []);

    const openCreateRouteModal = () => {
        setShowCreateRouteModal(true);
    };

    const closeCreateRouteModal = () => {
        setShowCreateRouteModal(false);
        setDestinationCity("");
        setOriginCityData(null);
        setDestinationCityData(null);
    };

    const handleCitySearch = async (query) => {
        try {
            const response = await fetch(`http://localhost:5000/cities?search=${query}`);
            const data = await response.json();

            const filtered = data
                .filter((city) =>
                    city.city_name.toLowerCase().includes(query.toLowerCase())
                )
                .slice(0, 5);

            setCitySearchResults(filtered);

            if (filtered.length === 0) {
                setError("Ciudad no encontrada. Prueba con otra.");
            } else {
                setError("");
            }
        } catch (error) {
            console.error("Error al obtener ciudades:", error);
            setError("Error al buscar ciudades.");
        }
    };

    const handleCitySelect = (city, isOrigin) => {
        if (isOrigin) {
            setOriginCityData(city);
        } else {
            setDestinationCity(city.city_name);
            setDestinationCityData(city);
        }
        setCitySearchResults([]);
    };

    const handleCreateRoute = async () => {
        if (!selectedGarage || !destinationCityData) {
            alert("Selecciona las ciudades de origen y destino");
            return;
        }

        try {
            const userId = localStorage.getItem("userId");

            const cityGarages = Object.values(garagesByCity).flat();
            const garage = cityGarages.find(
              (garage) => garage.city_id === parseInt(selectedGarage)
            );
  

            if (!garage) {
                alert("No tienes un garaje en la ciudad de origen seleccionada.");
                return;
            }

            const garageId = garage.garage_id;

            // Llamar al endpoint para crear la ruta
            const response = await fetch("http://localhost:5000/routes/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    origin_city: garage.city_id,
                    destination_city: destinationCityData.city_id,
                    garage_id: garageId, 
                }),
            });

            const data = await response.json();

            if (data.success) {
                closeCreateRouteModal();
                const fetchResponse = await fetch(`http://localhost:5000/routes?user_id=${userId}`);
                const fetchData = await fetchResponse.json();
                setRoutes(fetchData.routes);
            } else {
                setError("Error al crear la ruta.");
            }
        } catch (err) {
            console.error("Error al crear la ruta:", err);
            setError("Error en el servidor.");
        }
    };

    // Eliminar ruta
    const deleteRoute = (routeId) => {
      fetch(`http://localhost:5000/routes/delete/${routeId}`, {
          method: "DELETE"
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              setRoutes(routes.filter(route => route.route_id !== routeId));
          } else {
              console.error("Error al eliminar ruta:", data.message);
          }
      })
      .catch(error => console.error("Error al eliminar ruta:", error));
    };

    const handleSpeedChange = async (routeId, speed) => {
      try {
          const response = await fetch("http://localhost:5000/routes/update-speed", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ route_id: routeId, speed }),
          });
  
          const data = await response.json();
  
          if (data.success) {
              setRoutes((prevRoutes) =>
                  prevRoutes.map((route) =>
                      route.route_id === routeId
                          ? { ...route, selected_speed: speed, estimated_time: data.estimated_time }
                          : route
                  )
              );
          } else {
              alert("Error al actualizar la velocidad.");
          }
      } catch (error) {
          console.error("Error al actualizar velocidad:", error);
      }
    };

    const convertToHMS = (timeHours) => {
        // Multiplicamos por 3600 para convertir horas a segundos
        const totalSeconds = Math.round(timeHours * 3600);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    return (
        <div className="modal">
            <div className="modal-content-routes">
                <h2>
                    Rutas: Personaliza y crea tus rutas
                    <button onClick={onClose}>
                        <img src={ui.close} alt="Ícono para cerrar modal" />
                    </button>
                </h2>

                <div>
                    {loading ? (
                        <p>Cargando rutas...</p>
                    ) : error ? (
                        <p className="error-text">{error}</p>
                    ) : routes.length === 0 ? (
                        <div className="noRoutesSpan">
                            <span>Aún no tienes rutas</span>
                        </div>
                    ) : (
                        <ul className="route-list">
                            {routes.map((route) => (
                                <li key={route.route_id} className="route-item">
                                  <span>#{route.route_id}</span>
                                  <strong>{route.origin_city_name} → {route.destination_city_name}</strong>
                                  <select
                                      value={route.selected_speed || ""}
                                      onChange={(e) => handleSpeedChange(route.route_id, e.target.value)}
                                  >
                                      <option value="">Selecciona velocidad</option>
                                      <option value="60">60 km/h (Económico)</option>
                                      <option value="80">80 km/h (Normal)</option>
                                      <option value="100">100 km/h (Rápido)</option>
                                      <option value="120">120 km/h (Express)</option>
                                  </select>
                                  <p>Distancia: {route.km_distance} km</p>→
                                  <p>Tiempo estimado: {convertToHMS(route.estimated_time)}</p>
                                  <img
                                      src={ui.delete}
                                      alt="Eliminar ruta"
                                      className="delete-icon"
                                      onClick={() => deleteRoute(route.route_id)}
                                  />
                                </li>
                            ))}
                        </ul>
                    )}
                    <button className="initialBtns" onClick={openCreateRouteModal}>
                        Crear nueva ruta
                    </button>
                </div>

                {showCreateRouteModal && (
                    <div className="create-route-modal">
                        <div>
                          <h3>Crear nueva ruta</h3>
                          <label>
                              Ciudad de origen:
                              <select
                                value={selectedGarage}
                                onChange={(e) => setSelectedGarage(e.target.value)}
                            >
                                <option value="">Selecciona una garage</option>
                                  {Object.entries(garagesByCity).map(([cityName, garages]) => {
                                      const cityId = garages[0].city_id;
                                      return (
                                          <option key={cityId} value={cityId}>
                                              {cityName}
                                          </option>
                                      );
                                  })}
                            </select>
                          </label>

                          <label>
                              Ciudad de destino:
                              <input
                                  type="text"
                                  placeholder="Ingresa ciudad de destino"
                                  value={destinationCity}
                                  onChange={(e) => {
                                      setDestinationCity(e.target.value);
                                      handleCitySearch(e.target.value);
                                  }}
                              />
                              <ul>
                                  {citySearchResults.length > 0 ? (
                                      citySearchResults.slice(0, 5).map((city) => (
                                          <li key={city.city_id} onClick={() => handleCitySelect(city, false)}>
                                              {city.city_name}, {city.country}
                                          </li>
                                      ))
                                  ) : (
                                      <li>No se encontraron ciudades.</li>
                                  )}
                              </ul>
                          </label>
                          
                          <div className="createRouteBtns">
                            <button onClick={handleCreateRoute}>Crear ruta</button>
                            <button onClick={closeCreateRouteModal}>Cancelar</button>
                          </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RoutesModal;