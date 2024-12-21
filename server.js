const http = require("http");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authHandler = require("./routes/auth");
const User = require("./models/User");
const cors = require("cors");

dotenv.config();
connectDB();

const corsMiddleware = cors({
  origin: "http://127.0.0.1:5500",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allow specific methods
  allowedHeaders: ["Content-Type"], // Allow specific headers
});

// Create HTTP server
const server = http.createServer((req, res) => {
  // Apply CORS headers globally
  corsMiddleware(req, res, () => {
    authHandler(req, res);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
