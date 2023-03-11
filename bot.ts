import { Bot } from "https://deno.land/x/grammy@v1.14.1/mod.ts";
import { fetchChatGPT, Message } from "./openai.ts";

const systemInstructions = await Deno.readTextFile("./system.txt");

const CHAT_TURN_BUFFER_SIZE = 2; // Number of recent turns to remember for chat context

const chatBuffer = [] as Message[]; // Buffer of recent messages

const bot = new Bot(Deno.env.get("TELEGRAM_BOT_TOKEN")!);

// Listen for messages
bot.on("message", async (ctx) => {
  const messageText = ctx.message?.text;
  if (messageText && messageText.trim()) {
    // Show that the bot is typing a response
    await ctx.api.sendChatAction(ctx.chat.id, "typing");
    // Update the chat buffer with the user's message
    chatBuffer.push({ role: "user", content: messageText! });
    console.log(chatBuffer); // Log the chat buffer
    // Call the ChatGPT API to generate a response
    const completionText = await fetchChatGPT([
      {
        role: "system",
        content: systemInstructions,
      },
      ...chatBuffer,
    ]);
    // Reply to the user
    await ctx.reply(completionText!);
    // Add response to the chat buffer
    chatBuffer.push({ role: "assistant", content: completionText! });
    // Remove old messages from the buffer
    if (chatBuffer.length > CHAT_TURN_BUFFER_SIZE * 2) {
      chatBuffer.splice(0, 2);
    }
  }
});

export default bot;
