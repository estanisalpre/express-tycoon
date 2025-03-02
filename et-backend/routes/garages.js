const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Obtener los garajes de un usuario
router.get("/:userId", (req, res) => {
    const { userId } = req.params;
    const sql = `
        SELECT g.id, g.city_id, c.name as city_name, g.capacity
        FROM garages g
        JOIN cities c ON g.city_id = c.id
        WHERE g.user_id = ?
    `;
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("Error al obtener garajes:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }
        res.json(result);
    });
});

module.exports = router;
