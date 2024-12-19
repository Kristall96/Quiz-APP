const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// Helper function to parse JSON request body
// resolved naming issue on the helper function
const parseRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject("Invalid JSON");
      }
    });
  });
};

const authHandler = (req, res) => {
  res.setHeader("Content-Type", "application/json");

  // REGISTER
  if (req.url === "/register" && req.method === "POST") {
    let username, email, password; // Declare variables at the top to make them accessible

    parseRequestBody(req)
      .then((body) => {
        // Destructure variables from the parsed body
        ({ username, email, password } = body);

        if (!username || !email || !password) {
          return Promise.reject({
            status: 400,
            message: "All fields are required",
          });
        }

        // Check for existing user
        return User.findOne({ $or: [{ username }, { email }] });
      })
      .then((existingUser) => {
        if (existingUser) {
          return Promise.reject({
            status: 400,
            message: "Username or Email already exists",
          });
        }

        // Hash the password
        return bcrypt.hash(password, 10);
      })
      .then((hashedPassword) => {
        // Use the variables stored earlier
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
        });
        return newUser.save();
      })
      .then(() => {
        res.writeHead(201);
        res.end(JSON.stringify({ message: "User registered successfully" }));
      })
      .catch((err) => {
        if (!res.writableEnded) {
          res.writeHead(err.status || 500);
          res.end(
            JSON.stringify({ error: err.message || "Internal Server Error" })
          );
        }
      });
  }

  // LOGIN
  else if (req.url === "/login" && req.method === "POST") {
    parseRequestBody(req)
      .then(({ email, password }) => {
        if (!email || !password) {
          return Promise.reject({
            status: 400,
            message: "All fields are required",
          });
        }

        // Find user
        return User.findOne({ email }).then((user) => {
          if (!user) {
            return Promise.reject({
              status: 400,
              message: "Invalid credentials",
            });
          }
          return bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) {
              return Promise.reject({
                status: 400,
                message: "Invalid credentials",
              });
            }
            return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "1h",
            });
          });
        });
      })
      .then((token) => {
        res.writeHead(200);
        res.end(JSON.stringify({ message: "Login successful", token }));
      })
      .catch((err) => {
        if (!res.writableEnded) {
          res.writeHead(err.status || 500);
          res.end(
            JSON.stringify({ error: err.message || "Internal Server Error" })
          );
        }
      });
  }

  // ROUTE NOT FOUND
  else {
    if (!res.writableEnded) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Route not found" }));
    }
  }
};

module.exports = authHandler;
