import jwt from "jsonwebtoken";

// Middleware: Authenticate User
export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach user info (e.g., id, role) to the request
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

// Middleware: Authorize Admin
export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};
