import { NextFunction, Request, Response } from "express";
import Review from "../models/Review.js";
import Book from "../models/Book.js";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";

export const createBookReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { rating, comment } = req.body;

  const bookId = req.params.id;
  const userId = req.user._id;
  try {
    if (!isValidObjectId(bookId)) {
      throw createHttpError(400, "Invalid book ID");
    }
    const book = await Book.findById(bookId);

    if (book) {
      const alreadyReviewed = await Review.findOne({
        user: userId,
        book: bookId,
      });

      if (alreadyReviewed) {
        res.status(400).json({ message: "Book already reviewed" });
        return;
      }

      const review = await Review.create({
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: userId,
        book: bookId,
      });

      res.status(201).json(review);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const getBookReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bookId = req.params.id;
  try {
    if (!isValidObjectId(bookId)) {
      throw createHttpError(400, "Invalid book ID");
    }
    const reviews = await Review.find({ book: bookId }).populate(
      "user",
      "name"
    );
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reviewId = req.params.id;
  const userId = req.user._id;
  try {
    if (!isValidObjectId(reviewId)) {
      throw createHttpError(400, "Invalid review ID");
    }
    const review = await Review.findById(reviewId);

    if (review) {
      if (review.user.toString() === userId.toString() || req.user.isAdmin) {
        await review.deleteOne();
        res.json({ message: "Review removed" });
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const getUserReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.id;
  try {
    if (!isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user ID");
    }
    const reviews = await Review.find({ user: userId })
      .populate("book", "title author")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};
