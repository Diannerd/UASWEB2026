const express = require('express');
const router = express.Router();
const pool = require('../db'); // koneksi pg

// ambil semua matkul
router.get('/', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM mata_kuliah ORDER BY id DESC'
  );
  res.json(result.rows);
});

// tambah matkul
router.post('/', async (req, res) => {
  const { kode_matkul, nama_matkul, sks, semester } = req.body;

  await pool.query(
    `INSERT INTO mata_kuliah (kode_matkul, nama_matkul, sks, semester)
     VALUES ($1, $2, $3, $4)`,
    [kode_matkul, nama_matkul, sks, semester]
  );

  res.json({ message: 'Matkul berhasil ditambahkan' });
});

// hapus matkul
router.delete('/:id', async (req, res) => {
  await pool.query(
    'DELETE FROM mata_kuliah WHERE id = $1',
    [req.params.id]
  );
  res.json({ message: 'Matkul dihapus' });
});

module.exports = router;
