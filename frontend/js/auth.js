// handles login and registration forms

document.addEventListener("DOMContentLoaded", () => {
  // if already logged in, go to dashboard
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "/dashboard.html";
    return;
  }

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");
  const loginBox = document.getElementById("login-box");
  const registerBox = document.getElementById("register-box");
  const messageEl = document.getElementById("message");

  // toggle between login and register views
  showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginBox.classList.add("hidden");
    registerBox.classList.remove("hidden");
    clearMessage();
  });

  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerBox.classList.add("hidden");
    loginBox.classList.remove("hidden");
    clearMessage();
  });

  // login submit
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMessage();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        showMessage("Login successful! Redirecting...", "success");
        setTimeout(() => (window.location.href = "/dashboard.html"), 800);
      } else {
        showMessage(data.message || "Login failed", "error");
      }
    } catch (err) {
      showMessage("Network error — is the server running?", "error");
    }
  });

  // register submit
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMessage();

    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;

    if (password.length < 6) {
      showMessage("Password must be at least 6 characters", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        showMessage("Account created! Redirecting...", "success");
        setTimeout(() => (window.location.href = "/dashboard.html"), 800);
      } else {
        // handle validation errors array
        if (data.errors) {
          const msgs = data.errors.map((e) => e.message).join(", ");
          showMessage(msgs, "error");
        } else {
          showMessage(data.message || "Registration failed", "error");
        }
      }
    } catch (err) {
      showMessage("Network error — is the server running?", "error");
    }
  });

  function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.classList.remove("hidden");
  }

  function clearMessage() {
    messageEl.textContent = "";
    messageEl.className = "message hidden";
  }
});
