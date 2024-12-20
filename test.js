const bcrypt = require("bcrypt");
const User = require("../models/User");

const parseRequestBody = (req) => {
  return new Promise((resolve, rejects) => {
    let body = "";
    req.on("data", (chunks) => {
      body = body + chunks;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        rejects("Invalid JSON");
      }
    });
  });
};

const authHandler = (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/register" && req.url === "POST") {
    let username, email, password;
    parseRequestBody(req)
      .then((body) => {
        ({ username, email, password } = body);
        if (!username || !email || !password) {
          return Promise.reject({
            status: 400,
            message: "All fields are required",
          });
        }

        return User.findOne({ $or: [{ username }, { email }] });
      })
      .then((existingUser) => {
        if (existingUser) {
          return Promise.reject({
            status: 400,
            message: "Username or Email already exists",
          });
        }
        return bcrypt.hash(password, 10);
      })
      .then((hashedPassword) => {
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
};
