const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret";

function verifyToken(req, res, next) {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    if (process.env.NODE_ENV !== "test") {
      console.log(req.user);
    }
    next();
  } catch (error) {
    return res.status(403).send(error.message);
  }
}

module.exports = verifyToken;
