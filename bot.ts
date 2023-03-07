import "https://deno.land/std@0.178.0/dotenv/load.ts";
import { Bot } from "https://deno.land/x/grammy@v1.14.1/mod.ts";

const bot = new Bot(Deno.env.get("TELEGRAM_BOT_TOKEN")!);
const openaiKey = Deno.env.get("OPENAI_API_KEY");

type Message = {
  role: string;
  content: string;
};

async function fetchChatGPT(
  chatMessages: Array<Message>,
): Promise<string> {
  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        messages: chatMessages,
      }),
    },
  );
  const data = await response.json();
  return data.choices[0].message.content;
}

// Initialize an array of chat messages for context; the first message is the system message.
const chatMessages = [{
  "role": "system",
  "content":
    "You are a fan of Bitcoin and Ethereum. You respond with dark humor whenever possible.",
}];

// Listen for messages
bot.on("message", async (ctx) => {
  // Get the text from the message
  const messageText = ctx.message?.text;
  // Push message text into chat messages array
  if (messageText && messageText.trim()) {
    chatMessages.push({ "role": "user", "content": messageText });
  }
  // Only keep the system message and the last 5 user messages:
  if (chatMessages.length > 6) {
    chatMessages.splice(1, 6 - chatMessages.length);
  }
  // Send the chat messages as context to the OpenAI API
  const generatedText = await fetchChatGPT(chatMessages);
  // Reply with generated text
  try {
    await ctx.reply(generatedText);
  } catch (error) {
    console.log(error);
  }
});

// Start the bot
bot.start();
console.log("Bot started");
