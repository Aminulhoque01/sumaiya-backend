import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { upload } from "../../middleware/upload";
import { profileController } from "./profile.controller";

const profileRouter = Router();

// Public
profileRouter.get("/", profileController.getProfile);

// Admin
profileRouter.get(
  "/admin",
  authMiddleware,
  profileController.getProfileForAdmin
);

profileRouter.post(
  "/",
  authMiddleware,
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  profileController.createProfile
);

profileRouter.patch(
  "/",
  authMiddleware,
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  profileController.updateProfile
);

profileRouter.delete(
  "/",
  authMiddleware,
  profileController.deleteProfile
);

// Optional ID-based public lookup
profileRouter.get("/:id", profileController.getProfileById);

export default profileRouter;