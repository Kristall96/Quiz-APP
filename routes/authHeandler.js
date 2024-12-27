import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const parseRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunks) => (body += chunks));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject({ error: err.message || "Invalid JSON" });
      }
    });
  });
};

const authHandler = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.url === "/register" && req.method === "POST") {
    try {
      const { username, email, password } = await parseRequestBody(req);

      if (!username || !email || !password) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "All fields are required." }));
      }

      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "User already exists." }));
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: "user",
      });

      await newUser.save();
      res.writeHead(201);
      res.end(JSON.stringify({ message: "User registered successfully." }));
    } catch (err) {
      console.error("Register Error:", err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  } else if (req.url === "/login" && req.method === "POST") {
    try {
      const { email, password } = await parseRequestBody(req);

      if (!email || !password) {
        res.writeHead(400);
        return res.end(
          JSON.stringify({ error: "Email and password are required." })
        );
      }

      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Invalid email or password." }));
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.writeHead(200);
      res.end(JSON.stringify({ message: "Login successful", token }));
    } catch (err) {
      console.error("Login Error:", err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Route not found" }));
  }
};

export default authHandler;
