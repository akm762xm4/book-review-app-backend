import mongoose from "mongoose";

export interface IBook extends mongoose.Document {
  title: string;
  author: string;
  description: string;
  publishedYear: number;
  averageRating: number;
  totalReviews: number;
}

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Please add an author"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    publishedYear: {
      type: Number,
      required: [true, "Please add a published year"],
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model<IBook>("Book", bookSchema);

export default Book;
