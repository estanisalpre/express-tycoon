import React from 'react';
import { playerMenu } from '../utils/Images';

function PlayerMenu({setActiveModal}) {
  return (
    <section className='playerMenu'>
      <ul>
        <li><button disabled className='link' onClick={() => setActiveModal("map")}><span>Mapa</span><img src={playerMenu.map} alt=''/></button></li>
        <li><button className='link' onClick={() => setActiveModal("garages")}><span>Mis Garajes</span><img src={playerMenu.garage} alt=''/></button></li>
        <li><button className='link' onClick={() => setActiveModal("vehicles")}><span>Mis Vehículos</span><img src={playerMenu.vehicle} alt=''/></button></li>
        <li><button className='link' onClick={() => setActiveModal("routes")}><span>Mis Rutas</span><img src={playerMenu.route} alt=''/></button></li>
        <li><button disabled className='link' onClick={() => setActiveModal("companies")}><span>Mis Sedes</span><img src={playerMenu.corporation} alt=''/></button></li>
        <li><button disabled className='link' onClick={() => setActiveModal("employees")}><span>Empleados</span><img src={playerMenu.employee} alt=''/></button></li>
        <li><button disabled className='link' onClick={() => setActiveModal("maintenance")}><span>Mantenimiento</span><img src={playerMenu.maintenance} alt=''/></button></li>
        <li><button disabled className='link' onClick={() => setActiveModal("realState")}><span>Inmobiliaria</span><img src={playerMenu.realState} alt=''/></button></li>
        <li className='specialLi'><button className='link' onClick={() => setActiveModal("concessionaire")}><span className='specialSpan'>Concesionario</span><img src={playerMenu.concessionaire} alt=''/></button></li>
        <li><button className='link' onClick={() => setActiveModal("gas-station")}><span>Gasolinera</span><img src={playerMenu.gasStation} alt=''/></button></li>
      </ul>
    </section>
  );
}

export default PlayerMenu;