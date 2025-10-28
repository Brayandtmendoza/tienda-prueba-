// ========================================
// index.js con Swagger completamente integrado + CORS global + rutas funcionales
// ========================================

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Swagger dependencias
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = 3000;

// ------------------------------------
// 1. Middlewares
// ------------------------------------

// 🔹 CORS global configurado para permitir JWT y todas las rutas
const corsOptions = {
  origin: '*', // o restringe a ['http://localhost:5500'] si quieres más seguridad
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// 🔹 Body parser para recibir JSON
app.use(bodyParser.json());

// 🔹 Servir los archivos estáticos del Front-end
app.use(express.static(path.join(__dirname, 'Front-end')));

// ------------------------------------
// 2. Configuración Swagger
// ------------------------------------
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Tienda - Proyecto Integración 07',
      version: '1.0.0',
      description:
        'Documentación generada con Swagger para la API Node.js + Express + MySQL del Proyecto de Integración 07',
      contact: {
        name: 'Autor del Proyecto',
        email: 'tu.correo@ejemplo.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor local',
      },
    ],
    // 🔒 Soporte de autenticación JWT
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // 🔹 Archivos donde buscar los comentarios Swagger
  apis: [
    path.join(__dirname, 'index.js'),
    path.join(__dirname, 'routes', '*.js'),
  ],
};

// Inicializa Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ------------------------------------
// 3. Importa y registra las rutas de la API
// ------------------------------------

// 🔹 Importar rutas correctamente (auth ya exporta el router con verifyToken incluido)
const authRoutes = require('./routes/auth');
const categoriasRoutes = require('./routes/categorias');
const productosRoutes = require('./routes/productos');
const imagenesRoutes = require('./routes/imagenes');
const comprobantesRoutes = require('./routes/comprobantes');

// 🔹 Asociar prefijos de rutas
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/imagenes', imagenesRoutes);
app.use('/api/comprobantes', comprobantesRoutes);

// ------------------------------------
// 4. Endpoint raíz para prueba
// ------------------------------------
/**
 * @swagger
 * /:
 *   get:
 *     summary: Verifica que la API está funcionando
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 */
app.get('/', (req, res) => {
  res.send('✅ API Tienda funcionando correctamente con CORS y JWT habilitados');
});

// ------------------------------------
// 5. Inicia el servidor
// ------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📘 Documentación Swagger: http://localhost:${PORT}/api-docs`);
});
