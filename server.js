const http = require("http");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authHandler = require("./routes/auth");
const User = require("./models/User");

dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Delegate all requests to the authHandler
  authHandler(req, res);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
