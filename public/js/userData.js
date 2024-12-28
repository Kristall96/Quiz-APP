document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken"); // Get token from storage
  if (!token) {
    alert("You need to log in first!");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/get-all-users", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch users");
    }

    const users = await response.json();
    const usersTable = document.getElementById("users-table");

    users.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user._id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          <button onclick="updateRole('${user._id}')">Update Role</button>
          <button onclick="deleteUser('${user._id}')">Delete</button>
        </td>
      `;
      usersTable.appendChild(row);
    });
  } catch (err) {
    alert(err.message);
  }
});

async function updateRole(userId) {
  const newRole = prompt("Enter the new role (e.g., admin, user):");
  if (!newRole) return;

  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch("http://localhost:3000/update-role", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, newRole }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update role");
    }

    alert("Role updated successfully!");
    location.reload();
  } catch (err) {
    alert(err.message);
  }
}

async function deleteUser(userId) {
  const confirmDelete = confirm("Are you sure you want to delete this user?");
  if (!confirmDelete) return;

  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch("http://localhost:3000/delete-user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete user");
    }

    alert("User deleted successfully!");
    location.reload();
  } catch (err) {
    alert(err.message);
  }
}
