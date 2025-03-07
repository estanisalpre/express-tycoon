import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Login from './pages/Login';
import Register from './pages/Register';
import RouteDetails from './pages/RouteDetails';
import Navbar from './components/Navbar'; 

function App() {
  return (
    <Router>
      <Navbar /> 
      <main id="main">
        <Routes id="route">
          <Route id="route" path="/" element={<Home />} />
          <Route id="route" path="/game" element={<Game />} />
          <Route id="route" path="/login" element={<Login />} />
          <Route id="route" path="/register" element={<Register />} />
          <Route id="route" path="/route/:id" element={<RouteDetails />} />
        </Routes>
      </main>
      {/* <Footer />  */}
    </Router>
  );
}

export default App;

