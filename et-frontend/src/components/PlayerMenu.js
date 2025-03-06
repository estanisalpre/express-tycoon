import React from 'react';
import { Link } from 'react-router-dom';
import { playerMenu } from '../utils/Images';

function PlayerMenu() {
  return (
    <section className='playerMenu'>
      <ul>
        <li><Link className='link' path="/">
          <span>Mapa</span>
          <img src={playerMenu.map} alt=''/>
        </Link></li>

        <li><Link className='link' path="/">
          <span>Mis Garajes</span>
          <img src={playerMenu.garage} alt=''/>
        </Link></li>

        <li><Link className='link' path="/">
          <span>Mis Vehículos</span>
          <img src={playerMenu.vehicle} alt=''/>
        </Link></li>

        <li><Link className='link' path="/">
          <span>Mis Rutas</span>
          <img src={playerMenu.route} alt=''/>
        </Link></li>

        <li><Link className='link' path="/">
          <span>Mis Sedes</span>
          <img src={playerMenu.corporation} alt=''/>
        </Link></li>

        <li><Link className='link' path="/">
          <span>Empleados</span>
          <img src={playerMenu.employee} alt=''/>
        </Link></li>
        
        <li><Link className='link' path="/">
          <span>Mantenimiento</span>
          <img src={playerMenu.maintenance} alt=''/>
        </Link></li>

        <li><Link className='link' path="/">
          <span>Inmobiliaria</span>
          <img src={playerMenu.realState} alt=''/>
        </Link></li>

        <li className='specialLi'><Link className='link' path="/">
          <span className='specialSpan'>Concesionario</span>
          <img src={playerMenu.concessionaire} alt=''/>
        </Link></li>
        
        <li><Link className='link' path="/">
          <span>Gasolinera</span>
          <img src={playerMenu.gasStation} alt=''/>
        </Link></li>
      </ul>
    </section>
  );
}

export default PlayerMenu;