import { Router } from "express";

import { authMiddleware } from "../../middleware/auth";
import { upload } from "../../middleware/upload";

import { serviceController } from "./service.controller";

const ServiceRouter = Router();

// ===============================
// Public Routes
// ===============================

ServiceRouter.get(
  "/",
  serviceController.getActiveServices
);

ServiceRouter.get(
  "/slug/:slug",
  serviceController.getServiceBySlug
);

// ===============================
// Admin Routes
// ===============================

ServiceRouter.get(
  "/all",
  authMiddleware,
  serviceController.getAllServices
);

ServiceRouter.post(
  "/",
  authMiddleware,
  upload.single("image"),
  serviceController.createService
);

ServiceRouter.patch(
  "/:id",
  authMiddleware,
  upload.single("image"),
  serviceController.updateService
);

ServiceRouter.delete(
  "/:id",
  authMiddleware,
  serviceController.deleteService
);

// Public single service
ServiceRouter.get(
  "/:id",
  serviceController.getServiceById
);

export default ServiceRouter;