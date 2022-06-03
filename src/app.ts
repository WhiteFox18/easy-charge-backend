import cookieParser from "cookie-parser";
import express from "express";
import logger from "morgan";
import indexRouter from "./routes";
import { errorHandling } from "./modules/helpers";
import { cors_after, cors_before } from "./modules/middlewares";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS
app.use(cors_before);
app.use(cors_after);

// Routes
app.use("/api", indexRouter);

// Error Handling
app.use(errorHandling);

export default app;
