import express from "express";
import {
  createBookReview,
  getBookReviews,
  deleteReview,
  getUserReviews,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/:id/reviews")
  .get(getBookReviews)
  .post(protect, createBookReview);

router.route("/reviews/:id").delete(protect, deleteReview);

router.route("/user/:id/reviews").get(getUserReviews);

export default router;
