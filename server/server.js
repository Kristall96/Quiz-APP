const http = require("http");
const mongoose = require("mongoose");
const userRoute = require("../routes/userRoutes");

const uri =
  "mongodb+srv://erkandev:erkan96@cluster0.1dt2n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Connect to MongoDB
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

const server = http.createServer(async (req, res) => {
  const handled = await userRoute(req, res);

  if (!handled) {
    // Send 404 only if the route was not handled
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(3000, () => {
  console.log("Your server is working on port 3000!");
});
