const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in .env");
}

function signAccessToken(user) {
  return jwt.sign({ role: user.role }, JWT_SECRET, {
    subject: String(user.id),
    expiresIn: EXPIRES_IN,
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { signAccessToken, verifyAccessToken };
