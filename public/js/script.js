const form = document.getElementById("registerForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent form from refreshing the page

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Display success message
      document.getElementById("responseMessage").innerText = data.message;
    } else {
      // Handle error response and display the error message
      document.getElementById("responseMessage").innerText =
        data.message || "An unexpected error occurred.";
    }
  } catch (error) {
    // Catch and display network or other errors
    document.getElementById("responseMessage").innerText =
      "An error occurred. Please try again.";
    console.error("Error:", error);
  }
});
