document.addEventListener("DOMContentLoaded", async () => {
  const postId = new URLSearchParams(window.location.search).get("id"); // Get the ID from the URL

  try {
    // Fetch the blog post from the backend API
    const response = await fetch(`http://localhost:3000/api/blogs/${postId}`);

    if (!response.ok) {
      throw new Error("Post not found");
    }

    const post = await response.json();

    // Find the div where the post content will be displayed
    const div = document.getElementById("postContent");

    // Create the HTML content for the post
    div.innerHTML = `
        <h1>${post.title}</h1>
        <p>${post.content}</p>
        <p><strong>Category:</strong> ${post.category}</p>
        <img src="${post.coverImage}" alt="Cover Image for ${post.title}" />
      `;
  } catch (err) {
    alert(err.message); // Show error if the post isn't found
  }
});
