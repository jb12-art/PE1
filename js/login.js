//  Login, page 4
//  connects to index.html, page 1
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");
  const email = document.querySelector("#emailLogin");
  const password = document.querySelector("#passwordLogin");
  const emailError = document.querySelector("#loginEmailError");
  const passwordError = document.querySelector("#loginPasswordError");
  const loginMessage = document.querySelector("#loginMessage");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    emailError.textContent = "";
    passwordError.textContent = "";
    loginMessage.textContent = "";

    const storedUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (!storedUser) {
      loginMessage.textContent = "No account found. Please register first.";
      return;
    }

    let isValid = true;

    if (!email.value.trim()) {
      emailError.textContent = "Email is required.";
      isValid = false;
    }

    if (!password.value.trim()) {
      passwordError.textContent = "Password is required.";
      isValid = false;
    }

    if (!isValid) return;

    if (
      email.value.trim() === storedUser.email &&
      password.value.trim() === storedUser.password
    ) {
      // Login success
      loginMessage.textContent = "Login successful, redirecting";
      loginMessage.style.color = "green";

      // Mark user as logged in
      localStorage.setItem("isLoggedIn", "true");

      // Rederecting to homepage after 1 second
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1000);
    } else {
      loginMessage.textContent = "Invalid email or password.";
      loginMessage.style.color = "red";
    }
  });
});
