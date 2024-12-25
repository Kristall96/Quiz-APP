import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dontenv from "dotenv";

dontenv.config();
let tokenBlackList = [];
const parseRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunks) => {
      body += chunks;
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

const authHandler = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.url === "/register" && req.method === "POST") {
    try {
      const { username, email, password } = await parseRequestBody(req);

      if (!username) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Username is Required." }));
      }
      if (!email) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Email is Required." }));
      }
      if (!password) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Password is Required." }));
      }

      const existingUser = await User.findOne({ $or: [{ username, email }] });
      if (existingUser) {
        if (username) {
          res.writeHead(400);
          return res.end(JSON.stringify({ error: "Username already exists." }));
        }
        if (email) {
          res.writeHead(400);
          return res.end(JSON.stringify({ error: "Email already exist." }));
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      newUser.save();

      res.writeHead(201);
      res.end(JSON.stringify({ message: "Account Succesfully Created" }));
    } catch (err) {
      console.error(`Register Error:`, err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  } else if (req.url === "/login" && req.method === "POST") {
    try {
      const { email, password } = await parseRequestBody(req);

      if (!email) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Email is Required." }));
      }
      if (!password) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Password is Required." }));
      }

      const user = await User.findOne({ $or: [{ email }] });
      if (!user) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Email doesn't exist." }));
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Wrong password" }));
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.writeHead(200);
      res.end(JSON.stringify({ message: "Successful Login", token }));
    } catch (err) {
      console.error(`Login Error:`, err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  } else if (req.url === "/logout" && req.method === "POST") {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: "Token is required to logout" }));
    }
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      tokenBlackList.push(token);

      res.writeHead(200);
      res.end(JSON.stringify({ message: "Successfully logged out" }));
    } catch (err) {
      console.error(`Logout Error:`, err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Invalid Token" }));
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Route not found" }));
  }
};
export default authHandler;
