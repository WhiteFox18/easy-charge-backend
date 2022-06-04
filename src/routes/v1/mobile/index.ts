import { Router } from "express";
import { validate } from "../../../modules/middlewares";
import CompanyBranchController from "../../../controllers/mobile/CompanyBranchController";
import { param, query } from "express-validator";
import FuelTypesController from "../../../controllers/admin_crm/FuelTypesController";

const router = Router();

router
  .get("/branches",
    validate([
      query("longitude").optional({ checkFalsy: true, nullable: true }).isNumeric(),
      query("latitude").optional({ checkFalsy: true, nullable: true }).isNumeric(),
      query("search").optional({ checkFalsy: true, nullable: true }).trim().isString(),
      query("fuel_types").optional({ checkFalsy: true, nullable: true }).isArray()
    ]),
    CompanyBranchController.list)

  .get("/branches/:id",
    validate([
      param("id").isNumeric(),
    ]),
    CompanyBranchController.getOne)

  router
    .get("/fuel_types", FuelTypesController.listFuelTypes)

export default router;