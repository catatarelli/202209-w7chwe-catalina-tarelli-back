import express from "express";
import morgan from "morgan";
import { generalError, unknownEndpoint } from "./middlewares/errors/errors.js";
import usersRouter from "./routers/usersRouters/usersRouters.js";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use("/users", usersRouter);

app.use(unknownEndpoint);
app.use(generalError);

export default app;
