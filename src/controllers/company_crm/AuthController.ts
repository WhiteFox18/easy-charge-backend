import { NextFunction, Request, Response } from "express";
import db from "../../db";

const AuthController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.companyUser.service.login({
          phone_number: req.body.phone_number as string,
          password: req.body.password as string
        })
      )
    } catch (e) {
      next(e);
    }
  },
  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (e) {
      next(e);
    }
  },
}

export default AuthController