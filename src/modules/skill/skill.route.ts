import { Router } from "express";

import { authMiddleware } from "../../middleware/auth";
import { skillController } from "./skill.controller";

const skillRouter = Router();

// ====================
// Public Routes
// ====================

skillRouter.get(
  "/",
  skillController.getActiveSkills
);

skillRouter.get(
  "/category/:category",
  skillController.getSkillsByCategory
);

skillRouter.get(
  "/slug/:slug",
  skillController.getSkillBySlug
);

// ====================
// Admin Routes
// ====================

skillRouter.get(
  "/all",
  authMiddleware,
  skillController.getAllSkills
);

skillRouter.post(
  "/",
  authMiddleware,
  skillController.createSkill
);

skillRouter.patch(
  "/:id",
  authMiddleware,
  skillController.updateSkill
);

skillRouter.delete(
  "/:id",
  authMiddleware,
  skillController.deleteSkill
);

// ====================
// Public Single Skill
// ====================

skillRouter.get(
  "/:id",
  skillController.getSkillById
);

export default skillRouter;