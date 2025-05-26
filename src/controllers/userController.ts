import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";

// Generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id as string),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id as string),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.id;
  try {
    if (!isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user ID");
    }
    const user = await User.findById(userId);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {}
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.id;
  try {
    if (!isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user ID");
    }
    const user = await User.findById(userId);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id as string),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};
