import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';

// Ícono para el camión
const truckIcon = new L.Icon({
  iconUrl: '/path/to/truck-icon.png', // Reemplaza con la ruta de tu ícono
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Función para interpolar la posición (avance del camión) según el progreso
const interpolatePosition = (origin, destination, factor) => ({
  lat: origin.lat + (destination.lat - origin.lat) * factor,
  lng: origin.lng + (destination.lng - origin.lng) * factor,
});

const MapRoutes = ({ routes }) => {
  // Aseguramos que routes sea un array, sino usamos un array vacío
  const safeRoutes = Array.isArray(routes) ? routes : [];

  if (safeRoutes.length === 0) {
    return <div>No hay rutas para mostrar en el mapa.</div>;
  }

  // Construir un array de todas las posiciones (origen y destino)
  const allPositions = safeRoutes.reduce((acc, route) => {
    // Verificar que existan las coordenadas
    if (route.origin_lat && route.origin_lon && route.destination_lat && route.destination_lon) {
      acc.push({ lat: parseFloat(route.origin_lat), lng: parseFloat(route.origin_lon) });
      acc.push({ lat: parseFloat(route.destination_lat), lng: parseFloat(route.destination_lon) });
    }
    return acc;
  }, []);

  if (allPositions.length === 0) {
    return <div>No hay coordenadas disponibles para mostrar la ruta.</div>;
  }

  // Calcular el centro del mapa
  const center = {
    lat: allPositions.reduce((sum, pos) => sum + pos.lat, 0) / allPositions.length,
    lng: allPositions.reduce((sum, pos) => sum + pos.lng, 0) / allPositions.length,
  };

  return (
    <MapContainer center={center} zoom={6} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {safeRoutes.map((route, idx) => {
        const origin = { 
          lat: parseFloat(route.origin_lat), 
          lng: parseFloat(route.origin_lon) 
        };
        const destination = { 
          lat: parseFloat(route.destination_lat), 
          lng: parseFloat(route.destination_lon) 
        };

        // Suponiendo que cada ruta tiene un valor "progress" entre 0 y 1 (si no, 0 por defecto)
        const progress = route.progress || 0;
        const truckPosition = interpolatePosition(origin, destination, progress);

        return (
          <React.Fragment key={idx}>
            <Polyline positions={[origin, destination]} color="blue" />
            <Marker position={truckPosition} icon={truckIcon} />
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
};

export default MapRoutes;
