import { Router } from "express";
import { SalesmanController } from "../controllers/salesman.controller.js";
import { AuthGuard } from "../guards/auth.guard.js";
import { RolesGuard } from "../guards/roles.guard.js";
import { SelfGuard } from "../guards/self.guard.js";

const router = Router();
const controller = new SalesmanController();

router
  .post(
    "/",
    AuthGuard,
    RolesGuard(["superadmin", "admin"]),
    controller.createSalesman
  )
  .get(
    "/",
    AuthGuard,
    RolesGuard(["superadmin", "admin"]),
    controller.getAllSalesman
  )
  .get("/:id", AuthGuard, SelfGuard, controller.getSalesmanById)
  .patch("/:id", AuthGuard, SelfGuard, controller.updateSalesman)
  .delete(
    "/:id",
    AuthGuard,
    RolesGuard(["superadmin"]),
    controller.removeSalesman
  );

export default router;
