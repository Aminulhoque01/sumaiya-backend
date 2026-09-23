import OpenAI from "openai";

import {
  IAIChatMessage,
  IAIChatRequest,
  IAIChatResponse,
} from "./ai.interface";

import { AI_SYSTEM_PROMPT } from "./ai.prompt";
import { getPortfolioContext } from "./ai.context";
import { getFallbackResponse } from "./ai.fallback";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getAIResponse = async (
  payload: IAIChatRequest
): Promise<IAIChatResponse> => {
  if (!payload.message?.trim()) {
    throw new Error("Message is required");
  }

  const portfolioContext = await getPortfolioContext();

  /**
   * -----------------------------------------
   * FREE MODE
   * -----------------------------------------
   *
   * No OpenAI API request will be made.
   */
  if (process.env.AI_MODE === "free") {
    return getFallbackResponse(
      payload.message,
      portfolioContext
    );
  }

  const conversation: IAIChatMessage[] =
    payload.conversation || [];

  const context = `
PORTFOLIO DATABASE CONTEXT:

${JSON.stringify(portfolioContext, null, 2)}

IMPORTANT:
Only use the information contained in this portfolio
database context when answering questions about Sumaiya.
Do not invent missing information.
`;

  const messages = [
    {
      role: "system" as const,
      content: `${AI_SYSTEM_PROMPT}

${context}`,
    },

    ...conversation.slice(-10).map((message) => ({
      role: message.role,
      content: message.content,
    })),

    {
      role: "user" as const,
      content: payload.message.trim(),
    },
  ];

  try {
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      input: messages,
    });

    /**
     * OpenAI response
     */
    return {
      reply:
        response.output_text ||
        getFallbackResponse(
          payload.message,
          portfolioContext
        ).reply,
      type: "TEXT",
    };
  } catch (error: any) {
    console.error(
      "OpenAI unavailable. Using fallback mode."
    );

    /**
     * If OpenAI has no credits / rate limit /
     * API error, use local portfolio chatbot.
     */
    return getFallbackResponse(
      payload.message,
      portfolioContext
    );
  }
};

export const aiService = {
  getAIResponse,
};