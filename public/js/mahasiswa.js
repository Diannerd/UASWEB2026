// 1. Keamanan: Cek apakah yang akses benar-benar dosen
const role = localStorage.getItem('role');
if (role !== 'dosen') {
    alert("Akses ditolak! Halaman ini hanya untuk Dosen.");
    window.location.href = '../index.html';
}

const tableBody = document.getElementById('studentTableBody');
const API_URL = 'http://192.168.56.106:3000/api/students';

// 2. Fungsi untuk mengambil data (Read)
async function loadMahasiswa() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Server merespon dengan status ${response.status}`);
        }

        // coba parse JSON, tapi jaga kalau server mengembalikan non-JSON
        let data;
        try {
            data = await response.json();
        } catch (parseErr) {
            console.error('Gagal parse JSON dari response:', parseErr);
            throw new Error('Response bukan JSON valid');
        }

        if (!tableBody) return;
        tableBody.innerHTML = '';

        // pastikan data adalah array
        if (!Array.isArray(data) || data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center p-4">Belum ada data mahasiswa</td></tr>`;
            return;
        }

        data.forEach(item => {
            tableBody.innerHTML += `
                <tr class="border-t">
                    <td class="p-4">${item.nim}</td>
                    <td class="p-4">${item.nama}</td>
                    <td class="p-4 text-center">${item.semester}</td>
                    <td class="p-4 text-center">${item.kelas || '-'}</td>
                    <td class="p-4 text-center">
                        <button onclick="hapusMahasiswa('${item.id}', '${item.nama}')" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error("Gagal memuat data:", err);
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center p-4">Gagal memuat data mahasiswa. Cek koneksi ke server.</td></tr>`;
        }
    }
}

// 3. Fungsi untuk menambah mahasiswa (Create)
const studentForm = document.getElementById('studentForm');
if (studentForm) {
    studentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("Mencoba mengirim data..."); // Debug log

        const payload = {
            nim: document.getElementById('nim').value,
            nama: document.getElementById('nama').value,
            semester: parseInt(document.getElementById('semester').value, 10), // Ubah ke angka
            kelas: document.getElementById('kelas').value,
            email: document.getElementById('email').value
        };

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Coba parse response JSON jika ada
            let result = null;
            try {
                result = await res.json();
            } catch (_) {
                // ignore parse error; result tetap null
            }

            if (res.ok) {
                alert("Mahasiswa berhasil ditambahkan!");
                studentForm.reset();
                const modal = document.getElementById('modalMahasiswa');
                if (modal) modal.style.display = 'none';
                loadMahasiswa();
            } else {
                // Memberitahu error spesifik dari server jika ada
                const errMsg = result?.error || result?.message || `Terjadi kesalahan server (status ${res.status})`;
                alert("Gagal: " + errMsg);
            }
        } catch (err) {
            console.error("Error submit:", err);
            alert("Koneksi gagal! Pastikan server.js sudah jalan di terminal.");
        }
    });
}

// 4. Fungsi untuk menghapus mahasiswa (Delete)
async function hapusMahasiswa(id, nama) {
    if (confirm(`Apakah Anda yakin ingin menghapus mahasiswa: ${nama}?`)) {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

            if (res.ok) {
                alert("Data berhasil dihapus");
                loadMahasiswa();
            } else {
                // coba ambil pesan error dari server bila ada
                let errData = null;
                try { errData = await res.json(); } catch (_) {}
                const msg = errData?.error || errData?.message || `Gagal (status ${res.status})`;
                alert("Gagal menghapus data. " + msg);
            }
        } catch (err) {
            console.error("Gagal menghapus:", err);
            alert("Gagal menghapus data. Periksa koneksi ke server.");
        }
    }
}

// Jalankan saat halaman siap
document.addEventListener('DOMContentLoaded', loadMahasiswa);