import { fetchChatGPT, Message, messagesToText } from "./openai.ts";
import { character, systemPrompt } from "./config.ts";


export async function summarizeConversation(
  summary: string,
  newMessages: Message[],
): Promise<string | undefined> {
  const newMessageText = messagesToText(character, newMessages);
  const completionText = await fetchChatGPT([
    {
      role: "system",
      content:
        `Progressively summarize the conversation provided, adding onto the previous summary returning a new summary.
        Current summary: ${summary}
        New lines of conversation:
        ${newMessageText}
        
        New summary:
        `,
    },
  ]);
  return completionText;
}

export async function fetchChatGPTWithHistory(
  character: string,
  history: string,
  buffer: Message[],
): Promise<string | undefined> {
  const completionText = await fetchChatGPT([
    {
      role: "system",
      content: systemPrompt +
        `\nThe following is a friendly conversation between ${character} and a user. ${character} provides lots of specific details from this context.
        Current conversation: ${history}
        New lines of conversation:
        `,
    },
    ...buffer,
  ]);
  return completionText;
}