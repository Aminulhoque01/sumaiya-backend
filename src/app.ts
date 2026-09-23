import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRouter from "./modules/auth/auth.route";
import categoryRouter from "./modules/category/category.route";
import projectRouter from "./modules/project/project.route";

import ServiceRouter from "./modules/service/service.route";
import skillRouter from "./modules/skill/skill.route";
import experienceRouter from "./modules/experience/experience.route";
import testimonialRouter from "./modules/testimonial/testimonial.route";
import profileRouter from "./modules/profile/profile.route";
import contactRouter from "./modules/contact/contact.route";
import aiRouter from "./modules/ai/ai.route";
import settingRouter from "./modules/settings/settings.route";
import dashboardRouter from "./modules/dashboard/dashboard.route";
import { errorHandler } from "./middleware/errorHandler";

 

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Sumaiya Portfolio API is running",
  });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/projects", projectRouter);
app.use("/api/services", ServiceRouter);
app.use("/api/skills", skillRouter);
app.use("/api/experiences", experienceRouter);
app.use("/api/testimonials", testimonialRouter);
app.use("/api/profile", profileRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/ai-chat", aiRouter);
app.use("/api/settings", settingRouter);
app.use("/api/dashboard", dashboardRouter);

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

export default app;