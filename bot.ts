import { Bot } from "https://deno.land/x/grammy@v1.14.1/mod.ts";

const openaiKey = Deno.env.get("OPENAI_API_KEY");
const bot = new Bot(Deno.env.get("TELEGRAM_BOT_TOKEN")!);

type Message = {
  role: string;
  content: string;
};

// Initialize an array of chat messages for context; the first message is the system message.
const chatMessages = [{
  "role": "system",
  "content": "You are a fan of Bitcoin. You always respond with dark humor.",
}];

// Keep track of API calls to keep costs down.
let apiCallCounter = 0;
const apiCallLimit = 10000;

async function fetchChatGPT(
  chatMessages: Array<Message>,
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
          "model": "gpt-3.5-turbo",
          messages: chatMessages,
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

// Listen for messages
bot.on("message", async (ctx) => {
  const messageText = ctx.message?.text;
  // Push message text into chat messages array
  if (messageText && messageText.trim()) {
    chatMessages.push({ "role": "user", "content": messageText });
  }
  // Only keep the system message but set it up so that this can be easily changed to keep more messages later.
  if (chatMessages.length > 2) {
    chatMessages.splice(1, chatMessages.length - 2);
  }
  console.log(`Chat messages: (${chatMessages.length})`);
  console.log(chatMessages);
  // Send the chat messages as context to the OpenAI API
  const generatedText = await fetchChatGPT(chatMessages);
  // Reply with generated text
  try {
    await ctx.reply(generatedText!);
    chatMessages.push({ "role": "assistant", "content": generatedText! });
  } catch (error) {
    console.log(error);
  }
  // Display the number of API calls
  console.log(`Number of API calls so far: ${++apiCallCounter}`);
  // Check if we've hit the API call limit
  if (apiCallCounter >= apiCallLimit) {
    console.log(`API call limit reached: ${apiCallLimit}`);
    return;
  }
});

export default bot;