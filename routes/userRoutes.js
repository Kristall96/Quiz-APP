const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Load environment variables
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

console.log("JWT_SECRET:", jwtSecret);

async function userRoutes(req, res) {
  if (req.url === "/register" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { username, email, password, address, postcode, phone, role } =
          JSON.parse(body);

        if (!username || !email || !password) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "Username, email, and password are required!",
            })
          );
          return;
        }

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

        const hashedPassword = await bcrypt.hash(password, 10);
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

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "Account registered successfully!" })
        );
      } catch (error) {
        console.error("Error during registration:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "An unexpected error occurred. Please try again.",
          })
        );
      }
    });

    return true;
  }

  if (req.url === "/login" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { email, password } = JSON.parse(body);

        if (!email || !password) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ error: "Email and password are required!" })
          );
          return;
        }

        const user = await User.findOne({ email });

        if (!user) {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid email or password" }));
          return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid email or password" }));
          return;
        }

        const token = jwt.sign(
          { id: user._id, email: user.email, role: user.role },
          jwtSecret,
          { expiresIn: "1h" }
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Login successful", token }));
      } catch (error) {
        console.error("Error during login", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "An unexpected error occurred. Please try again.",
          })
        );
      }
    });

    return true;
  }

  return false;
}

module.exports = userRoutes;
