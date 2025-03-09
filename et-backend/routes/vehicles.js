const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
    db.query("SELECT * FROM vehicles", (err, result) => {
        if (err) {
            console.error("Error al obtener vehículos:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }
        res.json(result);
    });
});

router.post("/buy", (req, res) => {
  const { player_id, veh_id, garage_id } = req.body;

  // Verificar que player_id y veh_id no sean null o undefined
  if (!player_id || !veh_id || !garage_id) {
      console.error("Error: player_id o veh_id no están definidos");
      return res.status(400).json({ error: "Datos de compra inválidos" });
  }

  // Obtener el precio del vehículo
  const getVehicleQuery = "SELECT veh_price FROM vehicles WHERE veh_id = ?";
  db.query(getVehicleQuery, [veh_id], (err, results) => {
      if (err) {
          console.error("Error al obtener el vehículo:", err);
          return res.status(500).json({ error: "Error en el servidor" });
      }

      if (results.length === 0) {
          console.error("Error: Vehículo no encontrado");
          return res.status(404).json({ error: "Vehículo no encontrado" });
      }

      const vehPrice = results[0].veh_price;

      // Verificar que el jugador tenga suficiente dinero
      const checkMoneyQuery = "SELECT money FROM players WHERE user_id = ?";
      db.query(checkMoneyQuery, [player_id], (err, results) => {
          if (err) {
              console.error("Error al verificar el dinero del jugador:", err);
              return res.status(500).json({ error: "Error en el servidor" });
          }

          const userMoney = results[0].money;
          if (userMoney < vehPrice) {
              console.error("Error: No tienes suficiente dinero");
              return res.status(400).json({ error: "No tienes suficiente dinero" });
          }

          // Restar el costo del vehículo al dinero del jugador
          const updateMoneyQuery = "UPDATE players SET money = money - ? WHERE user_id = ?";
          db.query(updateMoneyQuery, [vehPrice, player_id], (err, result) => {
              if (err) {
                  console.error("Error al actualizar el dinero del jugador:", err);
                  return res.status(500).json({ error: "Error al actualizar el dinero" });
              }

              // Agregar el vehículo al inventario del jugador
              const addVehicleQuery = "INSERT INTO trucks_inventory (user_id, veh_id, garage_id) VALUES (?, ?, ?)";
              db.query(addVehicleQuery, [player_id, veh_id, garage_id], (err, result) => {
                  if (err) {
                      console.error("Error al agregar el vehículo al inventario:", err);
                      return res.status(500).json({ error: "Error al agregar el vehículo" });
                  }

                  // Devolver el nuevo saldo del jugador
                  const getNewMoneyQuery = "SELECT money FROM players WHERE user_id = ?";
                  db.query(getNewMoneyQuery, [player_id], (err, results) => {
                      if (err) {
                          console.error("Error al obtener el nuevo saldo:", err);
                          return res.status(500).json({ error: "Error en el servidor" });
                      }

                      const newMoney = results[0].money;
                      res.json({ success: true, message: "Vehículo comprado con éxito", newMoney });
                  });
              });
          });
      });
  });
});

module.exports = router;
