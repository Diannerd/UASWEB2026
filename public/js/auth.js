/* ================================
   AUTH HELPERS — SICAD (ANTI-CORS VERSION)
   ================================ */

// Tetap gunakan 127.0.0.1 agar sinkron dengan Port Forwarding
const API_BASE = 'http://127.0.0.1:3000';

/**
 * LOGIN
 */
async function login(role, username, password, redirectUrl) {
  try {
    // 1. GUNAKAN URLSearchParams (Agar dianggap "Simple Request" oleh browser)
    const params = new URLSearchParams();
    params.append('email', username); // Backend mengharapkan field "email"
    params.append('password', password);

    // 2. FETCH dengan Content-Type: application/x-www-form-urlencoded
    const res = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      credentials: 'include', // WAJIB untuk mengirim/menerima session cookie
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
      body: params // Kirim params, bukan JSON.stringify
    });

    if (!res.ok) {
      let msg = 'Login gagal';
      try {
        const errData = await res.json();
        msg = errData.error || msg;
      } catch (_) {}
      alert(msg);
      return;
    }

    const data = await res.json();

    // Simpan info user di client
    localStorage.setItem('role', data.user.role);
    localStorage.setItem('user', data.user.nama);

    console.log('✅ LOGIN BERHASIL:', data.user);
    window.location.href = redirectUrl;

  } catch (err) {
    console.error('❌ ERROR LOGIN:', err);
    // Pesan ini muncul jika fetch gagal total (misal: server mati atau CORS memblokir)
    alert('Gagal terhubung ke server backend. Pastikan server.js sudah jalan dan Port Forwarding di VirtualBox aktif.');
  }
}

/**
 * LOGOUT
 */
async function logout() {
  try {
    await fetch(`${API_BASE}/api/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (err) {
    console.warn('Logout warning:', err);
  }

  localStorage.clear();
  window.location.href = '/';
}

/**
 * PROTECT PAGE BY ROLE
 */
function requireRole(role) {
  const currentRole = localStorage.getItem('role');

  if (!currentRole || currentRole !== role) {
    localStorage.clear();
    window.location.href = '/';
  }
}