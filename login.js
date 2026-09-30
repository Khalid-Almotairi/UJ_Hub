// login.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("login.js loaded");

  // If already logged in, go to Home
  const savedId = localStorage.getItem("CURRENT_STUDENT_ID");
  if (savedId) {
    window.location.href = "index.html";
    return;
  }

  const loginCard = document.getElementById("loginCard");
  const registerCard = document.getElementById("registerCard");
  const showRegisterBtn = document.getElementById("showRegisterBtn");
  const backToLoginBtn = document.getElementById("backToLoginBtn");

  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");

  const registerForm = document.getElementById("registerForm");
  const registerError = document.getElementById("registerError");
  const registerSuccess = document.getElementById("registerSuccess");

 // التبديل 
  // ===== Toggle Register Card =====
  if (showRegisterBtn && loginCard && registerCard) {
    showRegisterBtn.addEventListener("click", () => {
      registerCard.classList.remove("d-none");
      loginCard.classList.add("d-none");
      registerCard.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (backToLoginBtn && loginCard && registerCard) {
    backToLoginBtn.addEventListener("click", () => {
      registerCard.classList.add("d-none");
      loginCard.classList.remove("d-none");
      loginCard.scrollIntoView({ behavior: "smooth" });
    });
  }

  // ===== LOGIN =====
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      loginError.innerText = "";

      const studentId = document.getElementById("loginStudentId").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      if (!studentId || !password) {
        loginError.innerText = "Please enter both student ID and password.";
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId, password })
        });

        if (!res.ok) {
          const text = await res.text();
          loginError.innerText = text || "Login failed.";
          return;
        }

        let data = {};
        //تحويل لجيسون
        try {
          data = await res.json();
        } catch (err) {
          console.warn("Login: response not JSON, using typed ID");
        }
        //نحفظ SID
        const sid = data.studentId || studentId;
        localStorage.setItem("CURRENT_STUDENT_ID", sid);

        window.location.href = "index.html";
      } catch (err) {
        console.error(err);
        loginError.innerText = "Server error. Please try again.";
      }
    });
  }

  // ===== REGISTER =====
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      registerError.innerText = "";
      registerSuccess.innerText = "";

      const studentId = document.getElementById("regStudentId").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const password = document.getElementById("regPassword").value.trim();
      const passwordConfirm = document.getElementById("regPasswordConfirm").value.trim();

      if (!studentId || !email || !password || !passwordConfirm) {
        registerError.innerText = "Please fill in all fields.";
        return;
      }

      if (!email.includes("@")) {
        registerError.innerText = "Please enter a valid email.";
        return;
      }

      if (password.length < 6) {
        registerError.innerText = "Password should be at least 6 characters.";
        return;
      }

      if (password !== passwordConfirm) {
        registerError.innerText = "Passwords do not match.";
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId, email, password })
        });

        if (!res.ok) {
          const text = await res.text();
          registerError.innerText = text || "Registration failed.";
          return;
        }

        localStorage.setItem("CURRENT_STUDENT_ID", studentId);
        registerSuccess.innerText = "Account created! Redirecting…";

        window.location.href = "index.html";
      } catch (err) {
        console.error(err);
        registerError.innerText = "Server error. Please try again.";
      }
    });
  }
});
