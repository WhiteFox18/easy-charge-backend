import { Router } from "express";
import AdminController from "../../../controllers/admin_crm/AdminController";
import { gigaChadAdminProtected, superAdminProtected, validate } from "../../../modules/middlewares";
import { body, param, query } from "express-validator";

const router = Router();

router
  .get("/",
    validate([
      query("search").optional({nullable: true, checkFalsy: true}).trim().isString(),
      query("limit").optional({nullable: true, checkFalsy: true}).isNumeric(),
      query("page").optional({nullable: true, checkFalsy: true}).isNumeric(),
    ]),
    AdminController.list)

  .get("/:id",
    validate([
      param("id").isNumeric()
    ]),
    AdminController.getOne)

  .put("/:id",
    validate([
      body("name").trim().isString().isLength({min: 1}),
      body("surname").trim().isString().isLength({min: 1}),
      body("patronymic").trim().isString().isLength({min: 1}),
    ]),
    AdminController.updateOne)

  // SUPER USER
  .use(superAdminProtected)

  .post("/",
    validate([
      body("username").trim().isString().isLength({min: 4}),
      body("name").trim().isString().isLength({min: 1}),
      body("surname").trim().isString().isLength({min: 1}),
      body("patronymic").trim().isString().isLength({min: 1}),
      body("password").trim().isString().isLength({min: 8}),
      body("confirm_password").trim().isString().isLength({ min: 8 })
        .custom((value, {req}) => value === req.body.password),
      body("is_super").isBoolean()
    ]),
    AdminController.createOne)

  // SUPER USER ID = 1
  .use(gigaChadAdminProtected)

  .delete("/:id",
    validate([
      param("id").isNumeric()
    ]),
    AdminController.deleteOne);

export default router;