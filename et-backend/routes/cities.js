const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Obtener todas las ciudades
router.get("/", (req, res) => {
    db.query("SELECT * FROM cities", (err, result) => {
        if (err) {
            console.error("Error al obtener ciudades:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }
        res.json(result);
    });
});

module.exports = router;
