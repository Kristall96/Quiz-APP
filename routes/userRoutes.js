const User = require("../models/User");
const bcrypt = require("bcrypt");

async function userRoutes(req, res) {
  if (req.url === "/register" && req.method === "POST") {
    let body = "";

    // Collect request body
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { username, email, password, address, postcode, phone, role } =
          JSON.parse(body);

        // Validate required fields
        if (!username || !email || !password) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "Username, email, and password are required!",
            })
          );
          return;
        }

        // Check for duplicates
        const duplicate = await User.findOne({
          $or: [{ username }, { email }],
        });

        if (duplicate) {
          const errorMessage =
            duplicate.username === username
              ? "This username already exists."
              : "This email already exists.";

          res.writeHead(409, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: errorMessage }));
          return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to the database
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
          address,
          postcode,
          phone,
          role: role || "user",
        });

        await newUser.save();

        // Respond with success
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "Account registered successfully!" })
        );
      } catch (error) {
        // Handle unexpected errors
        console.error("Error during registration:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "An unexpected error occurred. Please try again.",
          })
        );
      }
    });

    return true; // Indicate the route was handled
  }

  return false; // Indicate the route was not handled
}

module.exports = userRoutes;
