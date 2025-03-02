require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Importar rutas
const playersRoutes = require("./routes/players");
const trucksRoutes = require("./routes/trucks");
const vehiclesRoutes = require("./routes/vehicles");
const cities = require("./routes/cities");

// Usar las rutas en la API
app.use("/players", playersRoutes);
app.use("/trucks", trucksRoutes);
app.use("/vehicles", vehiclesRoutes);
app.use("/cities", cities);

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("¡Servidor Express Tycoon funcionando! 🚀");
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
