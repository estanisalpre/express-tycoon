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
          deliveries: user.deliveries_made,
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
          deliveries: user.deliveries_made,
        });
      }
    });
});

// Save initial player city
router.post("/players/set-sede", (req, res) => {
    const { user_id, sede } = req.body;
  
    const query = "UPDATE players SET sede = ?, first_time = 0 WHERE user_id = ?";
    db.query(query, [sede, user_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Error al guardar la ciudad de inicio" });
      }
      res.json({ success: true, message: "Ciudad de inicio guardada correctamente." });
    });
});

router.post("/update-deliveries", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Falta userId" });
  }

  const getDeliveriesQuery = "SELECT deliveries_made FROM players WHERE user_id = ?";
  db.query(getDeliveriesQuery, [userId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ error: "Error al obtener las entregas realizadas" });
    }

    const currentDeliveries = parseInt(results[0].deliveries_made) || 0;
    const newDeliveries = currentDeliveries + 1;

    const updateDeliveriesQuery = "UPDATE players SET deliveries_made = ? WHERE user_id = ?";
    db.query(updateDeliveriesQuery, [newDeliveries, userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Error al actualizar las entregas" });
      }
      res.json({ success: true, message: "Entregas actualizadas correctamente", newDeliveries });
    });
  });
});

router.post("/update-balance", async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || amount === undefined) {
    return res.status(400).json({ success: false, message: "Datos inválidos." });
  }

  try {
    // Asegurarse de que amount sea un número
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber)) {
      return res.status(400).json({ success: false, message: "La cantidad debe ser un número válido." });
    }

    // Obtener el dinero actual del jugador y asegurarse de que es un número
    const [user] = await db.promise().query("SELECT money FROM players WHERE user_id = ?", [userId]);
    
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado." });
    }

    // Asegurarse de que el dinero actual del jugador es un número
    const currentMoney = parseFloat(user[0].money);
    if (isNaN(currentMoney)) {
      return res.status(500).json({ success: false, message: "Error al obtener el saldo del usuario." });
    }

    // Realizar la suma
    const newBalance = currentMoney + amountNumber;

    // Actualizar el saldo
    await db.promise().query("UPDATE players SET money = ? WHERE user_id = ?", [newBalance, userId]);

    res.json({ success: true, newBalance });
  } catch (error) {
    console.error("Error al actualizar saldo:", error);
    res.status(500).json({ success: false, message: "Error en el servidor." });
  }
});

module.exports = router;