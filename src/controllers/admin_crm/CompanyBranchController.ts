import { NextFunction, Request, Response } from "express";
import db from "../../db";

const CompanyBranchController = {
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.companyBranch.service.list({
          company_id: req.query.company_id as any as number,
          lang: "en",
          search: req.query.search as string || null,
          limit: req.query.limit as any as number || null,
          offset: req.query.offest as any as number || null
        })
      )
    } catch (e) {
      next(e);
    }
  },
  getOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.companyBranch.service.getOneForMobile({
          id: req.params.id as any as number,
          lang: "en"
        })
        )
    } catch (e) {
      next(e);
    }
  },
};

export default CompanyBranchController;