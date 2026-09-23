export type AIMessageRole = "user" | "assistant";

export interface IAIChatMessage {
  role: AIMessageRole;
  content: string;
}

export interface IAIChatRequest {
  message: string;
  conversation?: IAIChatMessage[];
}

export type AIResponseType =
  | "TEXT"
  | "PROJECTS"
  | "SERVICES"
  | "SKILLS"
  | "EXPERIENCE"
  | "TESTIMONIALS"
  | "CONTACT";

export interface IAIChatResponse {
  reply: string;
  type?: AIResponseType;
  data?: unknown;
}

export interface IAIQuickQuestion {
  label: string;
  message: string;
}

export interface IAIChatConfig {
  greeting: string;
  quickQuestions: IAIQuickQuestion[];
}