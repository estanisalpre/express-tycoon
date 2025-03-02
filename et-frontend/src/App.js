import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Game from './pages/Game';
import Login from './pages/Login';
//import Register from './pages/Register';
import RouteDetails from './pages/RouteDetails';
import Navbar from './components/Navbar'; 

function App() {
  return (
    <Router>
      <Navbar /> 
      <main id="main">
        <Routes>
          <Route path="/game" element={<Game />} />
          <Route path="/login" element={<Login />} />
          <Route path="/route/:id" element={<RouteDetails />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

