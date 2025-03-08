import React from "react";
import { ui } from "../../utils/Images";

function RoutesModal({ onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Rutas: Personaliza, crea y edita tus rutas<button onClick={onClose}><img src={ui.close} alt="Ícono para cerrar modal"/></button></h2>
      </div>
    </div>
  );
}

export default RoutesModal;