import { NextFunction, Request, Response } from "express";
import db from "../../db";

const CompanyBranchController = {
  createOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.companyBranch.service.createOne({
          user_id: res.locals.id,
          district_id: req.body.district_id,
          name_uz: req.body.name_uz,
          name_ru: req.body.name_ru,
          name_en: req.body.name_en,
          coords: req.body.coords,
          mon_from: req.body.mon_from,
          mon_to: req.body.mon_to,
          tue_from: req.body.tue_from,
          tue_to: req.body.tue_to,
          wed_from: req.body.wed_from,
          wed_to: req.body.wed_to,
          thu_from: req.body.thu_from,
          thu_to: req.body.thu_to,
          fri_from: req.body.fri_from,
          fri_to: req.body.fri_to,
          sat_from: req.body.sat_from,
          sat_to: req.body.sat_to,
          sun_from: req.body.sun_from,
          sun_to: req.body.sun_to,
        }),
      );
    } catch (e) {
      next(e);
    }
  },
  updateOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.companyBranch.service.updateOne({
          id: req.params.id as any as number,
          user_id: res.locals.id,
          district_id: req.body.id,
          name_uz: req.body.name_uz,
          name_ru: req.body.name_ru,
          name_en: req.body.name_en,
          coords: req.body.coords,
          mon_from: req.body.mon_from,
          mon_to: req.body.mon_to,
          tue_from: req.body.tue_from,
          tue_to: req.body.tue_to,
          wed_from: req.body.wed_from,
          wed_to: req.body.wed_to,
          thu_from: req.body.thu_from,
          thu_to: req.body.thu_to,
          fri_from: req.body.fri_from,
          fri_to: req.body.fri_to,
          sat_from: req.body.sat_from,
          sat_to: req.body.sat_to,
          sun_from: req.body.sun_from,
          sun_to: req.body.sun_to,
        })
      )
    } catch (e) {
      next(e);
    }
  },
  deleteOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await db.companyBranch.service.deleteOne({
          user_id: res.locals.id,
          branch_id: req.params.id as any as number
        })
      )
    } catch (e) {
      next(e)
    }
  }
};

export default CompanyBranchController;