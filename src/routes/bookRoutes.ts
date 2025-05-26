import express, { RequestHandler } from "express";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getFeaturedBooks,
} from "../controllers/bookController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getBooks).post(protect, admin, createBook);

router.get("/featured", getFeaturedBooks as RequestHandler);

router
  .route("/:id")
  .get(getBookById)
  .put(protect, admin, updateBook)
  .delete(protect, admin, deleteBook);

export default router;
