import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";
import jwt from "jsonwebtoken";
import CustomError from "../../../CustomError/CustomError.js";
import type {
  CustomRequest,
  RegisterData,
  UserCredentials,
  UserTokenPayload,
} from "../../../types/types";
import User from "../../../database/models/User.js";
import {
  secretWord,
  supabaseUrl,
  supabaseKey,
  supabaseBucketId,
} from "../../../loadEnvironments.js";
import type { NextFunction, Response, Request } from "express";

const supabase = createClient(supabaseUrl, supabaseKey);

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as UserCredentials;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new CustomError(
      "Wrong credentials",
      401,
      "Wrong credentials"
    );
    next(error);
    return;
  }

  const tokenPayload: UserTokenPayload = {
    id: user._id.toString(),
    username,
  };

  const token = jwt.sign(tokenPayload, secretWord, {
    expiresIn: "2d",
  });

  res.status(200).json({ token });
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email } = req.body as RegisterData;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (req.file) {
      const timeStamp = Date.now();

      const newFilePath = `${path.basename(
        req.file.originalname,
        path.extname(req.file.originalname)
      )}-${timeStamp}${path.extname(req.file.originalname)}`;

      await fs.rename(
        path.join("assets", "images", req.file.filename),
        path.join("assets", "images", newFilePath)
      );

      const bucket = supabase.storage.from(supabaseBucketId);
      const itemFileContents = await fs.readFile(
        path.join("assets", "images", newFilePath)
      );

      await bucket.upload(newFilePath, itemFileContents);
      const {
        data: { publicUrl },
      } = bucket.getPublicUrl(newFilePath);

      const newUser = await User.create({
        username,
        password: hashedPassword,
        email,
        picture: newFilePath,
        backupPicure: publicUrl,
      });

      res.status(201).json({
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        picture: path.join("assets", "images", newFilePath),
      });
    } else {
      const newUser = await User.create({
        username,
        password: hashedPassword,
        email,
      });

      res.status(201).json({ user: { id: newUser._id, username, email } });
    }
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "General error"
    );
    next(customError);
  }
};

export const getUsers = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  try {
    const users = await User.find({
      _id: { $ne: userId },
    }).select("-password");

    if (!users?.length) {
      res.status(404).json({ message: "No users found." });
      return;
    }

    res.status(200).json({ users });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Database doesn't work, try again later"
    );
    next(customError);
  }
};
