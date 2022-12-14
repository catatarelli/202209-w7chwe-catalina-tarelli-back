import type { Request, NextFunction } from "express";
import CustomError from "../../../CustomError/CustomError";
import type { CustomRequest } from "../../../types/types";
import { auth } from "./auth";

beforeEach(() => {
  jest.clearAllMocks();
});

const next = jest.fn();
const req: Partial<Request> = {};

describe("Given the auth middleware", () => {
  describe("When it receives a request with header", () => {
    test("Then it should call next with a Custom Error with public message 'Missing token' and response status 401", async () => {
      const expectedError = new CustomError(
        "Authorization header missing",
        401,
        "Missing token"
      );

      req.header = jest.fn().mockReturnValueOnce(undefined);

      auth(req as CustomRequest, null, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
  describe("When it receives a request with Authorization header 'abc123' and it is not a valid token", () => {
    test("Then it should call next with a Custom Error with public message 'Invalid token' and response status 401", () => {
      const expectedError = new CustomError(
        "Missing Bearer in token",
        401,
        "Invalid token"
      );

      req.header = jest.fn().mockReturnValueOnce("abc123");

      auth(req as CustomRequest, null, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
