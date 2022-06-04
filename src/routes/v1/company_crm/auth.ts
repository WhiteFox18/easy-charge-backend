import { Router } from "express";
import { companyUserProtected, validate } from "../../../modules/middlewares";
import { body } from "express-validator";
import AuthController from "../../../controllers/company_crm/AuthController";

const router = Router();

router
  .post("/",
    validate([
      body("phone_number").trim().isString().isLength({min: 4}),
      body("password").trim().isString().isLength({min: 8}),
    ]),
    AuthController.login)

  .delete("/",
    companyUserProtected,
    AuthController.logout);

export default router;