import { GoogleGenAI, Type, Chat } from "@google/genai";

// Initialize the API client safely
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const improveText = async (text: string, type: 'grammar' | 'professional' | 'ats'): Promise<string> => {
  const ai = getClient();
  if (!ai) return "AI Service Unavailable: Missing API Key";

  let prompt = "";
  if (type === 'grammar') {
    prompt = `Fix grammar and spelling for the following resume text. Keep it professional and concise:\n\n"${text}"`;
  } else if (type === 'professional') {
    prompt = `Rewrite the following resume text to be more professional, using action verbs and clear metrics where possible. Convert to bullet points if appropriate:\n\n"${text}"`;
  } else if (type === 'ats') {
    prompt = `Optimize the following resume text for ATS (Applicant Tracking Systems). Include relevant keywords for a general professional role if specific ones aren't provided. Ensure standard formatting:\n\n"${text}"`;
  }

  try {
    // Upgraded to pro model for complex text tasks like resume writing
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text; // Fallback to original
  }
};

export const createChatSession = () => {
  const ai = getClient();
  if (!ai) return null;

  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are an AI assistant for a Resume Builder app. Help the user create their resume content and navigate the app. \n" +
        "The app has 6 steps: Contacts (0), Experience (1), Education (2), Skills (3), Summary (4), Finalize (5). \n" +
        "If the user wants to navigate to a specific section, set 'navigation_step' to the corresponding index (0-5). \n" +
        "If the user asks for help writing content (like a summary, job description, or skills), provide the text in 'response'. \n" +
        "Keep responses helpful, encouraging, and concise.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          response: { type: Type.STRING },
          navigation_step: { type: Type.INTEGER, nullable: true },
        },
        required: ["response"]
      }
    }
  });
};

export const sendChatMessage = async (chat: Chat, message: string, currentContext: string) => {
    try {
        const msg = `[Current Resume Context Summary: ${currentContext}] \n User Query: ${message}`;
        const result = await chat.sendMessage({ message: msg });
        const text = result.text;
        if (!text) throw new Error("No response from AI");
        return JSON.parse(text);
    } catch (e) {
        console.error("Chat Error", e);
        return { response: "I'm having trouble connecting right now. Please try again.", navigation_step: null };
    }
}