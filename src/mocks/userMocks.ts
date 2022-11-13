import type { UserCredentials } from "../types/types.js";

export const userMock: UserCredentials = {
  username: "paquito",
  password: "paquito123",
};

export const userMockWithId = {
  username: "paquito",
  password: "paquito123",
  _id: "ñlaksdjfl",
};

export const userMockCredentials = {
  username: "paquito",
  password: "paquito123",
  email: "paquito@gmail.com",
  id: "ñasokdfjdsñlk",
};

export const usersListMock = [
  {
    username: "paquito",
    password: "paquito123",
    email: "paquito@gmail.com",
  },
  {
    username: "pepito",
    password: "pepito123",
    email: "pepito@gmail.com",
  },
];
