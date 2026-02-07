const { Pool } = require('pg');

const pool = new Pool({
  user: 'sicad_user',
  host: 'localhost',
  database: 'sicad_db',
  password: '1212',
  port: 5432,
});

module.exports = pool;
