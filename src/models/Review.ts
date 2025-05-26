import mongoose from "mongoose";

export interface IReview extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
}

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Book",
    },
    rating: {
      type: Number,
      required: [true, "Please add a rating"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Please add a comment"],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting more than one review per book
reviewSchema.index({ book: 1, user: 1 }, { unique: true });

// Calculate average rating and total reviews when a review is saved
reviewSchema.statics.calcAverageRating = async function (
  bookId: mongoose.Types.ObjectId
) {
  const stats = await this.aggregate([
    {
      $match: { book: bookId },
    },
    {
      $group: {
        _id: "$book",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model("Book").findByIdAndUpdate(bookId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
    });
  } else {
    await mongoose.model("Book").findByIdAndUpdate(bookId, {
      averageRating: 0,
      totalReviews: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRating(this.book);
});

reviewSchema.post("remove", function () {
  this.constructor.calcAverageRating(this.book);
});

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;
