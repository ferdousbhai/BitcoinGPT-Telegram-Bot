import { Bot } from "https://deno.land/x/grammy@v1.14.1/mod.ts";
import { fetchChatGPT } from "./openai.ts";


const bot = new Bot(Deno.env.get("TELEGRAM_BOT_TOKEN")!);

// Initialize an array of chat messages for context; the first message is the system message.
const chatMessages = [{
  "role": "system",
  "content": "You are a fan of Bitcoin. You always respond with dark humor.",
}];

// Keep track of API calls to keep costs down.
let apiCallCounter = 0;
const apiCallLimit = 10000;

// Start command
bot.command("start", (ctx) => ctx.reply("Hello! I'm a bot that uses ChatGPT to generate responses to any Bitcoin-specific questions. I'm a bit quirky and still learning, so please be patient with me."));

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