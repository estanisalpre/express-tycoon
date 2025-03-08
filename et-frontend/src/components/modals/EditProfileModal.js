import React from "react";
import { ui } from "../../utils/Images";

function EditProfileModal({ onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Editar perfil<button onClick={onClose}><img src={ui.close} alt="Ícono para cerrar modal"/></button></h2>
      </div>
    </div>
  );
}

export default EditProfileModal;