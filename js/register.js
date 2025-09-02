//  Register, page 3
//  connects to index.html, page 1
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#registerForm");
  const email = document.querySelector("#emailRegistration");
  const password = document.querySelector("#passwordRegistration");
  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent reload until we validate & store

    let isValid = true;
    emailError.textContent = "";
    passwordError.textContent = "";

    // Validate email
    if (!email.value.trim()) {
      emailError.textContent = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
      emailError.textContent = "Enter a valid email address";
      isValid = false;
    }

    // Validate password
    if (!password.value.trim()) {
      passwordError.textContent = "Password is required.";
      isValid = false;
    } else if (password.value.length < 4) {
      passwordError.textContent = "Password must be at least 4 characters.";
      isValid = false;
    }

    if (!isValid) return;

    // save to localStorage
    const user = {
      email: email.value.trim(),
      password: password.value.trim(), // (In real apps, never store plain text)
    };

    localStorage.setItem("registeredUser", JSON.stringify(user));

    alert("Account created successfully, you can now login.");

    // clear form
    form.reset();
  });
});
