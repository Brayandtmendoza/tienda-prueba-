// db.js
const mysql = require('mysql2/promise');

const tiendaPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tienda'
});

module.exports = {
  tienda: tiendaPool,
};