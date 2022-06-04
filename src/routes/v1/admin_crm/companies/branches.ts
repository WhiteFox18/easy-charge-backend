import { Router } from "express";
import { validate } from "../../../../modules/middlewares";
import { param, query } from "express-validator";
import CompanyBranchController from "../../../../controllers/admin_crm/CompanyBranchController";

const router = Router();

router
  .get("/",
    validate([
      query("company_id").isNumeric(),
      query("search").optional({nullable: true, checkFalsy: true}).trim().isString(),
      query("limit").optional({nullable: true, checkFalsy: true}).isNumeric(),
      query("page").optional({nullable: true, checkFalsy: true}).isNumeric(),
    ]),
    CompanyBranchController.list)

  .get("/:id",
    validate([
      param("id").isNumeric()
    ]),
    CompanyBranchController.getOne)

export default router;