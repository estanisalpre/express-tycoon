const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Función para calcular distancia entre coordenadas (fórmula de Haversine)
const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const toRad = (value) => (value * Math.PI) / 180;
    
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en kilómetros
};

// Obtener rutas con coordenadas y cálculos
router.get("/", (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ error: "Falta el user_id" });
    }

    const query = `
        SELECT r.route_id, r.user_id, r.origin_city, r.destination_city, r.garage_id,
               o.city_name AS origin_city_name, o.latitude AS origin_lat, o.longitude AS origin_lon,
               d.city_name AS destination_city_name, d.latitude AS destination_lat, d.longitude AS destination_lon,
               r.km_distance, r.estimated_time
        FROM routes r
        JOIN cities o ON r.origin_city = o.city_id
        JOIN cities d ON r.destination_city = d.city_id
        WHERE r.user_id = ?;
    `;

    db.query(query, [user_id], (err, routes) => {
        if (err) {
            console.error("Error al obtener rutas:", err);
            return res.status(500).json({ success: false, message: "Error en el servidor" });
        }

        // Calcular distancia y tiempo estimado si no están en la BD
        const velocidadPromedio = 80; // km/h
        routes.forEach(route => {
            if (!route.km_distance || !route.estimated_time) {
                const distancia = calcularDistancia(
                    route.origin_lat, route.origin_lon,
                    route.destination_lat, route.destination_lon
                );

                const tiempoEstimado = distancia / velocidadPromedio; // en horas

                route.km_distance = distancia.toFixed(2);
                route.estimated_time = tiempoEstimado.toFixed(2);
            }
        });

        res.json({ success: true, routes });
    });
});

router.get("/:user_id", (req, res) => {
    const { user_id } = req.params; // Obtener el user_id de los parámetros de la URL

    if (!user_id) {
        return res.status(400).json({ error: "Falta el user_id" });
    }

    // Definir el precio estimado por kilómetro
    const precioPorKm = 5; // $5 por km

    const query = `
        SELECT r.route_id, r.user_id, r.origin_city, r.destination_city, r.garage_id,
               o.city_name AS origin_city_name, o.latitude AS origin_lat, o.longitude AS origin_lon,
               d.city_name AS destination_city_name, d.latitude AS destination_lat, d.longitude AS destination_lon,
               r.km_distance, r.estimated_time
        FROM routes r
        JOIN cities o ON r.origin_city = o.city_id
        JOIN cities d ON r.destination_city = d.city_id
        WHERE r.user_id = ?;
    `;

    db.query(query, [user_id], (err, routes) => {
        if (err) {
            console.error("Error al obtener rutas:", err);
            return res.status(500).json({ success: false, message: "Error en el servidor" });
        }

        if (routes.length === 0) {
            return res.status(404).json({ success: false, message: "No se encontraron rutas para este usuario" });
        }

        // Calcular distancia, tiempo estimado y precio
        const velocidadPromedio = 80; // km/h
        routes.forEach(route => {
            if (!route.km_distance || !route.estimated_time) {
                const distancia = calcularDistancia(
                    route.origin_lat, route.origin_lon,
                    route.destination_lat, route.destination_lon
                );

                const tiempoEstimado = distancia / velocidadPromedio; // en horas

                route.km_distance = distancia.toFixed(2);
                route.estimated_time = tiempoEstimado.toFixed(2);
            }

            // Calcular precio estimado
            const precioEstimado = (route.km_distance * precioPorKm).toFixed(2);
            route.price = precioEstimado;
        });

        res.json({ success: true, routes });
    });
});


