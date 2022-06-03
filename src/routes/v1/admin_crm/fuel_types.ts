import { Router } from "express";
import FuelTypesController from "../../../controllers/admin_crm/FuelTypesController";
import { validate } from "../../../modules/middlewares";
import { body, param } from "express-validator";

const router = Router();

router
  .get("/", FuelTypesController.listFuelTypes)

  .post("/",
    validate([
      body("parent_id").isNumeric(),
      body("name_ru").trim().isString().isLength({ min: 1 }),
      body("name_en").trim().isString().isLength({ min: 1 }),
      body("name_uz").trim().isString().isLength({ min: 1 }),
    ]),
    FuelTypesController.createOne)

  .get("/:id",
    validate([
      param("id").isNumeric(),
    ]),
    FuelTypesController.getOne)

  .put("/:id",
    validate([
      param("id").isNumeric(),
      body("name_ru").trim().isString().isLength({ min: 1 }),
      body("name_en").trim().isString().isLength({ min: 1 }),
      body("name_uz").trim().isString().isLength({ min: 1 }),
    ]),
    FuelTypesController.updateOne)

  .delete("/:id",
    validate([
      param("id").isNumeric(),
    ]),
    FuelTypesController.deleteOne);

export default router;