require("dotenv").config();
const express = require("express");
const cors = require("cors");

const corsOptions = {
    origin: 'http://localhost:3000', // Frontend port
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
};
  
const app = express();
app.use(express.json());
app.use(cors(corsOptions));

// Import routes
const playersRoutes = require("./routes/players");
const trucksRoutes = require("./routes/trucks");
const vehiclesRoutes = require("./routes/vehicles");
const citiesRoutes = require("./routes/cities");
//const registerRoute = require("./routes/register")
//const loginRoute = require("./routes/login")
const userRoute = require("./routes/user")

// API Routes
app.use("/players", playersRoutes);
app.use("/trucks", trucksRoutes);
app.use("/vehicles", vehiclesRoutes);
app.use("/cities", citiesRoutes);
//app.use("/register", registerRoute);
//app.use("/login", loginRoute);
app.use("/user", userRoute);

// Test route
app.get("/", (req, res) => {
    res.send("¡Servidor Express Tycoon funcionando! 🚀");
});

// Running server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
