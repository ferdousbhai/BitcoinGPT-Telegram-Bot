const openaiKey = Deno.env.get("OPENAI_API_KEY");

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function fetchChatGPT(
    messages: Array<Message>
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
            messages: messages
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
  