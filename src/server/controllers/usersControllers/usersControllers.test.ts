import "../../../loadEnvironments.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import CustomError from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";
import { secretWord } from "../../../loadEnvironments.js";
import {
  userMock,
  userMockCredentials,
  userMockWithId,
  usersListMock,
} from "../../../mocks/userMocks.js";
import { getUsers, loginUser, registerUser } from "./usersControllers.js";
import type { NextFunction, Request, Response } from "express";
import type { CustomRequest } from "../../../types/types.js";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

const req: Partial<Request> = {
  body: userMock,
};

describe("Given a loginUser Controller", () => {
  const newCustomError = new CustomError(
    "Wrong credentials",
    401,
    "Wrong credentials"
  );

  describe("When it receives a request with a username 'paquito' and password 'paquito' that are in the database", () => {
    test("Then it should respond with response status 200, and the json method with the token", async () => {
      const expectedStatus = 200;

      const token = jwt.sign(userMockWithId, secretWord);

      User.findOne = jest.fn().mockResolvedValue(userMockWithId);
      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);
      jwt.sign = jest.fn().mockReturnValueOnce(token);

      await loginUser(req as Request, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ token });
    });
  });

  describe("When it receives username 'pepito' that is not in the database", () => {
    test("Then it should call next with a Custom Error with public message 'Wrong credentials' and response status 401", async () => {
      User.findOne = jest.fn().mockResolvedValue({});

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(newCustomError);
    });
  });

  describe("When it receives a request with an empty body", () => {
    test("Then it should call next with a Custom Error with public message 'Wrong credentials' and response status 401", async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      const req: Partial<Request> = {
        body: {},
      };

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(newCustomError);
    });
  });
});

describe("Given a registerUser Controller", () => {
  const req: Partial<Request> = {
    body: userMockCredentials,
  };

  describe("When it receives a request with username 'paquito', password: 'paquito123', email: 'paquito@gmail.com'", () => {
    test("Then it should call the response method status with a 201, and the json method with the user", async () => {
      const expectedStatus = 201;

      const hashedPassword = await bcrypt.hash(
        userMockCredentials.password,
        10
      );

      User.create = jest.fn().mockResolvedValue({
        ...userMockCredentials,
        password: hashedPassword,
      });

      await registerUser(req as Request, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a request and there is an error", () => {
    test("Then it should call next with a custom Error", async () => {
      User.create = jest.fn().mockRejectedValue(new Error(""));
      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a getUsers Controller", () => {
  describe("When it finds a list of users", () => {
    test("Then it should call the response method status with a 200, and the json method", async () => {
      const expectedStatus = 200;

      User.find = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue(usersListMock),
      });

      await getUsers(req as CustomRequest, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives an empty array", () => {
    test("Then it should call the response method status with a 404", async () => {
      const expectedStatus = 404;

      User.find = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue([]),
      });

      await getUsers(req as CustomRequest, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a response with an error", () => {
    test("Then next should be called", async () => {
      const customError = new CustomError(
        "",
        500,
        "Database doesn't work, try again later"
      );
      const error = new Error();
      User.find = jest.fn().mockReturnValue({
        select: jest.fn().mockRejectedValue(error),
      });

      await getUsers(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
