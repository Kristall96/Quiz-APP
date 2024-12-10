const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const URL = "http://localhost:";

const server = http.createServer((req, res) => {
  const basePath = path.join(__dirname, "../");

  const getMimeType = (ext) => {
    const mimeTypes = {
      ".html": "text/html",
      ".css": "text/css",
      ".javascript": "text/javascript",
      ".png": "image/png",
      ".jpg": "image/jpg",
    };
    return mimeTypes || "application/octet-stream";
  };

  const serveFiles = (filepath, res) => {
    const ext = path.extname(filepath);

    fs.readFile(filepath, (error, data) => {
      if (error) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end(`Error loading the page`);
      } else {
        res.writeHead(200, { "Content-Type": getMimeType(ext) });
        res.end(data);
      }
    });
  };

  const filePath = path.join(
    basePath,
    req.url === "/" ? "index.html" : req.url.slice(1)
  );
  serveFiles(filePath, res);
});
server.listen(PORT, () => {
  console.log(
    `Your Server is Running on PORT: ${PORT}, with the URL: ${URL}${PORT}`
  );
});
