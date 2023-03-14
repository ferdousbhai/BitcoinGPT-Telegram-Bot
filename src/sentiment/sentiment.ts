import { fetchChatGPT, Message } from "../openai/openai.ts";

export async function getSentiment(inputMessages: Message[]): Promise<string> {
  const sentiment = await fetchChatGPT([
    {
      role: "system",
      content:
        "Classify the overall sentiment of the following conversation and express it in the form of emojis. Respond with emojis on a single line. DO NOT INCLUDE ANY TEXT.",
    },
    ...inputMessages,
  ], 0);
  return sentiment!;
}
