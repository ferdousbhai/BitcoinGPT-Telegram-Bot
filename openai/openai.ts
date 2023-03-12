import { openaiKey } from "../config.ts";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export function messagesToText(character: string, messages: Message[]): string {
  return messages.map((message) => {
    if (message.role === "assistant") {
      return `${character}: ${message.content}`;
    } else {
      return `${message.role}: ${message.content}`;
    }
  }).join("\n");
}

export async function fetchChatGPT(
    promptMessages: Array<Message>
  ): Promise<string|undefined> {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openaiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: promptMessages
          }),
        },
      );
      const data = await response.json();
      return data.choices[0].message.content;
    }
    catch (error) {
      console.log(error);
    }
  }