const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Buy a garage
router.post("/buy", (req, res) => {
  const { player_id, city_id, cost, company_name } = req.body;

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

      // INSERT NEW GARAGE
      const insertGarageQuery = "INSERT INTO garages (player_id, city_id, garage_size) VALUES (?, ?, ?)";
      db.query(insertGarageQuery, [player_id, city_id, 2], (err, result) => {
          if (err) {
              console.error("Error al comprar el garaje:", err);
              return res.status(500).json({ error: "Error al comprar el garaje" });
          }

          // CREATING THE COMPANY
          const insertCompanyQuery = "INSERT INTO companies (user_id, city_id, company_name, created_at) VALUES (?, ?, ?, NOW())";
          db.query(insertCompanyQuery, [player_id, city_id, company_name], (err, companyResult) => {
              if (err) {
                  console.error("Error al crear la empresa:", err);
                  return res.status(500).json({ error: "Error al crear la empresa" });
              }

              const companyId = companyResult.insertId; 

              const updatePlayerCompanyQuery = "UPDATE players SET company_id = ? WHERE user_id = ?";
              db.query(updatePlayerCompanyQuery, [companyId, player_id], (err, result) => {
                  if (err) {
                      console.error("Error al actualizar el company_id en players:", err);
                      return res.status(500).json({ error: "Error al actualizar el company_id" });
                  }

                  updatePlayerAndMoney(player_id, cost, res);
              });
          });
      });
  });
});

// UPDATE MONEY
function updatePlayerAndMoney(player_id, cost, res) {
    const updateMoneyQuery = "UPDATE players SET money = money - ?, first_time = 0 WHERE user_id = ?";
    db.query(updateMoneyQuery, [cost, player_id], (err, result) => {
        if (err) {
            console.error("Error al actualizar el dinero del jugador:", err);
            return res.status(500).json({ error: "Error al actualizar el dinero" });
        }

        const getNewMoneyQuery = "SELECT money FROM players WHERE user_id = ?";
        db.query(getNewMoneyQuery, [player_id], (err, results) => {
            if (err) {
                console.error("Error al obtener el nuevo saldo:", err);
                return res.status(500).json({ error: "Error en el servidor" });
            }

            const newMoney = results[0].money;
            res.json({ success: true, message: "Garaje comprado y empresa creada con éxito", newMoney });
        });
    });
}

module.exports = router;