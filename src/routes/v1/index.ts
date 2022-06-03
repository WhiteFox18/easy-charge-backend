import { Router } from "express";
import admin_crm from "./admin_crm";
import company_crm from "./company_crm";
import mobile from "./mobile";

const router = Router();

router.use("/admin_crm", admin_crm)
router.use("/company_crm", company_crm)
router.use("/mobile", mobile)

export default router;