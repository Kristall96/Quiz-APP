import http from "http";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authHandler from "./routes/authHeandler.js";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "./routes/adminUpdates.js";

dotenv.config();
connectDB();

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://127.0.0.1:5500", // Your frontend origin
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    return res.end();
  }

  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    if (req.url.startsWith("/get-all-users") && req.method === "GET") {
      await getAllUsers(req, res);
    } else if (req.url.startsWith("/update-role") && req.method === "PUT") {
      await updateUserRole(req, res);
    } else if (req.url.startsWith("/delete-user") && req.method === "DELETE") {
      await deleteUser(req, res);
    } else {
      authHandler(req, res);
    }
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});
