const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;
const commonOptions = { algorithm: "HS512" };

function getTokenFromHeaders(req) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  return token;
}

function generateTokens(user) {
  //console.log(user);

  const now = Date.now();

  const refreshToken = jwt.sign(
    {
      sub: user._id,
      iat: now,
      exp: now + 30 * 24 * 60 * 60 * 1000, // 30 days
    },
    SECRET_KEY,
    commonOptions
  );

  const accessToken = jwt.sign(
    {
      sub: user._id,
      iat: now,
      exp: now + 24 * 60 * 60 * 1000, // 1 day
      iss: `https://capstone-project-1-kfck.onrender.com`,
      aud: "EcoTrade",
      role: user.role,
    },
    SECRET_KEY,
    commonOptions
  );

  return { refreshToken, accessToken };
}
/**
 * verify is valid token or not, return 1 if valid, -1 if not valid, 0 if expired
 * @param {string} token
 * @returns {-1 | 0 | 1}
 */
function verifyToken(token) {
  return jwt.verify(token, process.env.SECRET_KEY, (error) => {
    if (error) {
      // Check if the token has expired
      if (error.name === "TokenExpiredError") {
        return 0; // Token has expired
      }
      return -1; // Unauthorized
    }
    return 1; // Token is valid
  });
}

function refreshAccessToken(token) {
  const payloadDecoded = jwt.decode(token);

  if (!payloadDecoded) {
    throw new Error("Invalid token");
  }

  const payload = {
    sub: payloadDecoded.sub,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 1 day
    iss: `https://capstone-project-1-kfck.onrender.com`,
    aud: "EcoTrade",
    role: payloadDecoded.role,
  };
  return jwt.sign(payload, SECRET_KEY, commonOptions, { expiresIn: "1d" });
}

module.exports = {
  generateTokens,
  getTokenFromHeaders,
  refreshAccessToken,
  verifyToken,
};
