import { Request, Response } from "express";

import { IAIChatRequest } from "./ai.interface";
import { aiService } from "./ai.service";
import { AI_CHAT_CONFIG } from "./ai.config";

const chat = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payload = req.body as IAIChatRequest;

    const result = await aiService.getAIResponse(
      payload
    );

    res.status(200).json({
      success: true,
      message: "AI response generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("AI Chat Error:", error);

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to generate AI response",
    });
  }
};

const getConfig = async (
  _req: Request,
  res: Response
): Promise<void> => {
  res.status(200).json({
    success: true,
    message: "AI chatbot configuration retrieved successfully",
    data: AI_CHAT_CONFIG,
  });
};

export const aiController = {
  chat,
  getConfig,
};