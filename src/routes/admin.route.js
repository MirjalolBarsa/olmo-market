import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { AuthGuard } from "../guards/auth.guard.js";
import { RolesGuard } from "../guards/roles.guard.js";
import { SelfGuard } from "../guards/self.guard.js";

const router = Router();
const controller = new AdminController();

router
  .post(
    "/",
    AuthGuard,
    RolesGuard(["superadmin", "admin"]),
    controller.createAdmin
  )
  .post("/signin", controller.signIn)
  .post("/token", controller.newAccessToken)
  .post("/logout", AuthGuard, controller.logOut)
  .get("/", AuthGuard, RolesGuard(["superadmin"]), controller.getAllAdmin)
  .get("/:id", AuthGuard, SelfGuard, controller.getAdminById)
  .patch("/:id", AuthGuard, SelfGuard, controller.updateAdmin)
  .delete(
    "/:id",
    AuthGuard,
    RolesGuard(["superadmin"]),
    controller.removeAdmin
  );

export default router;
