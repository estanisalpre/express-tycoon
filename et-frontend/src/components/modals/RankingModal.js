import React, {useState,useEffect} from "react";
import { ui } from "../../utils/Images";

function RankingModal({ onClose }) {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/ranking") 
      .then(res => res.json())
      .then(data => setRanking(data))
      .catch(err => console.error("Error cargando el ranking:", err));
  }, []);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Ranking Global: Compite por tener el mayor imperio<button onClick={onClose}><img src={ui.close} alt="Ícono para cerrar modal"/></button></h2>
        <table>
          <thead>
            <tr>
              <th>Posición</th>
              <th>Empresa</th>
              <th>Capital</th>
              <th>Vehículos</th>
              <th>Rutas</th>
              <th>Garajes</th>
              <th>Nivel</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((player, index) => (
              <tr key={player.user_id}>
                <td>{index + 1}</td>
                <td>{player.company_name}</td>
                <td>${player.money.toLocaleString()}</td>
                <td>{player.total_vehicles}</td>
                <td>{player.total_routes}</td>
                <td>{player.total_garages}</td>
                <td>{player.level}</td>
              </tr>
            ))}
          </tbody>
      </table>
      </div>
    </div>
  );
}

export default RankingModal;