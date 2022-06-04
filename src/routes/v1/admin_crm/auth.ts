import { Router } from "express";
import { adminProtected, validate } from "../../../modules/middlewares";
import { body } from "express-validator";
import AuthController from "../../../controllers/admin_crm/AuthController";

const router = Router();

router
  .post("/",
    validate([
      body("username").trim().isString().isLength({min: 4}),
      body("password").trim().isString().isLength({min: 8}),
    ]),
    AuthController.login)

  .delete("/",
    adminProtected,
    AuthController.logout);

export default router;