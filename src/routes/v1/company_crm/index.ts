import { Router } from "express";
import auth from "./auth";
import { companyUserProtected } from "../../../modules/middlewares";

const router = Router();

router.use("/auth", auth)

router.use(companyUserProtected)

export default router;