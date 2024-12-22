const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

require("dotenv").config();
let tokenBlackList = [];
// Helper function to parse JSON request body
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
        reject({ error: err.status || "Invalid JSON" });
      }
    });
  });
};

const authHandler = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.url === "/register" && req.method === "POST") {
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
            message: "Username or email already exist",
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
        res.writeHead(201),
          res.end(JSON.stringify({ message: "Account succesfully created!" }));
      })
      .catch((err) => {
        if (!res.writableEnded) {
          res.writeHead(err.status || 500),
            res.end(
              JSON.stringify({ error: err.status || "Internal server error" })
            );
        }
      });
  } else if (req.url === "/login" && req.method === "POST") {
    parseRequestBody(req)
      .then(({ email, password }) => {
        if (!email && !password) {
          return Promise.reject({
            status: 400,
            message: "All fileds are required",
          });
        }
        return User.findOne({ $or: [{ email }] }).then((user) => {
          if (!user) {
            return Promise.reject({
              status: 400,
              message: "Email is required",
            });
          }
          return bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) {
              return Promise.reject({
                status: 400,
                message: "Wrong password",
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
        res.end(JSON.stringify({ message: "Successful login", token }));
      })
      .catch((err) => {
        console.error(`error:`, err);
        const status = err.status || 500;
        const message = err.message || "Internal server error";
        if (!res.writableEnded) {
          res.writeHead(status);
          res.end(JSON.stringify({ error: message }));
        }
      });
  } else if (req.url === "/logout" && req.method === "POST") {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.writeHead(400);
      res.end(JSON.stringify({ message: "Toekn is required to logout" }));
    }
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      tokenBlackList.push(token);

      res.writeHead(200);
      return res.end(JSON.stringify({ message: "Succesfully logged out" }));
    } catch (err) {
      console.error("Error", err);
      res.writeHead(401);
      res.end(JSON.stringify({ error: "Invalid token" }));
    }
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
