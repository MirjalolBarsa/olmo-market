import { Router } from "express";
import { ClientController } from "../controllers/client.controller.js";
import { AuthGuard } from "../guards/auth.guard.js";
import { RolesGuard } from "../guards/roles.guard.js";
import { SelfGuard } from "../guards/self.guard.js";

const router = Router();
const controller = new ClientController();

router
  .post(
    "/",
    AuthGuard,
    RolesGuard(["superadmin", "admin"]),
    controller.createClient
  ) // Faqat admin foydalanuvchi yaratishi mumkin
  .post("/signup", controller.signUp) // Ochiq: ro'yxatdan o'tish
  .post("/signin", controller.sigIn) // Ochiq: kirish
  .post("/confirmsigin", controller.confirmSignIn) // Ochiq: sms yoki email orqali tasdiqlash
  .post("/token", controller.newAccessToken) // Ochiq: refresh token orqali access token olish
  .post("/logout", AuthGuard, controller.logOut) // Faqat tizimga kirgan foydalanuvchi chiqishi mumkin

  .get(
    "/",
    AuthGuard,
    RolesGuard(["superadmin", "admin"]),
    controller.getAllClient
  ) // Faqat admin barcha clientlarni ko‘ra oladi
  .get("/:id", AuthGuard, SelfGuard, controller.getClientById) // Har kim o‘zini ko‘ra oladi
  .patch("/:id", AuthGuard, SelfGuard, controller.updateClient) // Har kim o‘zini yangilay oladi
  .delete("/:id", AuthGuard, SelfGuard, controller.removeClient); // Har kim o‘zini o‘chira oladi

export default router;
