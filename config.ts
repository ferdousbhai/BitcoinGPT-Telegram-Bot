import "https://deno.land/std@0.178.0/dotenv/load.ts"; // Only needed for local development

export const openaiKey = Deno.env.get("OPENAI_API_KEY");

export const character = "Satoshi Nakamoto";
export const systemPrompt = await Deno.readTextFile(
  `./characters/${character}.txt`,
);
export const CHAT_CONTEXT_SIZE = 4; // Number of recent messages to remember for chat context
