import { NextFunction, Request, Response } from "express";
import db from "../../db";

const FuelTypesController = {
  listFuelTypes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.fuelTypes.service.listFuels("en"),
      );
    } catch (e) {
      next(e);
    }
  },
  getOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.fuelTypes.service.getOne(req.params.id as any as number),
      );
    } catch (e) {
      next(e);
    }
  },
  createOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.fuelTypes.service.createOne({
          parent_id: req.body.parent_id as number,
          name_en: req.body.name_en as string,
          name_ru: req.body.name_ru as string,
          name_uz: req.body.name_uz as string,
        }),
      );
    } catch (e) {
      next(e);
    }
  },
  updateOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.fuelTypes.service.updateOne({
          id: req.params.id as any as number,
          name_en: req.body.name_en as string,
          name_ru: req.body.name_ru as string,
          name_uz: req.body.name_uz as string,
        }),
      );
    } catch (e) {
      next(e);
    }
  },
  deleteOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.fuelTypes.service.deleteOne(req.params.id as any as number),
      );
    } catch (e) {
      next(e);
    }
  },
};

export default FuelTypesController;