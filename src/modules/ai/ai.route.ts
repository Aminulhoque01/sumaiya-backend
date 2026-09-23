import { Router } from "express";
import { aiController } from "./ai.controller";

const aiRouter = Router();

aiRouter.get("/config", aiController.getConfig);
aiRouter.post("/", aiController.chat);

export default aiRouter;