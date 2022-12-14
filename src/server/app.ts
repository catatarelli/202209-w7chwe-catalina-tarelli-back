import express from "express";
import morgan from "morgan";
import cors from "cors";
import { generalError, unknownEndpoint } from "./middlewares/errors/errors.js";
import usersRouter from "./routers/usersRouters/usersRouters.js";

const app = express();

app.use(cors());
app.disable("x-powered-by");

app.use(morgan("dev"));
app.use(express.static("/assets"));

app.use(express.json());

app.use("/users", usersRouter);

app.use(unknownEndpoint);
app.use(generalError);

export default app;
