import React from 'react';
import { Link } from 'react-router-dom';

function CentralWall() {
  return (
    <section id='wallContainer'>
        <header>
            <Link className='link' to="/game"><img src="#" alt="Back Icon"/></Link>
            <h3>Central wall</h3>
        </header>
    </section>
  );
}

export default CentralWall;