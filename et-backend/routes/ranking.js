const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
    const sql = `
      SELECT 
        p.user_id, 
        c.company_name, 
        p.money, 
        -- Calcular el total de vehículos asociados al jugador
        (SELECT COUNT(*) FROM trucks_inventory ti WHERE ti.user_id = p.user_id) AS total_vehicles,
        -- Calcular el total de rutas asociadas al jugador
        (SELECT COUNT(*) FROM routes r WHERE r.user_id = p.user_id) AS total_routes,
        -- Calcular el total de garajes asociados al jugador
        (SELECT COUNT(*) FROM garages g WHERE g.player_id = p.user_id) AS total_garages,
        p.level, 
        -- Calcular el ranking basado en el dinero (ordenado de mayor a menor)
        RANK() OVER (ORDER BY p.money DESC) AS ranking
        FROM players p
        LEFT JOIN companies c ON p.company_id = c.company_id
        ORDER BY p.money DESC
        LIMIT 50;
    `;
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error al obtener el ranking:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }
      res.json(results);
    });
});

module.exports = router;