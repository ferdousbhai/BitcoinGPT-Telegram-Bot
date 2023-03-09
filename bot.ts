import { Bot } from "https://deno.land/x/grammy@v1.14.1/mod.ts";
import { fetchChatGPT } from "./openai.ts";

// Read the system prompt from a text file
const systemPrompt = await Deno.readTextFile("./system.txt");

// Initialize an array of chat messages for prompt context; the first message is the system message.
const chatMessages = [{
  role: "system",
  content: systemPrompt,
}];

const CHAT_CONTEXT_LENGTH = 3; // Number of messages to use as context for the chat (not including the system message)

const bot = new Bot(Deno.env.get("TELEGRAM_BOT_TOKEN")!);

// Keep track of API calls to keep costs down.
let apiCallCounter = 0;
const apiCallLimit = 10000;

// Start command
bot.command("start", (ctx) => ctx.reply("Hello! I'm Satoshi Nakamoto, the creator of Bitcoin. Ask me anything!"));

// Listen for messages
bot.on("message", async (ctx) => {
  const messageText = ctx.message?.text;
  // Push message text into chat messages array
  if (messageText && messageText.trim()) {
    chatMessages.push({ "role": "user", "content": messageText });
  }
  if (chatMessages.length > CHAT_CONTEXT_LENGTH + 1) {
    chatMessages.splice(1, chatMessages.length - CHAT_CONTEXT_LENGTH - 1);
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