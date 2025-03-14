/* const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    console.log("Token recibido en el backend:", token);  // Añade un log aquí

    if (!token) {
        console.log("No token provided");
        return res.status(403).json({ message: "Token no proporcionado" });
    }

    jwt.verify(token, "secreto123", (err, decoded) => {
        if (err) {
            console.log("Token inválido:", err);
            return res.status(401).json({ message: "Token inválido" });
        }

        req.user = decoded;  // Guardamos el ID y demás datos decodificados
        next();
    });
};


module.exports = verifyToken; */


