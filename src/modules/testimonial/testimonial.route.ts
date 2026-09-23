import { Router } from "express";

import { authMiddleware } from "../../middleware/auth";
import { upload } from "../../middleware/upload";

import { testimonialController } from "./testimonial.controller";

const testimonialRouter = Router();

// ====================
// Public Routes
// ====================

testimonialRouter.get(
  "/",
  testimonialController.getActiveTestimonials
);

testimonialRouter.get(
  "/featured",
  testimonialController.getFeaturedTestimonials
);

// ====================
// Admin Routes
// ====================

testimonialRouter.get(
  "/all",
  authMiddleware,
  testimonialController.getAllTestimonials
);

testimonialRouter.post(
  "/",
  authMiddleware,
  upload.single("avatar"),
  testimonialController.createTestimonial
);

testimonialRouter.patch(
  "/:id",
  authMiddleware,
  upload.single("avatar"),
  testimonialController.updateTestimonial
);

testimonialRouter.delete(
  "/:id",
  authMiddleware,
  testimonialController.deleteTestimonial
);

// ====================
// Public Single
// ====================

testimonialRouter.get(
  "/:id",
  testimonialController.getTestimonialById
);

export default testimonialRouter;