import { NextFunction, Request, Response } from "express";
import Book from "../models/Book.js";
import Review from "../models/Review.js";
import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";

export const getBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const books = await Book.find({ ...keyword });

    res.json(books);
  } catch (error) {
    next(error);
  }
};

export const getFeaturedBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get total count of books
    const totalBooks = await Book.countDocuments();

    // If we have less than 10 books, return all of them
    if (totalBooks <= 10) {
      const books = await Book.find();
      return res.json(books);
    }

    // Get 10 random books using aggregation
    const books = await Book.aggregate([{ $sample: { size: 10 } }]);

    res.json(books);
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bookId = req.params.id;
  try {
    if (!isValidObjectId(bookId)) {
      throw createHttpError(400, "Invalid book ID");
    }
    const book = await Book.findById(bookId);

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, author, description, publishedYear } = req.body;
  try {
    if (!title || !author || !description || !publishedYear) {
      throw createHttpError(400, "All fields are required");
    }
    const book = await Book.create({
      title,
      author,
      description,
      publishedYear,
    });

    if (book) {
      res.status(201).json(book);
    } else {
      res.status(400).json({ message: "Invalid book data" });
    }
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, author, description, publishedYear } = req.body;
  try {
    if (!isValidObjectId(req.params.id)) {
      throw createHttpError(400, "Invalid book ID");
    }
    const book = await Book.findById(req.params.id);

    if (book) {
      book.title = title || book.title;
      book.author = author || book.author;
      book.description = description || book.description;
      book.publishedYear = publishedYear || book.publishedYear;

      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bookId = req.params.id;
  try {
    if (!isValidObjectId(bookId)) {
      throw createHttpError(400, "Invalid book ID");
    }
    const book = await Book.findById(bookId);

    if (book) {
      // Delete all reviews associated with this book
      await Review.deleteMany({ book: bookId });
      // Delete the book
      await book.deleteOne();
      res.json({ message: "Book and associated reviews removed" });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    next(error);
  }
};
