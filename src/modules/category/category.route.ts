import { Router } from "express";

import { categoryController } from "./category.controller";

import { authMiddleware } from "../../middleware/auth";

const categoryRouter = Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

categoryRouter.get("/", categoryController.getAllCategories);

categoryRouter.get(
  "/active",
  categoryController.getActiveCategories
);

categoryRouter.get(
  "/:id",
  categoryController.getCategoryById
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

categoryRouter.post(
  "/",
  authMiddleware,
  categoryController.createCategory
);

categoryRouter.patch(
  "/:id",
  authMiddleware,
  categoryController.updateCategory
);

categoryRouter.delete(
  "/:id",
  authMiddleware,
  categoryController.deleteCategory
);

export default categoryRouter;