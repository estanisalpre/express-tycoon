import React from "react";
import { ui } from "../../utils/Images";

function RankingModal({ onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Ranking Global: Compite por tener el mayor imperio<button onClick={onClose}><img src={ui.close} alt="Ícono para cerrar modal"/></button></h2>
      </div>
    </div>
  );
}

export default RankingModal;