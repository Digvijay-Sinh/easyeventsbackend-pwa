import express from "express";
import {
  sendOtp,
  verifyOtp,
  passwordSetter,
  login,
  refreshToken,
  resendOtp,
  forgotPassword,
  updateProfileImage,
} from "../controller/authController";
import verifyJWT from "../middleware/middleware";

const router = express.Router();

// Route to retrieve all users
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/refreshToken", refreshToken);
router.post("/updateProfileImage", verifyJWT,updateProfileImage);

// Route to create a new user
router.post("/send-otp", sendOtp);
router.post("/resend-otp", resendOtp);
router.post("/set-password", passwordSetter);

// // Route to retrieve a user by ID
// router.get('/:id', findById);

// // Route to update a user by ID
// router.put('/:id', update);

// // Route to delete a user by ID
// router.delete('/:id', remove);

export default router;
