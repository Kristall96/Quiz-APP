const http = require("http");
const uri =
  "mongodb+srv://erkandev:erkan96@cluster0.1dt2n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: `Successful connection!` }));
  } else if (req.url === "/about" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Welcome to the about page" }));
  } else if (req.url === "/contact" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Welcome to the Contact page!" }));
  } else if (req.url === "/quiz" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Welcome to the Quiz Page" }));
  } else if (req.url.startsWith("/quiz/") && req.method === "GET") {
    const id = req.url.split("/")[2];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: `Single Quiz ID:${id}` }));
  } else if (req.url === "/contact" && req.method === "POST") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Contact Form Post request" }));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Page not found" }));
  }
});

server.listen(3000, () => {
  console.log(`Your server is working on port 3000!`);
});
