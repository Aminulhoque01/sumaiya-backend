import { Router } from "express";

import { authMiddleware } from "../../middleware/auth";
import { projectController } from "./project.controller";
import { upload } from "../../middleware/upload";

const projectRouter = Router();

// Public routes
projectRouter.get("/", projectController.getPublishedProjects);

projectRouter.get(
  "/all",
  authMiddleware,
  projectController.getAllProjects
);

projectRouter.get(
  "/featured",
  projectController.getFeaturedProjects
);

projectRouter.get(
  "/category/:categoryId",
  projectController.getProjectsByCategory
);

projectRouter.get(
  "/slug/:slug",
  projectController.getProjectBySlug
);

projectRouter.get(
  "/:id",
  projectController.getProjectById
);

// Protected admin routes
projectRouter.post(
  "/",
  authMiddleware,
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "gallery",
      maxCount: 10,
    },
  ]),
  projectController.createProject
);

projectRouter.patch(
  "/:id",
  authMiddleware,
  projectController.updateProject
);

projectRouter.delete(
  "/:id",
  authMiddleware,
  projectController.deleteProject
);

export default projectRouter;