import React from 'react';
import { useParams } from 'react-router-dom';

function RouteDetails() {
  const { id } = useParams();  // Para obtener el ID de la ruta desde la URL
  return (
    <div>
      <h1>Route Details for Route {id}</h1>
    </div>
  );
}
export default RouteDetails;
