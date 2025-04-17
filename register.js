document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');
  
    if (!form) {
      console.error("Form register tidak ditemukan di halaman.");
      return;
    }
  
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
  
      const fullName = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
  
      if (!fullName || !email || !password) {
        alert("Semua field wajib diisi!");
        return;
      }
  
      try {
        const res = await fetch('https://api-todo-list-pbw.vercel.app/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fullName, email, password })
        });
  
        const data = await res.json();
        console.log("Response register:", data);
  
        if (res.ok) {
          alert('Registrasi berhasil! Silakan login.');
          window.location.href = 'login.html';
        } else {
          alert(data.message || 'Registrasi gagal!');
        }
  
      } catch (error) {
        alert('Terjadi kesalahan jaringan: ' + error.message);
      }
    });
  });
  