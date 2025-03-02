const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Obtener todos los jugadores
router.get("/", (req, res) => {
    db.query("SELECT * FROM players", (err, result) => {
        if (err) {
            console.error("Error al obtener jugadores:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }
        res.json(result);
    });
});

// Registrar un nuevo jugador
router.post("/register", (req, res) => {
    const { user_name, user_email, user_password } = req.body;
    const sql = `INSERT INTO players (user_name, user_email, user_password) VALUES (?, ?, ?)`;

    db.query(sql, [user_name, user_email, user_password], (err, result) => {
        if (err) {
            console.error("Error al registrar usuario:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }
        res.json({ message: "✅ Usuario registrado con éxito!", userId: result.insertId });
    });
});

module.exports = router;
