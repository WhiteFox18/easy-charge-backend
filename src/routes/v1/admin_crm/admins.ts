import { Router } from "express";

const router = Router();

router
  .get("/")

  .get("/:id")

  .put("/:id")

  // SUPER USER
  .post("/")

  .delete("/:id");

export default router;