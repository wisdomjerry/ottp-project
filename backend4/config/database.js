const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'feyth&100%',
  database: process.env.DB_NAME || 'auth_system'
});

db.connect((err) => {
  if (err) console.error('DB connection failed:', err);
  else console.log('Connected to DB with id:', db.threadId);
});

module.exports = db;
