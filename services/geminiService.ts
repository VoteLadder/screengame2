
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getGeminiCommentary = async (score: number, highscore: number) => {
  if (!API_KEY) return "AI Assistant: Connect API Key for live commentary.";

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a senior developer reviewing a junior's performance in a hand-tracking 'ball-hitting' game set in VS Code. 
      The user just finished a session.
      Score: ${score}
      High Score: ${highscore}
      Provide a short, 1-2 sentence snarky but encouraging 'code review' comment about their performance. Use dev terminology (refactoring, bugs, latency, etc.).`,
    });

    return response.text || "Keep coding, you'll get there.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The linter found some errors in your coordination.";
  }
};
