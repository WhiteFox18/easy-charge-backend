import { NextFunction, Request, Response } from "express";
import db from "../../db";

const CompanyController = {
  listCompanies: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.company.service.list({
          search: req.query.search as string || null,
          limit: req.query.limit as any as number || null,
          offset: req.query.offset as any as number || null
        })
      )
    } catch (e) {
      next(e)
    }
  },
  getOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.company.service.getOne(req.params.id as any as number)
      )
    } catch (e) {
      next(e)
    }
  },
  createOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.company.service.createOne({
          name: req.body.name,
          user: req.body.user
        })
      )
    } catch (e) {
      next(e)
    }
  },
  deleteOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.company.service.deleteOne(req.params.id as any as number)
      )
    } catch (e) {
      next(e)
    }
  },
}

export default CompanyController