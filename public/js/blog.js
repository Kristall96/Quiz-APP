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
      ul.className = "post";
      ul.innerHTML = `
        <li class="post-title">${post.title}</li>
        <li class="post-image">
          <a href="singlePost.html?id=${post._id}">
            <img src="${post.coverImage}" alt="Cover Image for ${post.title}">
          </a>
        </li>
        <li class="post-category">${post.category}</li>
      `;
      div.appendChild(ul);
    });
  } catch (err) {
    alert(err.message);
  }
});
