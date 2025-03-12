import React, { useState, useEffect } from "react";
import { getUserData } from "../../services/authService";
import { ui, playerMenu } from "../../utils/Images";

function TripsModal({ onClose }) {
  const [routes, setRoutes] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");

    if(!userEmail){
      console.error("Email inexistente para buscar las entregas realizadas")
      return;
    }

    getUserData(userEmail).then((data) => {
      if (data.error) {
        console.error("Error al obtener datos (entregas):", data.error);
        return;
      } 
      setUserData(data);
    
      const count_deliveries = parseInt(data.deliveries_made); // Usar `data`, no `userData`
      return count_deliveries;
    });
  }, [userData]);

  // Cargar rutas desde el backend
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

  // Actualiza currentTime cada segundo (para refrescar la UI)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // UPDATE DELIVERIES_MADE
  const updateDeliveriesMade = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
  
    try {
      const response = await fetch("http://localhost:5000/players/update-deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
  
      const data = await response.json();
      if (data.success) {
        console.log("Entregas actualizadas correctamente.");
      } else {
        console.error("Error al actualizar entregas:", data.message);
      }
    } catch (error) {
      console.error("Error en updateDeliveriesMade:", error);
    }
  };

  // Función para actualizar el balance del usuario
  const updateUserBalance = async (amount) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:5000/players/update-balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount }),
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

  // Calcula el tiempo transcurrido en segundos comparando currentTime con el start_time
  const calculateElapsed = (route) => {
    if (route.status !== "activo" || !route.start_time) return 0;
    // Convertimos "YYYY-MM-DD HH:mm:ss" a formato ISO si es necesario.
    const startTime = new Date(route.start_time.replace(" ", "T"));
    return Math.floor((currentTime - startTime.getTime()) / 1000);
  };

  const calculateTimeRemaining = (route) => {
    const totalTimeInSeconds = parseFloat(route.estimated_time) * 60 * 60;
    const elapsed = calculateElapsed(route);
    const timeLeft = Math.max(totalTimeInSeconds - elapsed, 0);
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = Math.floor(timeLeft % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const getVehiclePosition = (route) => {
    const totalTimeInSeconds = parseFloat(route.estimated_time) * 60 * 60;
    const elapsed = calculateElapsed(route);
    return Math.min((elapsed / totalTimeInSeconds) * 100, 100);
  };

  // Función para iniciar el viaje o la vuelta.
  // El parámetro isReturn indica si se está iniciando el viaje de vuelta.
  const iniciarRuta = async (estimatedTime, index, isReturn = false) => {
    try {
      const routeId = routes[index].route_id;
      const newStartTime = new Date().toISOString();
      // Aquí se envía isReturn al backend para actualizar el campo is_return
      const response = await fetch(`http://localhost:5000/routes/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routeId, start_time: newStartTime, isReturn }),
      });
      const data = await response.json();
      if (!data.success) {
        console.error("Error al iniciar ruta:", data.message);
        return;
      }

      // Actualizamos localmente el objeto de la ruta:
      // Si isReturn es true, actualizamos is_return a 1 y cambiamos el status a "activo" con nuevo start_time.
      const newRoutes = routes.map((route, i) =>
        i === index
          ? { ...route, status: "activo", start_time: newStartTime, is_return: isReturn ? 1 : 0 }
          : route
      );
      setRoutes(newRoutes);
    } catch (error) {
      console.error("Error en iniciarRuta:", error);
    }
  };

  // Completar la ruta: se deposita el dinero y se actualiza el status a "completado"
  const completeRoute = async (routeId, index) => {
    try {
      // Depositar el dinero (el precio es el mismo para ambos tramos)
      await updateUserBalance(routes[index].price);
      await updateDeliveriesMade();

      // Actualizar la ruta a "completado" en el backend
      const response = await fetch(`http://localhost:5000/routes/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routeId }),
      });
      const data = await response.json();
      if (data.success) {
        // Actualizamos localmente el status a "completado"
        const newRoutes = routes.map((route, i) =>
          i === index ? { ...route, status: "completado" } : route
        );
        setRoutes(newRoutes);
      } else {
        console.error("Error al completar ruta:", data.message);
      }
    } catch (error) {
      console.error("Error en completeRoute:", error);
    }
  };

  // Revisa de forma continua si alguna ruta activa se completó
  useEffect(() => {
    routes.forEach((route, index) => {
      if (route.status === "activo") {
        const totalTimeInSeconds = parseFloat(route.estimated_time) * 60 * 60;
        if (calculateElapsed(route) >= totalTimeInSeconds) {
          completeRoute(route.route_id, index);
        }
      }
    });
  }, [currentTime, routes]);

  if (loading) return <div>Cargando...</div>;
  if (routes.length === 0) return <div>No hay rutas disponibles.</div>;

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
              <div className="route-line" style={{ position: "relative", width: "30%" }}>
                <div
                  className="vehicle"
                  style={{
                    position: "absolute",
                    left: "0",
                    width: `${getVehiclePosition(route)}%`,
                    transition: "width 1s linear",
                    height: "30px",
                  }}
                >
                  {route.status === "activo" && (
                    <img
                      src={playerMenu.employee}
                      alt="Vehículo"
                      style={{
                        width: "30px",
                        height: "auto",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </div>
              </div>
              {/* La visualización del trayecto depende de route.is_return */}
              <p>
                { route.is_return
                  ? `${route.destination_city_name} → ${route.origin_city_name}`
                  : `${route.origin_city_name} → ${route.destination_city_name}`
                }
              </p>
              <p>Precio Estimado: ${route.price}</p>
              <p>
                Tiempo Restante:{" "}
                {route.status === "activo"
                  ? calculateTimeRemaining(route)
                  : `${parseFloat(route.estimated_time).toFixed(2)}h`}
              </p>
              {/* Botón según el estado de la ruta */}
              {route.status === "pendiente" && (
                <button onClick={() => iniciarRuta(route.estimated_time, index, false)}>
                  Iniciar ($ {route.price})
                </button>
              )}
              {route.status === "activo" && (
                <button disabled>
                  En curso ($ {route.price})
                </button>
              )}
              {route.status === "completado" && Number(route.is_return) === 0 && (
                <button onClick={() => iniciarRuta(route.estimated_time, index, true)}>
                  Iniciar Vuelta ($ {route.price})
                </button>
              )}
              {route.status === "completado" && Number(route.is_return) === 1 && (
                <button onClick={() => iniciarRuta(route.estimated_time, index, false)}>
                  Iniciar ($ {route.price})
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TripsModal;
