import express from "express";
import { validate } from "express-validation";
import multer from "multer";
import path from "path";
import {
  getUsers,
  loginUser,
  registerUser,
} from "../../controllers/usersControllers/usersControllers.js";
import userRegisterSchema from "../../schema/userRegisterDataSchema.js";

const upload = multer({
  dest: path.join("assets", "images"),
});

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

usersRouter.post(
  "/register",
  upload.single("picture"),
  validate(userRegisterSchema, {}, { abortEarly: false }),
  registerUser
);
usersRouter.post("/login", loginUser);
usersRouter.get("/", getUsers);

export default usersRouter;
