import React, { useState, useEffect } from "react";
import LeftWall from "../components/LeftWall";
import RightWall from "../components/RightWall";
import CentralWall from '../components/CentralWall';
import PlayerMenu from "../components/PlayerMenu";
import PlayerTopStats from "../components/PlayerTopStats";
import { getUserData } from "../services/authService";
import { playerStatsIcon } from "../utils/Images";

function Game() {
  const [activeModal, setActiveModal] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [money, setMoney] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const firstTime = localStorage.getItem("firstTime");
    if (firstTime === "1") {
      setShowWelcomeModal(true);
    }

    const fetchUserData = async () => {
      const userEmail = localStorage.getItem("userEmail");
      try {
        const userData = await getUserData(userEmail);
        setMoney(userData.money);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, []);

  const fetchCities = async (query) => {
    try {
      const response = await fetch(`http://localhost:5000/cities?search=${query}`);
      const data = await response.json();

      const filtered = data
        .filter((city) =>
          city.city_name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5);

      setFilteredCities(filtered);

      if (filtered.length === 0) {
        setError("Ciudad no encontrada. Prueba con otra.");
      } else {
        setError("");
      }
    } catch (error) {
      console.error("Error al obtener ciudades:", error);
      setError("Error al buscar ciudades.");
    }
  };

  const handleConfirm = async () => {
    if (!selectedCity) {
      setError("Por favor, selecciona una ciudad.");
      return;
    }

    setLoading(true);

    try {
      const userId = localStorage.getItem("userId");
      const garageCost = 50000;

      const response = await fetch("http://localhost:5000/garages/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player_id: userId, city_id: selectedCity, cost: garageCost }),
      });

      const data = await response.json();

      if (data.success) {
        const userEmail = localStorage.getItem("userEmail");
        const userData = await getUserData(userEmail);
        setMoney(userData.money);

        setShowWelcomeModal(false);
        setShowCityModal(false);
      } else {
        setError("Error al comprar el garaje.");
      }
    } catch (error) {
      console.error("Error al comprar el garaje:", error);
      setError("Error en el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="fatherContainer">
      {showWelcomeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>¡Bienvenido a Express Tycoon!</h2>
            <p>Donde podrás construir tu imperio logístico desde cero, bajo tus propias decisiones.</p>
            <p>Inicias con $200,000 dólares, y ya tienes tu primer gasto: tu garaje.</p>
            <p>En él, podrás almacenar tus vehículos de trabajo.</p>
            <button className="initialBtns" onClick={() => { setShowWelcomeModal(false); setShowCityModal(true); }}>
              <img src={playerStatsIcon.garages} alt="Ícono de garaje de vehículos"/>
              Comprar primer garaje $50,000
            </button>
          </div>
        </div>
      )}

      {showCityModal && (
        <div className="modal-overlay">
          {error && <p className="error-text">{error}</p>}
          <div className="modal-content">
            <h2>¿En qué ciudad vas a iniciar?</h2>
            <input
              type="text"
              placeholder="Busca una ciudad..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                fetchCities(e.target.value);
              }}
            />
            <div className="city-list">
              {filteredCities.map((city) => (
                <div
                  key={city.city_id}
                  className={`city-item ${selectedCity === city.city_id ? "selected" : ""}`}
                  onClick={() => setSelectedCity(city.city_id)}
                >
                  {city.city_name}, {city.country}
                </div>
              ))}
            </div>
            <button className="initialBtns" onClick={handleConfirm} disabled={loading}>
              {loading ? "Guardando..." : "Aceptar"}
            </button>
          </div>
        </div>
      )}

      <PlayerTopStats money={money} />
      <LeftWall setActiveModal={setActiveModal} />
      <CentralWall activeModal={activeModal} setActiveModal={setActiveModal} />
      <RightWall setActiveModal={setActiveModal} />
      <PlayerMenu setActiveModal={setActiveModal} />
    </section>
  );
}

export default Game;