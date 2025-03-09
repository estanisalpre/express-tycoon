const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Buy a garage
router.post("/buy", (req, res) => {
    const { player_id, city_id, cost } = req.body;
  
    const checkMoneyQuery = "SELECT money FROM players WHERE user_id = ?";
    db.query(checkMoneyQuery, [player_id], (err, results) => {
      if (err) {
        console.error("Error al verificar el dinero del jugador:", err);
        return res.status(500).json({ error: "Error en el servidor" });
      }
  
      const userMoney = results[0].money;
      if (userMoney < cost) {
        return res.status(400).json({ error: "No tienes suficiente dinero" });
      }
  
      const insertGarageQuery = "INSERT INTO garages (player_id, city_id, garage_size) VALUES (?, ?, ?)";
      db.query(insertGarageQuery, [player_id, city_id, 2], (err, result) => {
        if (err) {
          console.error("Error al comprar el garaje:", err);
          return res.status(500).json({ error: "Error al comprar el garaje" });
        }

        const updateMoneyQuery = "UPDATE players SET money = money - ? WHERE user_id = ?";
        db.query(updateMoneyQuery, [cost, player_id], (err, result) => {
            if (err) {
                console.error("Error al actualizar el dinero del jugador:", err);
                return res.status(500).json({ error: "Error al actualizar el dinero" });
            }
        

            const updateFirstTimeQuery = "UPDATE players SET first_time = 0 WHERE user_id = ?";
            db.query(updateFirstTimeQuery, [player_id], (err, result) => {
                if (err) {
                    console.error("Error al actualizar first_time:", err);
                    return res.status(500).json({ error: "Error al actualizar first_time" });
                }

            const getNewMoneyQuery = "SELECT money FROM players WHERE user_id = ?";
            db.query(getNewMoneyQuery, [player_id], (err, results) => {
                if (err) {
                console.error("Error al obtener el nuevo saldo:", err);
                return res.status(500).json({ error: "Error en el servidor" });
                }
    
                const newMoney = results[0].money;
                res.json({ success: true, message: "Garaje comprado con éxito", newMoney });
            });
          });
        });
      });
    });
});

router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT g.garage_id, g.city_id, c.city_name, g.garage_size
    FROM garages g
    JOIN cities c ON g.city_id = c.city_id
    WHERE g.player_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error al obtener garajes:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(result);
  });
});

/* // Expandir un garaje
router.post("/expand", (req, res) => {
  const { garage_id, cost } = req.body;

  // Verificar que el jugador tenga suficiente dinero
  const checkMoneyQuery = "SELECT money FROM players WHERE user_id = (SELECT player_id FROM garages WHERE garage_id = ?)";
  db.query(checkMoneyQuery, [garage_id], (err, results) => {
    if (err) {
      console.error("Error al verificar el dinero del jugador:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }

    const userMoney = results[0].money;
    if (userMoney < cost) {
      return res.status(400).json({ error: "No tienes suficiente dinero" });
    }

    // Aumentar el tamaño del garaje
    const expandGarageQuery = "UPDATE garages SET garage_size = garage_size + 1 WHERE garage_id = ?";
    db.query(expandGarageQuery, [garage_id], (err, result) => {
      if (err) {
        console.error("Error al expandir el garaje:", err);
        return res.status(500).json({ error: "Error al expandir el garaje" });
      }

      // Restar el costo de la expansión al dinero del jugador
      const updateMoneyQuery = "UPDATE players SET money = money - ? WHERE user_id = (SELECT player_id FROM garages WHERE garage_id = ?)";
      db.query(updateMoneyQuery, [cost, garage_id], (err, result) => {
        if (err) {
          console.error("Error al actualizar el dinero del jugador:", err);
          return res.status(500).json({ error: "Error al actualizar el dinero" });
        }

        res.json({ success: true, message: "Garaje expandido con éxito" });
      });
    });
  });
}); */

module.exports = router;