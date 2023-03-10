import { fetchChatGPT, Message } from "../openai/openai.ts";
import { systemPrompt } from "../../config.ts";

export function messagesToText(messages: Message[]): string {
  return messages.map((message) => {
    if (message.role === "assistant") {
      return `You: ${message.content}`;
    } else if (message.role === "user") {
      return `${message.role}: ${message.content}`;
    } else {
      return "";
    }
  }).join("\n");
}

export async function summarizeConversation(
  summary: string,
  newMessages: Message[],
): Promise<string> {
  const newMessageText = messagesToText(newMessages);
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
  return completionText!;
}

export async function fetchChatGPTWithMemory(
  memory: string,
  buffer: Message[],
): Promise<string> {
  const completionText = await fetchChatGPT([
    {
      role: "system",
      content: systemPrompt +
        `\nThe following is a friendly conversation between you and a user. You provides lots of specific details from this context.
        Current conversation: ${memory}
        New lines of conversation:
        `,
    },
    ...buffer,
  ]);
  return completionText!;
}