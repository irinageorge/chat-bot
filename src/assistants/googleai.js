import { GoogleGenerativeAI } from "@google/generative-ai";

const googleai = new GoogleGenerativeAI(import.meta.env.VITE_GOGGLE_AI_API_KEY);

export class Assistant {
  #chat;

  constructor(model = "gemini-1.5-flash") {
    try {
      const gemini = googleai.getGenerativeModel({ model });
      this.#chat = gemini.startChat({ history: [] });
    } catch (err) {
      console.error("Failed to initialize Gemini chat:", err);
      throw new Error("Gemini chat initialization failed.");
    }
  }

  async chat(content) {
    try {
      const result = await this.#chat.sendMessage(content);
      return result.response.text();
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error(
        error?.message || "An error occurred while communicating with Gemini AI."
      );
    }
  }
}
