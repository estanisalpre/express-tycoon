import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link className='link' to="/"><img src="#" alt="ExpressTycoon Logo"/></Link>
      <ul>
        <li><Link className='link' to="/game">Game</Link></li>
        <li><Link className='link' to="/login">Login</Link></li>
        <li><Link className='link' to="/register">Register</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
