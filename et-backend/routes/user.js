const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/:email", (req, res) => {
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({ error: "Correo es requerido" });
    }

    db.query(
        "SELECT user_id, user_name, user_email, money, level, experience, first_time FROM players WHERE user_email = ?",
        [email],
        (err, results) => {
            if (err) {
                console.error("Error al buscar el usuario:", err);
                return res.status(500).json({ error: "Error del servidor" });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            res.json(results[0]);
        }
    );
});

module.exports = router;


