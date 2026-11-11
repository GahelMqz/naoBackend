
// 1. Importamos Express
import express from 'express';
import cors from 'cors';

import pool from './config/database.js';
import ratingRoutes from './routes/rating.routes.js'

// 2. Creamos nuestra aplicación
const app = express();

// 3. Definimos el puerto
const PORT = process.env.PORT || 3000;

// Middlewares
// app.use(cors({
//     origin: 'http://localhost:5173'
// }));
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins
}));

app.use(express.json());


// 4. Creamos nuestra primera ruta
app.get('/', (req, res) => {
    res.json({
        message: '¡Nuestro servidor está funcionando!'
    });
});



// Ruta para probar la conexión con MySQL
app.get('/api/db-test', async (req, res) => {

    try {

        const [rows] = await pool.query(
            'SELECT DATABASE() AS database_name'
        );

        res.json({
            message: 'Conexión con MySQL exitosa',
            database: rows[0].database_name
        });

    } catch (error) {

        console.error('Error de conexión:', error);

        res.status(500).json({
            message: 'Error al conectar con MySQL'
        });

    }

});

// Rutas de calificaciones
app.use('/api/ratings', ratingRoutes);

// 5. Encendemos el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
