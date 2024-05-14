import { Router } from "express";
import UserController from "../controllers/UserController";
import { upload } from "../middlewares";

const router = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/email/:email", UserController.getUserByEmail);

router.get("/profile/:userId", UserController.getProfile);
router.put("/profile/:userId", UserController.updateProfile);
router.put("/profile/avatar/:userId", upload, UserController.updateAvatar);
router.get("/all", UserController.getUserAll);

export default router;
