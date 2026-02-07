const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'sicad_user',
  password: '1212',
  database: 'sicad_db',
  port: 5432,
});

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('DB TERHUBUNG ✅', res.rows[0]);
  } catch (err) {
    console.error('DB ERROR ❌');
    console.error(err); // ⬅️ PENTING
  }
})();
