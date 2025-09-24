// login.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");
  const email = document.querySelector("#emailLogin");
  const password = document.querySelector("#passwordLogin");
  const emailError = document.querySelector("#loginEmailError");
  const passwordError = document.querySelector("#loginPasswordError");
  const loginMessage = document.querySelector("#loginMessage");

  const API_URL = "https://v2.api.noroff.dev/auth/login";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // --- RESET ERRORS --- //
    emailError.textContent = "";
    passwordError.textContent = "";
    loginMessage.textContent = "";
    loginMessage.className = "";

    let isValid = true;

    // --- VALIDATION --- //
    if (!email.value.trim()) {
      emailError.textContent = "Email is required.";
      isValid = false;
    } else if (!/^[\w-.]+@stud\.noroff\.no$/.test(email.value.trim())) {
      emailError.textContent = "Email must be a valid stud.noroff.no address.";
      isValid = false;
    }

    if (!password.value.trim()) {
      passwordError.textContent = "Password is required.";
      isValid = false;
    }

    if (!isValid) return;

    // --- REQUEST PAYLOAD --- //
    const payload = {
      email: email.value.trim(),
      password: password.value.trim(),
    };

    try {
      loginMessage.textContent = "Logging in...";
      loginMessage.className = "loading";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result?.data) {
        throw new Error(
          result.errors?.[0]?.message || "Invalid login attempt."
        );
      }

      // --- CLEAR OLD SESSION DATA --- //
      localStorage.removeItem("cart");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      // --- SAVE NEW SESSION --- //
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("user", JSON.stringify(result.data));

      loginMessage.textContent = "✅Login successful! Redirecting...";
      loginMessage.className = "success";

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1200);
    } catch (error) {
      console.error("Login error:", error);
      loginMessage.textContent = `❌ ${error.message || "Could not connect."}`;
      loginMessage.className = "error";
    }
  });
});
