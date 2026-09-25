import { Router } from "express";

import { authMiddleware } from "../../middleware/auth";

import { contactController } from "./contact.controller";

const contactRouter = Router();

/*
 * Public
 */
contactRouter.post(
  "/",
  contactController.createContact
);

/*
 * Admin
 */
contactRouter.get(
  "/",
  authMiddleware,
  contactController.getAllContacts
);

contactRouter.get(
  "/:id",
  authMiddleware,
  contactController.getContactById
);

contactRouter.patch(
  "/:id",
  authMiddleware,
  contactController.updateContact
);

/*
 * Reply to visitor email
 */
contactRouter.post(
  "/:id",
  authMiddleware,
  contactController.replyToContact
);

contactRouter.delete(
  "/:id",
  authMiddleware,
  contactController.deleteContact
);

export default contactRouter;