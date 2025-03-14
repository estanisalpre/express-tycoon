import React from "react";
import { ui } from "../../utils/Images";

function RealStateModal({ onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Inmobiliaria: Adquiere nuevos garajes y sedes<button onClick={onClose}><img src={ui.close} alt="Ícono para cerrar modal"/></button></h2>
      </div>
    </div>
  );
}

export default RealStateModal;