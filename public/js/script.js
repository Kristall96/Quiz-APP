document.addEventListener("DOMContentLoaded", async () => {
  const leftAside = document.getElementById("leftAside");

  try {
    // Use the full backend URL
    const response = await fetch("http://localhost:3000/api/rank-users");
    if (!response.ok) {
      throw new Error("Failed to fetch ranked users");
    }

    const rankedUsers = await response.json();

    // Create a list of ranked users
    const rankedListHTML = rankedUsers
      .map(
        (user) =>
          `
        <li class="rank-item">
        <span class="username">${user.username}</span>
        <span class="dash">-</span>
        <span class="points">${user.points}</span>
      </li>`
      )
      .join("");

    // Insert the list into the leftAside div
    leftAside.innerHTML = `<ul id="rankingUl"><div id="rankingH3-container"><h3 id="rankingH3"> Leaderboard </h3></div>${rankedListHTML}</ul>`;
  } catch (err) {
    console.error(err.message);
    leftAside.textContent = "Failed to load rankings.";
  }
});

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const logoutButton = document.getElementById("logoutButton");

const registerResponseMessage = document.getElementById(
  "registerResponseMessage"
);
const loginResponseMessage = document.getElementById("loginResponseMessage");
const logoutResponseMessage = document.getElementById("logoutResponseMessage");

const loginSection = document.getElementById("loginSection");
const logoutSection = document.getElementById("logoutSection");

// Helper function to display/hide sections based on login state
function updateUIBasedOnAuth() {
  const token = localStorage.getItem("authToken");
  if (token) {
    loginSection.style.display = "none";
    logoutSection.style.display = "block";
  } else {
    loginSection.style.display = "block";
    logoutSection.style.display = "none";
  }
}

// Register User
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      registerResponseMessage.innerText = data.message;
    } else {
      registerResponseMessage.innerText = data.error || "Registration failed.";
    }
  } catch (error) {
    console.error("Registration Error:", error);
    registerResponseMessage.innerText = "Network error. Please try again.";
  }
});

// Login User
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("authToken", data.token); // Store the token in localStorage
      loginResponseMessage.innerText = "Login successful!";
      updateUIBasedOnAuth(); // Update the UI to reflect login state
    } else {
      loginResponseMessage.innerText = data.error || "Login failed.";
    }
  } catch (error) {
    console.error("Login Error:", error);
    loginResponseMessage.innerText = "Network error. Please try again.";
  }
});

// Logout User
logoutButton.addEventListener("click", () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    logoutResponseMessage.innerText = "You are not logged in.";
    return;
  }

  try {
    fetch("http://localhost:3000/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.ok) {
        localStorage.removeItem("authToken"); // Remove the token
        logoutResponseMessage.innerText = "Logout successful!";
        updateUIBasedOnAuth(); // Update the UI to reflect logout state
      } else {
        response.json().then((data) => {
          logoutResponseMessage.innerText = data.error || "Logout failed.";
        });
      }
    });
  } catch (error) {
    console.error("Logout Error:", error);
    logoutResponseMessage.innerText = "Network error. Please try again.";
  }
});

// Initialize UI on page load
updateUIBasedOnAuth();
