import { NextFunction, Request, Response } from "express";
import db from "../../db";

const AuthController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.admin.service.login({
          username: req.body.username as string,
          password: req.body.password as string
        })
      )
    } catch (e) {
      next(e);
    }
  },
  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.admin.service.logout(res.locals.id)
      )
    } catch (e) {
      next(e);
    }
  },
}

export default AuthController