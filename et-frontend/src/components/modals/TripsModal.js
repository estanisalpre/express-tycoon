import React, { useState, useEffect } from "react";
import { ui, playerMenu } from "../../utils/Images";

function TripsModal({ onClose }) {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState([]);
  const [elapsedTimes, setElapsedTimes] = useState([]);
  const [completedRoutes, setCompletedRoutes] = useState([]);
  const [returnTrips, setReturnTrips] = useState([]); 

  useEffect(() => {
    const fetchRouteData = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.error("No se encontró el userId en localStorage.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/routes/${userId}`);
        const data = await response.json();

        if (data?.success && data.routes?.length > 0) {
          setRoutes(data.routes);
          setElapsedTimes(Array(data.routes.length).fill(0));
          setCompletedRoutes(Array(data.routes.length).fill(false));
          setReturnTrips(Array(data.routes.length).fill(false)); // 🔹 Inicializamos en "ida"
        } else {
          setRoutes([]);
        }
      } catch (error) {
        console.error("Error al obtener datos de las rutas:", error);
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteData();
  }, []);

  const startTimer = (estimatedTime, index) => {
    const totalTimeInSeconds = parseFloat(estimatedTime) * 60 * 60;
    if (timers[index]) return;
  
    const newTimers = [...timers];
    const interval = setInterval(() => {
      setElapsedTimes((prev) => {
        const newTimes = [...prev];
        newTimes[index] = Math.min((newTimes[index] || 0) + 1, totalTimeInSeconds);
        return newTimes;
      });
    }, 1000);
  
    newTimers[index] = interval;
    setTimers(newTimers);
  
    setTimeout(() => {
      clearInterval(interval);
      newTimers[index] = null;
      setTimers(newTimers);
  
      // 💰 Pagar al usuario por este tramo del viaje
      updateUserBalance(routes[index].price);
  
      // 🔄 Alternar entre ida y vuelta
      setReturnTrips((prev) => {
        const newReturnTrips = [...prev];
        newReturnTrips[index] = !newReturnTrips[index];
        return newReturnTrips;
      });

      // ⏳ Marcar la ruta como completada hasta que el usuario inicie la siguiente fase
      setCompletedRoutes((prev) => {
        const newCompletedRoutes = [...prev];
        newCompletedRoutes[index] = true;
        return newCompletedRoutes;
      });

      // 🔄 Resetear el tiempo transcurrido para cuando inicie el regreso
      setElapsedTimes((prev) => {
        const newTimes = [...prev];
        newTimes[index] = 0;
        return newTimes;
      });

    }, totalTimeInSeconds * 1000);
  };

  const iniciarRuta = (estimatedTime, index) => {
    setElapsedTimes((prev) => {
      const newTimes = [...prev];
      newTimes[index] = 0;
      return newTimes;
    });
    setCompletedRoutes((prev) => {
      const newCompletedRoutes = [...prev];
      newCompletedRoutes[index] = false;
      return newCompletedRoutes;
    });
    startTimer(estimatedTime, index);
  };

  const calculateTimeRemaining = (estimatedTime, index) => {
    const totalTimeInSeconds = parseFloat(estimatedTime) * 60 * 60;
    const timeLeft = Math.max(totalTimeInSeconds - (elapsedTimes[index] || 0), 0);
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = Math.floor(timeLeft % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const getVehiclePosition = (estimatedTime, index) => {
    const totalTimeInSeconds = parseFloat(estimatedTime) * 60 * 60;
    const elapsed = elapsedTimes[index] || 0;
    return Math.min((elapsed / totalTimeInSeconds) * 100, 100);
  };

  if (loading) return <div>Cargando...</div>;
  if (routes.length === 0) return <div>No hay rutas disponibles.</div>;

  const updateUserBalance = async (amount) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
  
    try {
      const response = await fetch(`http://localhost:5000/players/update-balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount: parseFloat(amount) }), // Asegúrate de enviar la cantidad como número
      });
      const data = await response.json();
  
      if (data.success) {
        console.log("Saldo actualizado correctamente:", data.newBalance);
      } else {
        console.error("Error al actualizar saldo:", data.message);
      }
    } catch (error) {
      console.error("Error en la solicitud de actualización de saldo:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>
          Mis Viajes
          <button onClick={onClose}>
            <img src={ui.close} alt="Cerrar" />
          </button>
        </h2>

        <div className="routes-container">
          {routes.map((route, index) => (
            <div key={index} className="route-container">
              <div className="route-line" style={{ position: "relative", width: "40%" }}>
                <div
                  className="vehicle"
                  style={{
                    position: "absolute",
                    left: "0",
                    width: `${getVehiclePosition(route.estimated_time, index)}%`,
                    transition: "width 1s linear",
                    height: "30px",
                  }}
                >
                  {elapsedTimes[index] > 0 && (
                    <img
                      src={playerMenu.employee}
                      alt="Vehículo"
                      style={{ width: "30px", height: "auto", objectFit: "contain" }}
                    />
                  )}
                </div>
              </div>
              <p>
                {returnTrips[index] ? `${route.destination_city_name} → ${route.origin_city_name}` : `${route.origin_city_name} → ${route.destination_city_name}`}
              </p>
              <p>Precio Estimado: ${route.price}</p>
              <p>Tiempo Restante: {calculateTimeRemaining(route.estimated_time, index)}</p>
              <button
                onClick={() => iniciarRuta(route.estimated_time, index)}
                disabled={!completedRoutes[index] && elapsedTimes[index] > 0}>
                {completedRoutes[index] ? "Iniciar" : "Iniciar"} (${route.price})
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TripsModal;
