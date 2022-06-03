import { Router } from "express";
import branches from "./branches";
import users from "./users";

const router = Router();

router.use("/branches", branches);
router.use("users", users);

router
  .get("/")

  .post("/")

  .get("/:id")

  .delete("/:id");

export default router;