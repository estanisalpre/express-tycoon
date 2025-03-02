const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Obtener los camiones de un usuario
router.get("/:userId", (req, res) => {
    const { userId } = req.params;
    const sql = `
        SELECT ti.id, v.name, v.price, g.city 
        FROM trucks_inventory ti
        JOIN vehicles v ON ti.veh_id = v.id
        JOIN garages g ON ti.garage_id = g.id
        WHERE ti.user_id = ?
    `;
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("Error al obtener camiones:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }
        res.json(result);
    });
});

// Comprar un camión
router.post("/buy", (req, res) => {
    const { userId, vehId, garageId } = req.body;

    const sql = `INSERT INTO trucks_inventory (user_id, veh_id, garage_id) VALUES (?, ?, ?)`;
    db.query(sql, [userId, vehId, garageId], (err, result) => {
        if (err) {
            console.error("Error al comprar camión:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }
        res.json({ message: "🚛 Camión comprado con éxito!", truckId });
    });
});

module.exports = router;
