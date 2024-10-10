const {
  signUp,
  generateNewAccessToken,
  signIn,
} = require("../controllers/authController");

const authenticateToken = require("../middlewares/authMiddleware");

const authRouter = require("express").Router();

authRouter.post("/sign-up", (req, res) => {
  console.log("POST /sign-up");
  signUp(req, res);
});

authRouter.post("/refresh", authenticateToken, (req, res) => {
  console.log("POST /refresh");
  generateNewAccessToken(req, res);
});

authRouter.post("/sign-in", (req, res) => {
  console.log("POST /sign-in");
  signIn(req, res); // Gọi controller signIn để xử lý req
});

// router.post("/sign-out", authenticateToken, (req, res) => {
//   // Xử lý signOut ở phía server (ví dụ: lưu token vào blacklist)
//   // ...
//   res.sendStatus(200);
// });

module.exports = authRouter;
