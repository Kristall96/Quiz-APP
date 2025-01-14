document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:3000/api/blogs", {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch blog post");
    }

    const posts = await response.json();
    const div = document.getElementById("mainContent");
    posts.forEach((post) => {
      const ul = document.createElement("ul");
      ul.innerHTML = `
        <li>${post.title}</li>
        <li>${post.content}</li>
        <li>${post.category}</li>
      `;
      div.appendChild(ul);
    });
  } catch (err) {
    alert(err.message);
  }
});
