import { Router } from "express";
import fuel_types from "./fuel_types";
import companies from "./companies";
import admins from "./admins";

const router = Router();

router.use("/fuel_types", fuel_types)
router.use("/companies", companies)
router.use("/admins", admins)

export default router;