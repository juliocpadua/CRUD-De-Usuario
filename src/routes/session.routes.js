import { Router } from "express";
import { createSessionController } from "../controllers/session.controller";

const sessionRoutes = Router();

sessionRoutes.post("", createSessionController);

export default sessionRoutes;
