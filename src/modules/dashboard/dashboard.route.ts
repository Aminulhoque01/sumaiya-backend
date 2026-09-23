import { Router } from "express";

import { authMiddleware } from "../../middleware/auth";

import {
  dashboardController,
} from "./dashboard.controller";

const dashboardRouter = Router();

dashboardRouter.get(
  "/stats",
  authMiddleware,
  dashboardController.getDashboardStats
);

export default dashboardRouter;