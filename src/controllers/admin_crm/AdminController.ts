import { NextFunction, Request, Response } from "express";
import db from "../../db";

const AdminController = {
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.admin.service.list({
          search: req.query.search as string,
          limit: req.query.limit as any as number,
          offset: req.query.offset as any as number
        })
      )
    } catch (e) {
      next(e);
    }
  },
  getOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.admin.service.getOne(req.params.id as any as number)
      )
    } catch (e) {
      next(e)
    }
  },
  createOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.admin.service.createOne({
          username: req.body.username,
          name: req.body.name,
          surname: req.body.surname,
          patronymic: req.body.patronymic,
          password: req.body.password,
          is_super: req.body.is_super
        })
      )
    } catch (e) {
      next(e)
    }
  },
  updateOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.admin.service.updateOne({
          id: res.locals.id,
          name: req.body.name as string,
          surname: req.body.surname as string,
          patronymic: req.body.patronymic as string,
        })
      )
    } catch (e) {
      next(e)
    }
  },
  deleteOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.admin.service.deleteOne(req.params.id as any as number)
      )
    } catch (e) {
      next(e)
    }
  }
};

export default AdminController;