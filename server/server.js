const { serveFiles } = require("./utils");
const http = require("http");
const path = require("path");
const url = require("url");

const PORT = 3000;
const URL = "http://localhost:";

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true); //Parse the url and query params
  const query = (parsedUrl = parsedUrl.query);

  if (parsedUrl.pathname === "/") {
    serveFiles(path.join(__dirname, "index.html"), res);
  } else if (parsedUrl.pathname === "/about") {
    serveFiles(path.join(__dirname, "about.html"), res);
  } else if (parsedUrl.pathname === "/contact") {
    serveFiles(path.join(__dirname, "contact.html"), res);
  } else if (parsedUrl.pathname === "/search") {
    const searchTerm = query.q || "No query provided";
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`Search Term: ${searchTerm}`);
  } else {
    serveFiles(path.join(__dirname, "404.html"), res);
  }
});

server.listen(PORT, () => {
  console.log(
    `Your Server is Running on PORT: ${PORT}, with the URL: ${URL}${PORT}`
  );
});
