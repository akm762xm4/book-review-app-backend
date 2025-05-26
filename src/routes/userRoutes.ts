import express from "express";
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", authUser);
router.post("/", registerUser);
router.get("/:id", protect, getUserProfile);
router.put("/:id", protect, updateUserProfile);

export default router;
