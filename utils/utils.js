const fs = require("fs");
const path = require("path");

const basePath = path.join(__dirname, "../");

const getMimeType = (ext) => {
  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
  };
  return mimeTypes[ext] || "application/octet-stream";
};

const serveFiles = (filepath, res) => {
  const ext = path.extname(filepath);

  fs.readFile(filepath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end(`Error loading the page: ${error.message}`);
    } else {
      res.writeHead(200, { "Content-Type": getMimeType(ext) });
      res.end(data);
    }
  });
};

module.exports = { serveFiles };
