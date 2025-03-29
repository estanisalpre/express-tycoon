//require("dotenv").config();
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const axios = require('axios');

//const API_KEY = process.env.OPENWEATHER_API_KEY;

router.get("/", (req, res) => {
    db.query("SELECT * FROM cities", (err, result) => {
        if (err) {
            console.error("Error al obtener ciudades:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }
        res.json(result);
    });
});

router.get('/weather/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const apiKey = '3b077a6e2d2c5886ad6c77518d4e98a0';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        
        const response = await axios.get(url);
        const data = response.data;

        res.json({
            city: data.name,
            temperature: data.main.temp,
            weather: data.weather[0].description
        });
    } catch (error) {
        console.error('Error obteniendo el clima:', error);
        res.status(500).json({ error: 'No se pudo obtener el clima' });
    }
});

module.exports = router;
