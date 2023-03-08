const openaiKey = Deno.env.get("OPENAI_API_KEY");

type Message = {
    role: string;
    content: string;
  };

export async function fetchChatGPT(
    chatMessages: Array<Message>,
    temperature=1.8
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
            messages: chatMessages,
            temperature: temperature,
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
  