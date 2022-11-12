import express from "express";
import { validate } from "express-validation";
import {
  loginUser,
  registerUser,
} from "../../controllers/usersControllers/usersControllers.js";
import userRegisterSchema from "../../schema/userRegisterDataSchema.js";

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validate(userRegisterSchema, {}, { abortEarly: false }),
  registerUser
);
usersRouter.post("/login", loginUser);

export default usersRouter;
