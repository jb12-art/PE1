//  Register, page 3
//  connects to index.html, page 1
// register.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#registerForm");
  const nameInput = document.querySelector("#nameRegistration");
  const email = document.querySelector("#emailRegistration");
  const password = document.querySelector("#passwordRegistration");
  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");
  const registerMessage = document.querySelector("#registerMessage");

  const API_URL = "https://v2.api.noroff.dev/auth/register";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let isValid = true;
    emailError.textContent = "";
    passwordError.textContent = "";
    registerMessage.textContent = "";

    // Validate name
    if (!nameInput.value.trim()) {
      registerMessage.textContent = "Name is required.";
      registerMessage.classList.add("error");
      isValid = false;
    } else if (/[^a-zA-Z0-9_]/.test(nameInput.value)) {
      registerMessage.textContent =
        "Name must only contain letters, numbers, or underscore (_).";
      registerMessage.classList.add("error");
      isValid = false;
    }

    // Validate email
    if (!email.value.trim()) {
      emailError.textContent = "Email is required.";
      isValid = false;
    } else if (!/^[\w-.]+@stud\.noroff\.no$/.test(email.value)) {
      emailError.textContent = "Email must be a valid stud.noroff.no address.";
      isValid = false;
    }

    // Validate password
    if (!password.value.trim()) {
      passwordError.textContent = "Password is required.";
      isValid = false;
    } else if (password.value.length < 8) {
      passwordError.textContent = "Password must be at least 8 characters.";
      isValid = false;
    }

    if (!isValid) return;

    // Build payload for POST request
    const payload = {
      name: nameInput.value.trim(),
      email: email.value.trim(),
      password: password.value.trim(),
    };

    try {
      registerMessage.textContent = "Registering...";
      registerMessage.className = "loading";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.status === 201) {
        registerMessage.textContent =
          "✅ Account created successfully! Redirecting to login...";
        registerMessage.className = "success";

        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        registerMessage.textContent =
          result.errors?.[0]?.message || "❌ Registration failed.";
        registerMessage.className = "error";
      }
    } catch (error) {
      console.error("Registration error:", error);
      registerMessage.textContent = "❌ Could not connect to server.";
      registerMessage.className = "error";
    }
  });
});
