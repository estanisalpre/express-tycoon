const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", (req, res) => {
  const { user_name, user_email, user_password } = req.body;

  if (!user_name || !user_email || !user_password) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  const query = "INSERT INTO players (user_name, user_email, user_password) VALUES (?, ?, ?)";
  db.query(query, [user_name, user_email, user_password], (err, results) => {
    if (err) {
      console.error("Error al registrar el usuario:", err);
      return res.status(500).json({ error: "Error al registrar el usuario" });
    }

    res.json({
      success: true,
      message: "Usuario registrado con éxito",
    });
  });
});

module.exports = router;

