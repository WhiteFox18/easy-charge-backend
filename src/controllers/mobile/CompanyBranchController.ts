import { NextFunction, Request, Response } from "express";
import db from "../../db";

const CompanyBranchController = {
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let fuel_types: any = null;

      if (req.query.fuel_types)
        fuel_types = (req.query.fuel_types as any as string[]).filter((element: string) => {
          if (element !== "" && Number.isInteger(Number.parseInt(element))) {
            return Number.parseInt(element);
          }
        });

      res.json(
        await db.companyBranch.service.listMobile({
          fuel_types: fuel_types || null,
          search: req.query.search as string || null,
          limit: req.query.limit as any as number || null,
          offset: req.query.offset as any as number || null,
          longitude: req.query.longitude as any as number || null,
          latitude: req.query.latitude as any as number || null,
          lang: "en",
        }),
      );
    } catch (e) {
      next(e);
    }
  },
  getOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.companyBranch.service.getOneForMobile({
          id: req.params.id as any as number,
          lang: "en",
        }),
      );
    } catch (e) {
      next(e);
    }
  },
};


export default CompanyBranchController;