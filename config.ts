import "https://deno.land/std@0.178.0/dotenv/load.ts"; // Only needed for local development

export const openaiKey = Deno.env.get("OPENAI_API_KEY");

export const character = "Satoshi Nakamoto";
export const systemPrompt = await Deno.readTextFile(
  `./characters/${character}.txt`,
);
export const CHAT_TURN_BUFFER_SIZE = 2; // Number of recent turns to remember for chat context
