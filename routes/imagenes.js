// ========================================
// routes/imagenes.js (con CORS)
// ========================================
const express = require('express');
const router = express.Router();
const cors = require('cors');
const db = require('../db');
const verifyToken = require('./auth').verifyToken;


// Habilitar CORS
router.use(cors());

// Obtener todas las imágenes de un producto
router.get('/:producto_id', async (req, res) => {
  const { producto_id } = req.params;
  try {
    const [rows] = await db.tienda.query(
      'SELECT url FROM imagenes_productos WHERE producto_id = ?',
      [producto_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agregar imagen (JWT requerido)
router.post('/', verifyToken, async (req, res) => {
  const { url, producto_id } = req.body;
  try {
    const [result] = await db.tienda.query(
      'INSERT INTO imagenes_productos (url, producto_id) VALUES (?, ?)',
      [url, producto_id]
    );
    res.json({ id: result.insertId, url, producto_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
