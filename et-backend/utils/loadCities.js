const fs = require('fs');
const csv = require('csv-parser');
const db = require("../config/db");

const loadCities = () => {
  const cities = [];

  fs.createReadStream('../data/worldcities.csv')
  .pipe(csv())
  .on('data', (row) => {
    console.log(row);  
    const cleanedRow = {
      city_name: row.city ? row.city.replace(/"/g, '') : '',
      country: row.country ? row.country.replace(/"/g, '') : '',
      latitude: row.lat ? row.lat.replace(/"/g, '') : '',
      longitude: row.lng ? row.lng.replace(/"/g, '') : ''
    };
    cities.push(cleanedRow);
  })
  .on('end', () => {
    cities.forEach((city) => {
      const { city_name, country, latitude, longitude } = city;
      if (city_name && country && latitude && longitude) {
        const query = 'INSERT INTO cities (city_name, country, latitude, longitude) VALUES (?, ?, ?, ?)';
        db.query(query, [city_name, country, latitude, longitude], (err, result) => {
          if (err) {
            console.error('Error al insertar ciudad:', err);
            return;
          }
          console.log('Ciudad insertada:', result);
        });
      } else {
        console.log('Datos incompletos para la ciudad:', city_name);
      }
    });
  });
};

loadCities();
