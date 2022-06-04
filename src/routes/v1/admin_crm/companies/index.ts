import { Router } from "express";
import branches from "./branches";
import { validate } from "../../../../modules/middlewares";
import CompanyController from "../../../../controllers/admin_crm/CompanyController";
import { body, param, query } from "express-validator";

const router = Router();

router.use("/branches", branches);

router
  .get("/",
    validate([
      query("search").optional({nullable: true, checkFalsy: true}).trim().isString(),
      query("limit").optional({nullable: true, checkFalsy: true}).isNumeric(),
      query("page").optional({nullable: true, checkFalsy: true}).isNumeric(),
    ]),
    CompanyController.listCompanies)

  .post("/",
    validate([
      body("name").trim().isString().isLength({ min: 1 }),
      body("user").isObject(),
      body("user.name").trim().isString().isLength({ min: 1 }),
      body("user.surname").trim().isString().isLength({ min: 1 }),
      body("user.patronymic").trim().isString().isLength({ min: 1 }),
      body("user.passport").trim().isString().isLength({ min: 9, max: 9 }),
      body("user.phone_number").trim().isString().isLength({ min: 12, max: 12 }),
      body("user.password").trim().isString().isLength({ min: 8 }),
      body("user.confirm_password").trim().isString().isLength({ min: 8 })
        .custom((value, {req}) => value === req.body.user.password),
    ]),
    CompanyController.createOne)

  .get("/:id",
    validate([
      param("id").isNumeric()
    ]),
    CompanyController.getOne)

  .delete("/:id",
    validate([
      param("id").isNumeric()
    ]),
    CompanyController.deleteOne);

export default router;