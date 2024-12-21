const bcrypt = require("bcrypt");
const User = require("./models/User");

const parseRequestBody = (req) => {
  let body = "";
  return new Promise((resolve, reject) => {
    req.on("data", (chunks) => {
      body += chunks.toString();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject({ status: 400, message: "Invalid JSON" });
      }
    });
  });
};

const auth = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.url === "/register" && req.method === "POST") {
    const { username, email, password } = body;

    parseRequestBody(req)
      .then((body) => {
        if (!username || !email || !password) {
          return Promise.reject({
            status: 400,
            message: "All fields are required",
          });
        }
        return User.findOne({ $or: [{ username }, { email }] });
      })
      .then((existingUser) => {
        if (existingUser) {
          return Promise.reject({
            status: 400,
            message: "Username or email already exist",
          });
        }

        return bcrypt.hash(password, 10);
      })
      .then((hashedPassword) => {
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
        });
        return newUser.save();
      })
      .then(() => {
        res.writeHead(201),
          res.end(JSON.stringify({ message: "Account succesfully created!" }));
      })
      .catch((err) => {
        if (!res.writableEnded) {
          res.writeHead(err.status || 500),
            res.end(
              JSON.stringify({ error: err.status || "Internal server error" })
            );
        }
      });
  }
};
