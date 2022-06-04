import { Router } from "express";
import fuel_types from "./fuel_types";
import companies from "./companies";
import admins from "./admins";
import auth from "./auth";
import { adminProtected } from "../../../modules/middlewares";

const router = Router();

router.use("/auth", auth)

router.use(adminProtected)

router.use("/fuel_types", fuel_types)
router.use("/companies", companies)
router.use("/admins", admins)

export default router;