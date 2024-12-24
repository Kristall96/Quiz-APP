// Register Form Submission
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("registerResponseMessage").innerText =
        data.message;
    } else {
      document.getElementById("registerResponseMessage").innerText =
        data.message || "An error occurred.";
    }
  } catch (error) {
    document.getElementById("registerResponseMessage").innerText =
      "Network error. Please try again.";
    console.error("Error:", error);
  }
});

// Login Form Submission
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("authToken", data.token); // Save token to localStorage
      document.getElementById("loginResponseMessage").innerText = data.message;
    } else {
      document.getElementById("loginResponseMessage").innerText =
        data.message || "An error occurred.";
    }
  } catch (error) {
    document.getElementById("loginResponseMessage").innerText =
      "Network error. Please try again.";
    console.error("Error:", error);
  }
});

// Logout Button Click
const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    document.getElementById("logoutResponseMessage").innerText =
      "You are not logged in.";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.removeItem("authToken"); // Clear token from localStorage
      document.getElementById("logoutResponseMessage").innerText = data.message;
    } else {
      document.getElementById("logoutResponseMessage").innerText =
        data.message || "An error occurred.";
    }
  } catch (error) {
    document.getElementById("logoutResponseMessage").innerText =
      "Network error. Please try again.";
    console.error("Error:", error);
  }
});
