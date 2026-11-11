
import { Router } from 'express';

import { createRating, getRatingsSummary } from '../controllers/rating.controller.js';

const router = Router();

// /api/ratings
// /api/ratings/sumary

// http://localhost:3000/api/db-test

// Registrar una calificación
router.post('/', createRating);
// http://localhost:3000/api/ratings

// Consultar resumen de calificaciones
router.get('/summary', getRatingsSummary);
// http://localhost:3000/api/ratings/summary

export default router;
