import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { getOffset } from "../helpers";
import cors from "cors";
import config from "../../config";
import Errors from "../errors";
import jwt from "jsonwebtoken";
import { JwtTokenUserType } from "../../types";

const allowedOrigins = ["http://localhost:3000"];

export const validate = (validations: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("params");
    console.log(req.params);
    console.log("query");
    console.log(req.query);
    console.log("body");
    console.log(req.body);

    await Promise.all(validations.map((validation: any) => validation.run(req)));

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const errorsArray: any = [];

    await errors.array().forEach(error => {
      if (!errorsArray.includes(error.param))
        errorsArray.push(error.param);
    });

    return res.status(400).json({
      error: {
        type: "validation",
        description: "validation",
        fields: errorsArray,
      },
    });
  };
};

export const cors_before = cors({
  origin(origin, callback) {
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin && config.production === false) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("cors"), false);
    }

    return callback(null, true);
  },
  credentials: true,
});


export const cors_after = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;

  if (allowedOrigins.indexOf(origin) > -1) {
    // Website you wish to allow connecting
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

  // Request headers you wish to allow
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", "true");

  res.setHeader("Cache-Control", "no-store, no-cache");

  next();
};

const verifyAndGetTokenInfo = (authorizationHeader: string, type: JwtTokenUserType) => {
  try {
    if (!authorizationHeader || !authorizationHeader.includes("Bearer"))
      Errors.notAuthenticated();

    const token = authorizationHeader.split(" ")[1];

    try {
      if (type === "admin")
        return jwt.verify(token, config.jwt_secret.admin);
      else if (type === "company_user")
        return jwt.verify(token, config.jwt_secret.company_user);
    } catch (e) {
      Errors.notAuthenticated();
    }

    Errors.notAuthenticated();
  } catch (e) {
    throw e;
  }
};

export const adminProtected = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_info: any = await verifyAndGetTokenInfo(req.headers.authorization, "admin");
    
    res.locals = {
      user_id: user_info.id,
      is_super: user_info.is_super
    };

    next();
  } catch (e) {
    next(e);
  }
};

export const superAdminProtected = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!res.locals.is_user)
      Errors.notAllowed()

    next()
  } catch (e) {
    next(e)
  }
}

export const gigaChadAdminProtected = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!res.locals.is_user || res.locals.id !== 1)
      Errors.notAllowed()

    next()
  } catch (e) {
    next(e)
  }
}

export const companyUserProtected = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_info: any = await verifyAndGetTokenInfo(req.headers.authorization, "company_user");

    res.locals = {
      user_id: user_info.id,
      is_super: user_info.is_super,
      working_branches: user_info.working_branches
    };

    next();
  } catch (e) {
    next(e);
  }
};

export const createOffsetFieldInQuery = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "GET") {
    if (req.query.limit && req.query.page) {
      let offset = getOffset({
        limit: Number.parseInt(req.query.limit as string),
        page: Number.parseInt(req.query.page as string)
      })

      req.query.offset = offset.toString()
    }
  }

  next()
}