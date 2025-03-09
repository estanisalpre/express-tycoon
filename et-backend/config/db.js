const mysql = require("mysql2");

// Config
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "express-tycoon"
});

// Connection test
db.connect(err => {
    if (err) {
        console.error("❌ Error al conectar a MySQL:", err);
        return;
    }
    console.log("✅ Conectado a MySQL");
});

module.exports = db;
