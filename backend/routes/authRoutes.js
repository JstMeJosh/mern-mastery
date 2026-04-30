import express from "express";
import {
  registerUser,
  loginUser,
  verifyOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { validateSchema } from "../middleware/validateRequest.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/authValidator.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", validateSchema(registerSchema), registerUser);
router.post("/login", validateSchema(loginSchema), loginUser);
router.post(
  "/forgot-password",
  validateSchema(forgotPasswordSchema),
  forgotPassword,
);
router.get("/me", protect, (req, res) => {
  res.status(200).json({ user: req.user });
});
router.post("/reset-password/:token", validateSchema(resetPasswordSchema), resetPassword);
router.post("/verify-otp", verifyOTP);
export default router;
