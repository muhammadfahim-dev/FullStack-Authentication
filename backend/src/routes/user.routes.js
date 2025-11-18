import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
} from "../controllers/user.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh").get(refreshAccessToken);
router.route("/logout").get(logoutUser);
router.route("/me").get(authMiddleware, (req, res) => {
  return res.status(200).json({ user: req.user });
});

export default router;
