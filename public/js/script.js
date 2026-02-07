// 1. Fungsi Mengambil Data dengan Filter
console.log("JavaScript sudah terhubung!");
async function fetchData() {
    const search = document.getElementById('search-student')?.value || '';
    const subject = document.getElementById('subject-filter')?.value || 'All';
    const examType = document.getElementById('exam-filter')?.value || 'All';

    try {
        const response = await fetch(`http://localhost:3000/api/evaluations?search=${search}&subject=${subject}&examType=${examType}`);
        const data = await response.json();
        renderStudents(data);
    } catch (err) {
        console.error("Gagal mengambil data:", err);
    }
}

// 2. Fungsi Menampilkan Data ke HTML
function renderStudents(students) {
    const container = document.getElementById('student-list-container');
    container.innerHTML = ''; 

    students.forEach(s => {
        const card = `
            <div class="student-item" style="display: flex; justify-content: space-between; padding: 20px; border-bottom: 1px solid #eee;">
                <div>
                    <strong>${s.name}</strong><br>
                    <small>Semester ${s.semester}</small>
                </div>
                <div>${s.subject_name}</div>
                <div><strong>${s.marks_scored} / ${s.max_marks}</strong></div>
                <div>${s.exam_type}</div>
                <div>
                    <button onclick="openEditModal(${s.id}, ${s.marks_scored}, '${s.exam_type}')" style="color: #007bff; cursor: pointer; border: none; background: none;">Edit</button>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// 3. Logika Modal Edit
function openEditModal(id, marks, type) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-marks').value = marks;
    document.getElementById('edit-type').value = type;
    document.getElementById('editModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

async function saveChanges() {
    const id = document.getElementById('edit-id').value;
    const marks = document.getElementById('edit-marks').value;
    const type = document.getElementById('edit-type').value;

    const response = await fetch(`http://localhost:3000/api/evaluations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marks_scored: marks, exam_type: type })
    });

    if (response.ok) {
        closeModal();
        fetchData(); // Refresh tampilan tanpa reload halaman
    }
}

// Event Listeners untuk Search & Filter
document.getElementById('search-student')?.addEventListener('input', fetchData);
document.getElementById('subject-filter')?.addEventListener('change', fetchData);
document.getElementById('exam-filter')?.addEventListener('change', fetchData);

// Jalankan saat pertama kali halaman dibuka
fetchData();