document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Email dan password harus diisi!");
    return;
  }

  try {
    const res = await fetch("https://api-todo-list-pbw.vercel.app/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log("Login response:", data);

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.data._id);
      localStorage.setItem("userEmail", data.data.email);
      localStorage.setItem("userName", data.data.fullName);
      localStorage.setItem("isLoggedIn", "true");

      alert("Login berhasil!");
      window.location.href = "index.html";
    } else {
      alert(data.message || "Email atau password salah.");
    }

  } catch (error) {
    alert("Terjadi kesalahan: " + error.message);
  }
});
