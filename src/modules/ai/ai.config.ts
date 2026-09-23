import { IAIChatConfig } from "./ai.interface";

export const AI_CHAT_CONFIG: IAIChatConfig = {
  greeting:
    "Hi! 👋 I'm Sumaiya's Portfolio Assistant. How can I help you today?",

  quickQuestions: [
    {
      label: "View Projects",
      message: "Show me Sumaiya's portfolio projects.",
    },
    {
      label: "Services",
      message: "What services does Sumaiya offer?",
    },
    {
      label: "Skills",
      message: "What are Sumaiya's skills and tools?",
    },
    {
      label: "Experience",
      message: "Tell me about Sumaiya's professional experience.",
    },
    {
      label: "Contact",
      message: "How can I contact Sumaiya?",
    },
  ],
};