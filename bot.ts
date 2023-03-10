import { Bot } from "https://deno.land/x/grammy@v1.14.1/mod.ts";
import { Message, fetchChatGPT } from "./openai.ts";

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
    try {
      // Update the chat buffer with the user's message
      chatBuffer.push({ role: "user", content: messageText! });
      // Call the ChatGPT API to generate a response
      const generatedText = await fetchChatGPT([
        {
          role: "system",
          content: systemInstructions,
        },
        ...chatBuffer,
      ]);
      // Reply to the user
      await ctx.reply(generatedText!);
      // Update the chat buffer
      chatBuffer.push({ role: "assistant", content: generatedText! });
      // Remove old messages from the buffer
      if (chatBuffer.length > CHAT_TURN_BUFFER_SIZE*2) {
        chatBuffer.splice(0, 2);
      }
    } catch (error) {
      console.log(error);
    }
    console.log(chatBuffer);
  }
});

export default bot;
