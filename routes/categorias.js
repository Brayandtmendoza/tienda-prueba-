// ========================================
// routes/categorias.js (con CORS)
// ========================================
const express = require('express');
const router = express.Router();
const cors = require('cors');
const db = require('../db');
const verifyToken = require('./auth').verifyToken;


// Habilitar CORS para este router (por seguridad y compatibilidad)
router.use(cors());

// ------------------------------------
// Obtener todas las categorías (Público)
// ------------------------------------
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.tienda.query('SELECT * FROM categorias');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener categorías:', err);
    res.status(500).json({ mensaje: 'Error al obtener categorías' });
  }
});

// ------------------------------------
// Crear una nueva categoría (Protegido por JWT)
// ------------------------------------
router.post('/', verifyToken, async (req, res) => {
  const { nombre } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ mensaje: 'El nombre de la categoría es obligatorio' });
  }

  try {
    const [result] = await db.tienda.query(
      'INSERT INTO categorias (nombre) VALUES (?)',
      [nombre.trim()]
    );
    res.status(201).json({ id: result.insertId, nombre });
  } catch (err) {
    console.error('Error al crear categoría:', err);
    res.status(500).json({ mensaje: 'Error al crear la categoría' });
  }
});

// ------------------------------------
// Actualizar una categoría (Protegido por JWT)
// ------------------------------------
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ mensaje: 'El nombre de la categoría es obligatorio' });
  }

  try {
    const [result] = await db.tienda.query(
      'UPDATE categorias SET nombre = ? WHERE id = ?',
      [nombre.trim(), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    res.json({ mensaje: 'Categoría actualizada con éxito', id, nombre });
  } catch (err) {
    console.error('Error al actualizar categoría:', err);
    res.status(500).json({ mensaje: 'Error al actualizar la categoría' });
  }
});

// ------------------------------------
// Eliminar una categoría (Protegido por JWT)
// ------------------------------------
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.tienda.query('DELETE FROM categorias WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    res.json({ mensaje: 'Categoría eliminada con éxito', id });
  } catch (err) {
    console.error('Error al eliminar categoría:', err);
    res.status(500).json({ mensaje: 'Error al eliminar la categoría' });
  }
});

module.exports = router;
