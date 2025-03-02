const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Obtener todos los vehículos disponibles en la tienda
router.get("/", (req, res) => {
    db.query("SELECT * FROM vehicles", (err, result) => {
        if (err) {
            console.error("Error al obtener vehículos:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }
        res.json(result);
    });
});

module.exports = router;
