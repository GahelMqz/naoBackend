
import pool from '../config/database.js';

// Registrar una nueva calificación
export const createRating = async (req, res) => {

    try {

        // Obtener el score enviado por el frontend
        const { score } = req.body;

        // Validar que sea un número entero entre 1 y 5
        if (!Number.isInteger(score) || score < 1 || score > 5) {
            return res.status(400).json({
                message: 'La calificación debe ser un número entero entre 1 y 5'
            });
        }

        // Insertar el registro en MySQL
        const [result] = await pool.query(
            'INSERT INTO rating (score) VALUES (?)',
            [score]
        );

        // Enviar respuesta al frontend
        res.status(201).json({
            message: 'Calificación registrada correctamente',
            data: {
                id_rating: result.insertId,
                score: score
            }
        });

    } catch (error) {

        console.error('Error al registrar calificación:', error);

        res.status(500).json({
            message: 'Error interno al registrar la calificación'
        });

    }

};

// Consultar el total de calificaciones agrupadas
export const getRatingsSummary = async (req, res) => {

    try {

        // Consultar las calificaciones en MySQL
        const [rows] = await pool.query(`
            SELECT
                score,
                COUNT(*) AS total
            FROM rating
            GROUP BY score
            ORDER BY score ASC
        `);

        // Crear una lista con las 5 calificaciones
        const ratings = [1, 2, 3, 4, 5].map(score => {

            // Buscar si existe esa calificación
            const rating = rows.find(
                row => row.score === score
            );

            return {
                score: score,
                total: rating ? Number(rating.total) : 0
            };

        });

        // Calcular el total de registros
        const totalRatings = ratings.reduce(
            (total, rating) => total + rating.total,
            0
        );

        // Enviar respuesta
        res.status(200).json({
            message: 'Calificaciones consultadas correctamente',
            totalRatings,
            ratings
        });

    } catch (error) {

        console.error('Error al consultar calificaciones:', error);

        res.status(500).json({
            message: 'Error al consultar las calificaciones'
        });

    }

};
