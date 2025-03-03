const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", (req, res) => {
  const { user_email, user_password } = req.body;

  if (!user_email || !user_password) {
    return res.status(400).json({ error: "Correo y contraseña son requeridos" });
  }

  db.query("SELECT * FROM players WHERE user_email = ?", [user_email], (err, results) => {
    if (err) {
      console.error("Error al buscar el usuario:", err);
      return res.status(500).json({ error: "Error al buscar el usuario" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = results[0];

    if (user_password !== user.user_password) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const isFirstTime = user.first_time === 1;

    if (isFirstTime) {
      return res.json({
        first_time: 1, 
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        money: user.money,
        level: user.level,
        experience: user.experience,
      });
    } else {
      return res.json({
        first_time: 0, 
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        money: user.money,
        level: user.level,
        experience: user.experience,
      });
    }
  });
});

module.exports = router;

