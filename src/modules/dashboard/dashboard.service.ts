import { ProjectModel } from "../project/project.model";
import { ServiceModel } from "../service/service.model";
import { SkillModel } from "../skill/skill.model";
import { ExperienceModel } from "../experience/experience.model";
import { TestimonialModel } from "../testimonial/testimonial.model";
import { ContactModel } from "../contact/contact.model";

const getDashboardStats = async () => {
  const [
    totalProjects,
    publishedProjects,
    featuredProjects,
    draftProjects,

    totalServices,
    totalSkills,
    totalExperiences,
    totalTestimonials,

    totalContacts,
    newContacts,
  ] = await Promise.all([
    /**
     * Projects
     */
    ProjectModel.countDocuments(),

    ProjectModel.countDocuments({
      isPublished: true,
    }),

    ProjectModel.countDocuments({
      featured: true,
    }),

    ProjectModel.countDocuments({
      isPublished: false,
    }),

    /**
     * Other content
     */
    ServiceModel.countDocuments(),

    SkillModel.countDocuments(),

    ExperienceModel.countDocuments(),

    TestimonialModel.countDocuments(),

    /**
     * Contacts
     */
    ContactModel.countDocuments(),

    ContactModel.countDocuments({
      status: "NEW",
    }),
  ]);

  return {
    projects: {
      total: totalProjects,
      published: publishedProjects,
      featured: featuredProjects,
      draft: draftProjects,
    },

    services: totalServices,

    skills: totalSkills,

    experiences: totalExperiences,

    testimonials: totalTestimonials,

    contacts: {
      total: totalContacts,
      new: newContacts,
    },
  };
};

export const dashboardService = {
  getDashboardStats,
};