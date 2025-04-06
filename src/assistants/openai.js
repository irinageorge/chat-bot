import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export class Assistant {
  #model;

  constructor(model = "gpt-4o-mini") {
    this.#model = model;
  }

  async chat(content, history) {
    try {
      const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const time = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const messages = [
        {
          role: "system",
          content: `You are aware that today's date is ${today}, and the current time is ${time}. Always use this information when the user asks for the date or time.`,
        },
        ...history,
        { role: "user", content },
      ];

      const result = await openai.chat.completions.create({
        model: this.#model,
        messages,
      });

      return result.choices[0].message.content;
    } catch (err) {
      console.error("OpenAI API error:", err);
      throw new Error("Failed to fetch response from AI.");
    }
  }

  async *chatStream(content, history) {
    const result = await openai.chat.completions.create({
      model: this.#model,
      messages: [...history, { content, role: "user" }],
      stream: true,
    });

    for await (const chunk of result) {
      yield chunk.choices[0]?.delta?.content || "";
    }
  }
}
