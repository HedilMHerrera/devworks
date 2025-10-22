const jwt = require("jsonwebtoken");

function generateValidToken(userData = {}) {
  const defaultData = {
    id: 1,
    email: "test@example.com",
  };

  const payload = { ...defaultData, ...userData };

  return jwt.sign(payload, process.env.JWT_SECRET || "secret", {
    expiresIn: "1h",
  });
}

function generateInvalidToken() {
  return jwt.sign(
    { id: 1, email: "test@example.com" },
    "wrong-secret-key",
    { expiresIn: "1h" },
  );
}

function decodeToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET || "secret");
}

function extractTokenFromCookie(response) {
  const cookies = response.headers["set-cookie"];
  if (!cookies) {
    return null;
  }

  const authCookie = cookies.find((cookie) => cookie.startsWith("authToken="));
  if (!authCookie) {
    return null;
  }

  const match = authCookie.match(/authToken=([^;]+)/);
  return match ? match[1] : null;
}

module.exports = {
  generateValidToken,
  generateInvalidToken,
  decodeToken,
  extractTokenFromCookie,
};
