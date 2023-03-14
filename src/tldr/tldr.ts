import { fetchChatGPT } from "../openai/openai.ts";

export async function getTldr(text: string): Promise<string> {
  const tldr = await fetchChatGPT([{ role: "user", content: text + "\n\nTl;dr"}]);
  return tldr!;
}