const jwt = require("jsonwebtoken");
const { getTokenFromHeaders, verifyToken } = require("../utils/tokens");

// Middleware to authenticate the token - check if the token is valid
function authenticateToken(req, res, next) {
  const token = getTokenFromHeaders(req);

  if (!token) return res.sendStatus(403); // Forbidden

  const checkToken = verifyToken(token);

  if (checkToken === 0)
    return res.status(401).json({ message: "Token has expired" });

  if (checkToken === -1)
    return res.status(401).json({ message: "Invalid token!" });

  const payload = jwt.decode(token);

  req.user = payload;
  next();
}

module.exports = authenticateToken;
