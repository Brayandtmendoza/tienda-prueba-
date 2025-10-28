// ========================================
// routes/comprobantes.js (corregido + CORS)
// ========================================
const express = require('express');
const router = express.Router();
const cors = require('cors');
const db = require('../db');
const verifyToken = require('./auth').verifyToken;


// Habilitar CORS solo para este router (opcional si ya lo tienes global)
router.use(cors());

// Registrar un comprobante
router.post('/', verifyToken, async (req, res) => {
  const { numero, monto, fecha } = req.body;

  if (!numero || !monto || !fecha) {
    return res.status(400).json({ mensaje: 'Faltan datos requeridos (numero, monto, fecha)' });
  }

  try {
    const [result] = await db.tienda.query(
      'INSERT INTO comprobantes (numero, monto, fecha) VALUES (?, ?, ?)',
      [numero, monto, fecha]
    );
    res.json({ mensaje: 'Comprobante registrado exitosamente', id: result.insertId });
  } catch (error) {
    console.error('Error al registrar comprobante:', error);
    res.status(500).json({ mensaje: 'Error en el servidor al registrar el comprobante' });
  }
});

// Obtener todos los comprobantes
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.tienda.query('SELECT * FROM comprobantes ORDER BY fecha DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener comprobantes:', error);
    res.status(500).json({ mensaje: 'Error en el servidor al obtener comprobantes' });
  }
});

// Obtener comprobante por ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.tienda.query('SELECT * FROM comprobantes WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ mensaje: 'Comprobante no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener comprobante:', error);
    res.status(500).json({ mensaje: 'Error en el servidor al obtener comprobante' });
  }
});

module.exports = router;
