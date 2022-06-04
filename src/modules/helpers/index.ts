import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../errors/CustomError";
import Errors from "../errors";
import { JwtTokenUserType } from "../../types";
import config from "../../config";
import db from "../../db";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

// create image folder one folder up
export const createImagesFolder = () => {
  if (!fs.existsSync(path.join(path.resolve(), "..", "images"))) {
    fs.mkdirSync(path.join(path.resolve(), "..", "images"));
  }
};

// Error handling function for
export const errorHandling = async (err: Error, req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(err);

    if (!(err instanceof CustomError))
      throw new Error("unexpectedServerError");

    res.status(err.statusCode).json({
      error: {
        type: err.message,
        description: err.description,
        fields: err.fields,
      },
    });
  } catch (error) {
    res.status(500).json({
      "error": {
        "type": "unexpectedServerError",
        "description": ["unexpected server error occurred"],
        "fields": [],
      },
    });
  }
};

// To get offset on the routes with pagination
export const getOffset = ({ limit, page }: { limit: number; page: number }) => {
  return limit * (page - 1);
};

// To format array of items from database query result into object with count and items
export const paginate = (result: any) => {
  if (Array.isArray(result)) {
    let count: number = 0;
    result.forEach((item: any) => {
      if (item.count) {
        if (count === 0) count = item.count;
        delete item.count;
      }
    });
    return {
      count,
      items: result,
    };
  }
  return result;
};

// Check if database query result has data if no, fire 404 error
export const checkQueryResultNoData = (data: any) => {
  try {
    if (!data)
      if (!Array.isArray(data))
        Errors.notExists([]);

    return data;
  } catch (e) {
    throw e;
  }
};

// generate jwt token
export const createUserJwtToken = async ({ user_id, is_super, working_branches, type }:
                                           {
                                             user_id: number, is_super: boolean;
                                             working_branches?: { id: number; is_super: boolean }[];
                                             type: JwtTokenUserType
                                           }) => {
  try {
    let token: string = null;

    if (type === "admin") {
      token = jwt.sign({ id: user_id, is_super: is_super }, config.jwt_secret.admin);
      await db.admin.service.setToken({ id: user_id, token });
    } else if (type === "company_user") {
      token = jwt.sign({ id: user_id, is_super: is_super, working_branches: working_branches }, config.jwt_secret.company_user);
      await db.companyUser.service.setToken({ id: user_id, token });
    }

    return token;
  } catch (e) {
    throw e;
  }
};

// create hashed password
export const hashPassword = async (password: string) => {
  try {
    return await bcrypt.hash(password, config.salt_round);
  } catch (e) {
    throw e;
  }
};