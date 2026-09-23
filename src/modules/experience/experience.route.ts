import { Router } from "express";

import { authMiddleware } from "../../middleware/auth";
import { experienceController } from "./experience.controller";

const experienceRouter = Router();

// ====================
// Public Routes
// ====================

experienceRouter.get(
  "/",
  experienceController.getActiveExperiences
);

// ====================
// Admin Routes
// ====================

experienceRouter.get(
  "/all",
  authMiddleware,
  experienceController.getAllExperiences
);

experienceRouter.post(
  "/",
  authMiddleware,
  experienceController.createExperience
);

experienceRouter.patch(
  "/:id",
  authMiddleware,
  experienceController.updateExperience
);

experienceRouter.delete(
  "/:id",
  authMiddleware,
  experienceController.deleteExperience
);

// ====================
// Public Single Experience
// ====================

experienceRouter.get(
  "/:id",
  experienceController.getExperienceById
);

export default experienceRouter;