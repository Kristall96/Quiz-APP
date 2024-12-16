const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

function userRoutes(req, res) {
  // Register Functionality
  if (req.url === "/register" && req.method === "POST") {
    return parseRequestBody(req)
      .then((userData) => {
        const { username, email, password } = userData;

        if (!username || !email || !password) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "Username, email, and password are required!",
            })
          );
          return Promise.reject(); // Stop further execution
        }

        return User.findOne({ $or: [{ username }, { email }] }).then(
          (duplicate) => {
            if (duplicate) {
              const errorMessage =
                duplicate.username === username
                  ? "This username already exists."
                  : "This email already exists.";
              res.writeHead(409, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: errorMessage }));
              return Promise.reject(); // Stop further execution
            }

            return bcrypt.hash(password, 10);
          }
        );
      })
      .then((hashedPassword) => {
        const newUser = new User({
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          address: userData.address,
          postcode: userData.postcode,
          phone: userData.phone,
          role: userData.role || "user",
        });

        return newUser.save();
      })
      .then(() => {
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "Account registered successfully!" })
        );
      })
      .catch((error) => {
        console.error("Error during registration:", error.message);
        if (!res.writableEnded) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "An unexpected error occurred. Please try again.",
            })
          );
        }
      });
  }

  // Login Functionality
  if (req.url === "/login" && req.method === "POST") {
    return parseRequestBody(req)
      .then((loginData) => {
        const { email, password } = loginData;

        if (!email || !password) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ error: "Email and password are required!" })
          );
          return Promise.reject(); // Stop further execution
        }

        return User.findOne({ email });
      })
      .then((user) => {
        if (!user) {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid email or password" }));
          return Promise.reject(); // Stop further execution
        }

        return bcrypt
          .compare(loginData.password, user.password)
          .then((isMatch) => ({
            user,
            isMatch,
          }));
      })
      .then(({ user, isMatch }) => {
        if (!isMatch) {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid email or password" }));
          return Promise.reject(); // Stop further execution
        }

        const token = jwt.sign(
          { id: user._id, email: user.email, role: user.role },
          jwtSecret,
          { expiresIn: "1h" }
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Login successful", token }));
      })
      .catch((error) => {
        console.error("Error during login:", error.message);
        if (!res.writableEnded) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "An unexpected error occurred. Please try again.",
            })
          );
        }
      });
  }

  // Fallback for unhandled routes
  return false;
}

module.exports = userRoutes;
