const mysql = require("mysql2");

// Configuración de la base de datos
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "express-tycoon"
});

// Conectar a MySQL
db.connect(err => {
    if (err) {
        console.error("❌ Error al conectar a MySQL:", err);
        return;
    }
    console.log("✅ Conectado a MySQL");
});

module.exports = db;
