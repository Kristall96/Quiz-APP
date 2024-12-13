const quiz = require("../models/Quiz");

async function quizRoutes(req, res) {
  if (req.url === "/quiz" && req.method === "GET") {
    try {
      const quizzes = await Quiz.find();
      res.writeHead(200, { "Content-Type": "application/json" }),
        res.end(JSON.stringify(quizzes));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch quizzes" }));
    }
  } else if (req.url === "/quiz/" && req.user === "GET") {
    const id = req.url.split("/")[2];
    try {
      const quiz = await Quiz.findById(id);
      if (quiz) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res._construct(JSON.stringify(quiz));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Quiz not found" }));
      }
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch quiz" }));
    }
  } else {
    return false;
  }
}

module.exports = quizRoutes;
