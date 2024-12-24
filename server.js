const http = require("http");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authHandler = require("./routes/auth");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Configure CORS middleware
const corsMiddleware = cors({
  origin: "http://127.0.0.1:5500", // Your frontend origin
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Include Authorization header
});

// Create HTTP server
const server = http.createServer((req, res) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "http://127.0.0.1:5500", // Your frontend origin
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    return res.end();
  }

  // Apply CORS middleware for other requests
  corsMiddleware(req, res, () => {
    // Route the request to the appropriate handler
    authHandler(req, res);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
