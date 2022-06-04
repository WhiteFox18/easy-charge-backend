import cookieParser from "cookie-parser";
import express from "express";
import logger from "morgan";
import indexRouter from "./routes";
import { createImagesFolder, errorHandling } from "./modules/helpers";
import { cors_after, cors_before, createOffsetFieldInQuery } from "./modules/middlewares";
import config from "./config";
import cors from "cors";

createImagesFolder();

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS
app.use(cors_before);
app.use(cors_after);

// OFFSET FIELD
app.use(createOffsetFieldInQuery);

// Routes
app.use("/api", indexRouter);

// Error Handling
app.use(errorHandling);

export default app;
