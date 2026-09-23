import { Router } from "express";

import { authMiddleware } from "../../middleware/auth";

import {
  settingsController,
} from "./settings.controller";

const settingRouter = Router();

/**
 * Public
 */
settingRouter.get(
  "/",
  settingsController.getSettings
);

/**
 * Admin
 */
settingRouter.get(
  "/admin",
  authMiddleware,
  settingsController.getSettingsForAdmin
);

settingRouter.post(
  "/",
  authMiddleware,
  settingsController.createSettings
);

settingRouter.patch(
  "/",
  authMiddleware,
  settingsController.updateSettings
);

settingRouter.patch(
  "/status",
  authMiddleware,
  settingsController.toggleSettings
);

settingRouter.delete(
  "/",
  authMiddleware,
  settingsController.deleteSettings
);

export default settingRouter;