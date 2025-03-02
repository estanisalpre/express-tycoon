import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link className='link' to="/game">Game</Link></li>
        <li><Link className='link' to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
