import {
  AIResponseType,
  IAIChatResponse,
} from "./ai.interface";

interface PortfolioContext {
  profile: any;
  projects: any[];
  categories: any[];
  services: any[];
  skills: any[];
  experiences: any[];
  testimonials: any[];
}

const normalizeText = (text: string): string => {
  return text.toLowerCase().trim();
};

const response = (
  reply: string,
  type: AIResponseType = "TEXT",
  data?: unknown
): IAIChatResponse => {
  return {
    reply,
    type,
    ...(data !== undefined ? { data } : {}),
  };
};

const getFallbackResponse = (
  message: string,
  context: PortfolioContext
): IAIChatResponse => {
  const query = normalizeText(message);

  const name = context.profile?.name || "Sumaiya";

  // Greeting
  if (
    /^(hi|hello|hey|salam|assalamualaikum|good morning|good afternoon|good evening)\b/i.test(
      query
    )
  ) {
    return response(
      `Hello! 👋 I'm ${name}'s Portfolio Assistant. I can help you explore her services, projects, skills, experience, and contact information. What would you like to know?`
    );
  }

  // Services
  if (
    query.includes("service") ||
    query.includes("services") ||
    query.includes("offer") ||
    query.includes("what does she do")
  ) {
    if (!context.services.length) {
      return response(
        `${name}'s service information is not available at the moment.`,
        "SERVICES",
        []
      );
    }

    const services = context.services.map((service) => ({
      id: service._id,
      title: service.title,
      slug: service.slug,
      shortDescription: service.shortDescription,
      description: service.description,
      features: service.features || [],
      image: service.image || null,
    }));

    const servicesText = services
      .map(
        (service) =>
          `• ${service.title}: ${
            service.shortDescription || ""
          }`
      )
      .join("\n");

    return response(
      `${name} offers the following services:\n\n${servicesText}\n\nIf you'd like to discuss a project, you can use the contact form on the website.`,
      "SERVICES",
      services
    );
  }

  // Skills
  if (
    query.includes("skill") ||
    query.includes("skills") ||
    query.includes("tools") ||
    query.includes("software")
  ) {
    if (!context.skills.length) {
      return response(
        `${name}'s skills information is not available at the moment.`,
        "SKILLS",
        []
      );
    }

    const groupedSkills = context.skills.reduce(
      (groups: Record<string, string[]>, skill) => {
        const category = skill.category || "Other";

        if (!groups[category]) {
          groups[category] = [];
        }

        groups[category].push(skill.name);

        return groups;
      },
      {}
    );

    const skillsText = Object.entries(groupedSkills)
      .map(
        ([category, skills]) =>
          `• ${category}: ${(skills as string[]).join(", ")}`
      )
      .join("\n");

    return response(
      `${name}'s skills and tools include:\n\n${skillsText}`,
      "SKILLS",
      groupedSkills
    );
  }

  // Projects
  if (
    query.includes("project") ||
    query.includes("portfolio") ||
    query.includes("design work")
  ) {
    if (!context.projects.length) {
      return response(
        `${name}'s portfolio projects are not available at the moment.`,
        "PROJECTS",
        []
      );
    }

    const projects = context.projects.slice(0, 8).map((project) => ({
      id: project._id,
      title: project.title,
      slug: project.slug,
      shortDescription: project.shortDescription,
      thumbnail: project.thumbnail || null,
      category:
        typeof project.category === "object"
          ? project.category
          : null,
      featured: project.featured,
      projectUrl: project.projectUrl,
      behanceUrl: project.behanceUrl,
      dribbbleUrl: project.dribbbleUrl,
    }));

    const projectsText = projects
      .map(
        (project) =>
          `• ${project.title}: ${
            project.shortDescription || ""
          }`
      )
      .join("\n");

    return response(
      `Here are some of ${name}'s portfolio projects:\n\n${projectsText}\n\nYou can explore the full portfolio on the website.`,
      "PROJECTS",
      projects
    );
  }

  // Categories
  if (
    query.includes("category") ||
    query.includes("categories") ||
    query.includes("type of design")
  ) {
    if (!context.categories.length) {
      return response(
        `Portfolio categories are not available at the moment.`,
        "TEXT",
        []
      );
    }

    const categories = context.categories.map((category) => ({
      id: category._id,
      name: category.name,
      slug: category.slug,
      description: category.description,
    }));

    const categoriesText = categories
      .map((category) => `• ${category.name}`)
      .join("\n");

    return response(
      `The portfolio includes these design categories:\n\n${categoriesText}`,
      "TEXT",
      categories
    );
  }

  // Experience
  if (
    query.includes("experience") ||
    query.includes("career") ||
    query.includes("worked") ||
    query.includes("work history")
  ) {
    if (!context.experiences.length) {
      return response(
        `${name}'s experience information is not available at the moment.`,
        "EXPERIENCE",
        []
      );
    }

    const experiences = context.experiences.map(
      (experience) => ({
        id: experience._id,
        company: experience.company,
        position: experience.position,
        employmentType: experience.employmentType,
        location: experience.location,
        startDate: experience.startDate,
        endDate: experience.endDate,
        isCurrent: experience.isCurrent,
        description: experience.description,
        responsibilities:
          experience.responsibilities || [],
        technologies: experience.technologies || [],
      })
    );

    const experienceText = experiences
      .map((experience) => {
        const startDate = experience.startDate
          ? new Date(
              experience.startDate
            ).getFullYear()
          : "";

        const endDate = experience.isCurrent
          ? "Present"
          : experience.endDate
          ? new Date(
              experience.endDate
            ).getFullYear()
          : "";

        return `• ${experience.position} at ${
          experience.company
        } (${startDate}${
          endDate ? ` - ${endDate}` : ""
        })`;
      })
      .join("\n");

    return response(
      `${name}'s professional experience:\n\n${experienceText}`,
      "EXPERIENCE",
      experiences
    );
  }

  // Testimonials
  if (
    query.includes("testimonial") ||
    query.includes("testimonials") ||
    query.includes("client review") ||
    query.includes("reviews") ||
    query.includes("feedback")
  ) {
    if (!context.testimonials.length) {
      return response(
        `There are no testimonials available at the moment.`,
        "TESTIMONIALS",
        []
      );
    }

    const testimonials = context.testimonials
      .slice(0, 5)
      .map((testimonial) => ({
        id: testimonial._id,
        name: testimonial.name,
        role: testimonial.role,
        company: testimonial.company,
        message: testimonial.message,
        rating: testimonial.rating,
        project: testimonial.project,
        avatar: testimonial.avatar || null,
      }));

    const testimonialsText = testimonials
      .map(
        (testimonial) =>
          `• "${testimonial.message}" — ${
            testimonial.name
          }`
      )
      .join("\n\n");

    return response(
      `Here are some testimonials:\n\n${testimonialsText}`,
      "TESTIMONIALS",
      testimonials
    );
  }

  // About / Profile
  if (
    query.includes("about") ||
    query.includes("who is sumaiya") ||
    query.includes("who is she") ||
    query.includes("tell me about her") ||
    query.includes("profile")
  ) {
    if (!context.profile) {
      return response(
        `Profile information is not available at the moment.`
      );
    }

    return response(
      `${context.profile.name} is a ${
        context.profile.title ||
        "creative professional"
      }.

${
  context.profile.shortBio ||
  context.profile.bio ||
  "You can explore her portfolio to learn more about her work."
}`
    );
  }

  // Contact
  if (
    query.includes("contact") ||
    query.includes("email") ||
    query.includes("hire") ||
    query.includes("work with") ||
    query.includes("reach") ||
    query.includes("whatsapp")
  ) {
    const profile = context.profile;

    if (!profile) {
      return response(
        `Contact information is not available at the moment.`,
        "CONTACT"
      );
    }

    const contactItems: string[] = [];

    if (profile.email) {
      contactItems.push(`Email: ${profile.email}`);
    }

    if (profile.phone) {
      contactItems.push(`Phone: ${profile.phone}`);
    }

    if (profile.location) {
      contactItems.push(
        `Location: ${profile.location}`
      );
    }

    if (profile.website) {
      contactItems.push(
        `Website: ${profile.website}`
      );
    }

    if (contactItems.length === 0) {
      return response(
        `You can use the Contact section on the website to get in touch with ${name}.`,
        "CONTACT"
      );
    }

    return response(
      `You can contact ${name} through:\n\n${contactItems
        .map((item) => `• ${item}`)
        .join("\n")}\n\nYou can also use the Contact form on the website to send a project inquiry.`,
      "CONTACT",
      {
        email: profile.email || null,
        phone: profile.phone || null,
        location: profile.location || null,
        website: profile.website || null,
        socialLinks: profile.socialLinks || null,
      }
    );
  }

  // Featured projects
  if (
    query.includes("featured") ||
    query.includes("best project")
  ) {
    const featuredProjects =
      context.projects.filter(
        (project) => project.featured
      );

    if (!featuredProjects.length) {
      return response(
        `There are currently no featured projects available.`,
        "PROJECTS",
        []
      );
    }

    const projects = featuredProjects
      .slice(0, 6)
      .map((project) => ({
        id: project._id,
        title: project.title,
        slug: project.slug,
        shortDescription:
          project.shortDescription,
        thumbnail: project.thumbnail || null,
        category:
          typeof project.category === "object"
            ? project.category
            : null,
        projectUrl: project.projectUrl,
        behanceUrl: project.behanceUrl,
        dribbbleUrl: project.dribbbleUrl,
      }));

    const text = projects
      .map((project) => `• ${project.title}`)
      .join("\n");

    return response(
      `Featured projects include:\n\n${text}`,
      "PROJECTS",
      projects
    );
  }

  // Default
  return response(
    `I'm ${name}'s Portfolio Assistant. I can help you with:

• Portfolio projects
• Services
• Skills & tools
• Professional experience
• Testimonials
• About ${name}
• Contact information

Try asking something like "What services does she offer?" or "Show me her projects."`
  );
};

export { getFallbackResponse };