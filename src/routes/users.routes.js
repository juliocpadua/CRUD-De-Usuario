import { Router } from "express";
import createUserController from "../controllers/createUser.controller";
import deleteUserController from "../controllers/deleteUser.controller";
import listUserController from "../controllers/listUser.controller";
import profileController from "../controllers/profileController";
import updateUserController from "../controllers/updateUser.controller";
import adminMiddleware from "../middlewares/admin.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import userExists from "../middlewares/userExists.middleware";

const router = Router();

router.post("", userExists, createUserController);
router.get("", authMiddleware, adminMiddleware, listUserController);
router.get("/profile", authMiddleware, profileController);
router.delete("/:uuid", authMiddleware, deleteUserController);
router.patch("/:uuid", authMiddleware, adminMiddleware, updateUserController);

export default router;
