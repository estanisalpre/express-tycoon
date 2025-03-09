const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");

// Select all players
router.get("/", (req, res) => {
  db.query("SELECT * FROM players", (err, result) => {
    if (err) {
      console.error("Error al obtener jugadores:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(result);
  });
});

// Register new user
router.post("/register", (req, res) => {
  const { user_name, user_email, user_password } = req.body;

  if (!user_name || !user_email || !user_password) {
    return res.status(400).json({ success: false, message: "Todos los campos son obligatorios." });
  }

  // Verificar si el correo ya está registrado
  const checkEmailQuery = "SELECT * FROM players WHERE user_email = ?";
  db.query(checkEmailQuery, [user_email], async (err, results) => {
    if (err) {
      console.error("Error al verificar el email:", err);
      return res.status(500).json({ success: false, message: "Error en el servidor." });
    }

    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "El email ya está registrado." });
    }

    // If email doesn't exists, register new user
    const hashedPassword = await bcrypt.hash(user_password, 10);
    const insertQuery = "INSERT INTO players (user_name, user_email, user_password) VALUES (?, ?, ?)";
    db.query(insertQuery, [user_name, user_email, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error al registrar usuario:", err);
        return res.status(500).json({ success: false, message: "Error al registrar el usuario." });
      }
      res.json({ success: true, message: "Usuario registrado con éxito!", userId: result.insertId });
    });
  });
});

// Login
router.post("/login", (req, res) => {
    const { user_email, user_password } = req.body;
  
    if (!user_email || !user_password) {
      return res.status(400).json({ error: "Correo y contraseña son requeridos" });
    }
  
    db.query("SELECT * FROM players WHERE user_email = ?", [user_email], async (err, results) => {
      if (err) {
        console.error("Error al buscar el usuario:", err);
        return res.status(500).json({ error: "Error al buscar el usuario" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      const user = results[0];
  
      // Comparar contraseñas usando bcrypt
      const isPasswordValid = await bcrypt.compare(user_password, user.user_password);
  
      if (!isPasswordValid) {
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