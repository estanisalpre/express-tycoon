/* import React, { useState, useEffect } from "react";
import GlobeScene from "../maps/GlobeScene"; 
import { ui } from "../../utils/Images";

function StartModal({ onClose }) {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRouteData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      try {
        const response = await fetch(`http://localhost:5000/routes/${userId}`);
        const data = await response.json();
        if (data?.success && data.routes?.length > 0) {
          setRoutes(data.routes);
        } else {
          setRoutes([]);
        }
      } catch (error) {
        console.error("Error al obtener rutas:", error);
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteData();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (routes.length === 0) return <div>No hay rutas disponibles.</div>;

  return (
    <div className="modal startModal">
      <div className="modal-content startModal">
        <h2>
          Mapa de Viajes
          <button onClick={onClose}>
            <img src={ui.close} alt="Cerrar" />
          </button>
        </h2>
        <GlobeScene />
      </div>
    </div>
  );
}

export default StartModal; */


import React, { useState, useEffect } from "react";
import MapRoutes from "../maps/MapTruckRoutes"; 
import { ui } from "../../utils/Images";

function StartModal({ onClose }) {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRouteData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      try {
        const response = await fetch(`http://localhost:5000/routes/${userId}`);
        const data = await response.json();
        if (data?.success && data.routes?.length > 0) {
          setRoutes(data.routes);
        } else {
          setRoutes([]);
        }
      } catch (error) {
        console.error("Error al obtener rutas:", error);
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteData();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (routes.length === 0) return <div>No hay rutas disponibles.</div>;

  return (
    <div className="modal">
      <div className="modal-content startModal">
        <h2>
          Mapa de Viajes
          <button onClick={onClose}>
            <img src={ui.close} alt="Cerrar" />
          </button>
        </h2>
        <MapRoutes routes={routes} />
      </div>
    </div>
  );
}

export default StartModal;