import { ProfileModel } from "../profile/profile.model";
import { ProjectModel } from "../project/project.model";
import { CategoryModel } from "../category/category.model";
import { ServiceModel } from "../service/service.model";
import { SkillModel } from "../skill/skill.model";
import { ExperienceModel } from "../experience/experience.model";
import { TestimonialModel } from "../testimonial/testimonial.model";

export const getPortfolioContext = async () => {
  const [
    profile,
    projects,
    categories,
    services,
    skills,
    experiences,
    testimonials,
  ] = await Promise.all([
    ProfileModel.findOne({ isActive: true }).lean(),

    ProjectModel.find({
      isPublished: true,
    })
      .populate("category", "name slug description")
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .lean(),

    CategoryModel.find({
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean(),

    ServiceModel.find({
      isActive: true,
    })
      .sort({ order: 1, createdAt: -1 })
      .lean(),

    SkillModel.find({
      isActive: true,
    })
      .sort({ order: 1, createdAt: -1 })
      .lean(),

    ExperienceModel.find({
      isActive: true,
    })
      .sort({ order: 1, startDate: -1 })
      .lean(),

    TestimonialModel.find({
      isActive: true,
    })
      .sort({ isFeatured: -1, order: 1, createdAt: -1 })
      .lean(),
  ]);

  return {
    profile,
    projects,
    categories,
    services,
    skills,
    experiences,
    testimonials,
  };
};