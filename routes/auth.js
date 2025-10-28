// ========================================
// routes/auth.js (versión final corregida)
// ========================================
const express = require('express');
const router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('../db');

const SECRET_KEY = 'acer@23';

// Habilitar CORS para este router
router.use(cors());

// Middleware para verificar token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).json({ mensaje: 'No se proporcionó un token' });

  const tokenWithoutBearer = token.split(' ')[1];
  jwt.verify(tokenWithoutBearer, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    req.user = decoded;
    next();
  });
};

// Login
router.post('/login', async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const [rows] = await db.tienda.query(
      'SELECT * FROM usuarios WHERE usuario = ? AND password = MD5(?)',
      [usuario, password]
    );

    if (rows.length > 0) {
      const user = rows[0];
      const token = jwt.sign(
        { id: user.id, usuario: user.usuario },
        SECRET_KEY,
        { expiresIn: '1h' }
      );
      res.json({ mensaje: 'Login exitoso', token });
    } else {
      res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ mensaje: 'Error en el servidor al iniciar sesión' });
  }
});

// Registro
router.post('/register', async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const [result] = await db.tienda.query(
      'INSERT INTO usuarios (usuario, password) VALUES (?, MD5(?))',
      [usuario, password]
    );
    res.status(201).json({ mensaje: 'Usuario registrado con éxito', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ mensaje: 'El nombre de usuario ya existe.' });
    }
    console.error('Error en registro:', err);
    res.status(500).json({ mensaje: 'Error en el servidor al registrar usuario' });
  }
});

// Comprobación de usuarios
router.get('/check-users', async (req, res) => {
  try {
    const [rows] = await db.tienda.query('SELECT COUNT(*) AS userCount FROM usuarios');
    const userCount = rows[0].userCount;
    res.json({ mensaje: `Usuarios registrados: ${userCount}` });
  } catch (err) {
    console.error('Error al comprobar usuarios:', err);
    res.status(500).json({ mensaje: 'Error al verificar usuarios' });
  }
});

// Exportar el router con verifyToken incluido
router.verifyToken = verifyToken;
module.exports = router;