// Crear nueva ruta con cálculos
router.post("/create", (req, res) => {
    const { user_id, origin_city, destination_city, garage_id } = req.body;

    if (!user_id || !origin_city || !destination_city || !garage_id) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Obtener coordenadas de las ciudades
    const queryCoords = `
        SELECT city_id, latitude, longitude FROM cities WHERE city_id IN (?, ?);
    `;

    db.query(queryCoords, [origin_city, destination_city], (err, results) => {
        if (err) {
            console.error("Error al obtener coordenadas:", err);
            return res.status(500).json({ success: false, message: "Error en el servidor" });
        }

        if (results.length < 2) {
            return res.status(400).json({ success: false, message: "No se encontraron ciudades válidas" });
        }

        const origin = results.find(city => city.city_id == origin_city);
        const destination = results.find(city => city.city_id == destination_city);

        if (!origin || !destination) {
            return res.status(400).json({ success: false, message: "Error en las ciudades seleccionadas" });
        }

        // Calcular distancia y tiempo
        const distancia = calcularDistancia(origin.latitude, origin.longitude, destination.latitude, destination.longitude);
        const velocidadPromedio = 80; // km/h
        const tiempoEstimado = distancia / velocidadPromedio; // en horas

        // Insertar ruta en la BD con los cálculos
        const insertQuery = `
            INSERT INTO routes (user_id, origin_city, destination_city, garage_id, km_distance, estimated_time)
            VALUES (?, ?, ?, ?, ?, ?);
        `;

        db.query(insertQuery, [user_id, origin_city, destination_city, garage_id, distancia.toFixed(2), tiempoEstimado.toFixed(2)], (err, result) => {
            if (err) {
                console.error("Error al crear la ruta:", err);
                return res.status(500).json({ success: false, message: "Error en el servidor" });
            }

            res.json({ success: true, message: "Ruta creada con éxito", route_id: result.insertId });
        });
    });
});

router.post("/update-speed", (req, res) => {
    const { route_id, speed } = req.body;

    if (!route_id || !speed) {
        return res.status(400).json({ error: "Faltan datos" });
    }

    // Obtener la distancia de la ruta
    const query = "SELECT km_distance FROM routes WHERE route_id = ?";
    db.query(query, [route_id], (err, results) => {
        if (err || results.length === 0) {
            console.error("Error al obtener la distancia:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }

        const distance = results[0].km_distance;
        const estimated_time = (distance / speed).toFixed(1);

        // Actualizar la ruta con la nueva velocidad y tiempo estimado
        const updateQuery = "UPDATE routes SET selected_speed = ?, estimated_time = ? WHERE route_id = ?";
        db.query(updateQuery, [speed, estimated_time, route_id], (err, result) => {
            if (err) {
                console.error("Error al actualizar la velocidad:", err);
                return res.status(500).json({ error: "Error en el servidor" });
            }

            res.json({ success: true, message: "Velocidad actualizada", estimated_time });
        });
    });
});

// Eliminar una ruta
router.delete("/delete/:route_id", (req, res) => {
    const { route_id } = req.params;

    if (!route_id) {
        return res.status(400).json({ success: false, message: "Falta el route_id" });
    }

    const deleteQuery = "DELETE FROM routes WHERE route_id = ?";
    
    db.query(deleteQuery, [route_id], (err, result) => {
        if (err) {
            console.error("Error al eliminar la ruta:", err);
            return res.status(500).json({ success: false, message: "Error en el servidor" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Ruta no encontrada" });
        }

        res.json({ success: true, message: "Ruta eliminada con éxito" });
    });
});

module.exports = router;



/* const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ error: "Falta el user_id" });
    }

    db.query("SELECT * FROM routes WHERE user_id = ?", [user_id], (err, routes) => {
        if (err) {
            console.error("Error al obtener rutas:", err);
            return res.status(500).json({ success: false, message: "Error en el servidor" });
        }

        if (routes.length === 0) {
            return res.json({ success: true, routes: [] });
        }

        res.json({ success: true, routes });
    });
});

// Crear una nueva ruta
router.post("/create", (req, res) => {
    const { user_id, origin_city, destination_city, garage_id } = req.body;

    if (!user_id || !origin_city || !destination_city || !garage_id) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const insertRouteQuery = `
        INSERT INTO routes (user_id, origin_city, destination_city, garage_id)
        VALUES (?, ?, ?, ?)
    `;

    db.query(insertRouteQuery, [user_id, origin_city, destination_city, garage_id], (err, result) => {
        if (err) {
            console.error("Error al crear la ruta:", err);
            return res.status(500).json({ success: false, message: "Error en el servidor" });
        }

        res.json({ success: true, message: "Ruta creada con éxito" });
    });
});

module.exports = router;
 */