const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET KHS mahasiswa
router.get('/:nim', async (req, res) => {
  const { nim } = req.params;

  try {
    const result = await db.query(`
      SELECT
        mk.kode_mk,
        mk.nama_mk,
        mk.sks,
        n.nilai,
        n.semester
      FROM nilai n
      JOIN mata_kuliah mk ON n.mk_id = mk.id
      WHERE n.nim = $1
      ORDER BY n.semester
    `, [nim]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil KHS' });
  }
});

module.exports = router;
