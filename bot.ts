import { Bot } from "https://deno.land/x/grammy@v1.14.1/mod.ts";
import { Message, messagesToText } from "./openai.ts";
import { summarizeConversation, fetchChatGPTWithHistory } from "./memory.ts";

const systemPrompt = await Deno.readTextFile("./system.txt");

const character = "Satoshi Nakamoto";

const CHAT_TURN_BUFFER_SIZE = 2; // Number of recent turns to remember for chat context

const chatBuffer = [] as Message[]; // Buffer of recent messages

let history: string; // History of the conversation

const bot = new Bot(Deno.env.get("TELEGRAM_BOT_TOKEN")!);

// Listen for messages
bot.on("message", async (ctx) => {
  const messageText = ctx.message?.text;
  if (messageText && messageText.trim()) {
    // Show that the bot is typing a response
    await ctx.api.sendChatAction(ctx.chat.id, "typing");
    // Update the chat buffer with the user's message
    chatBuffer.push({ role: "user", content: messageText! });
    // Call the ChatGPT API to generate a response
    const completionText = await fetchChatGPTWithHistory(
      character,
      history,
      [{ role: "system", content: systemPrompt }, ...chatBuffer,]
      );
    // Reply to the user
    await ctx.reply(completionText!);
    // Add response to the chat buffer
    chatBuffer.push({ role: "assistant", content: completionText! });
    console.log('*********************'+ '\n' + messagesToText(chatBuffer)); // Log the chat buffer
    // Update the history with the user's message
    if (chatBuffer.length > CHAT_TURN_BUFFER_SIZE * 2) {
      const lostChat = chatBuffer.splice(0, 2); // Remove the oldest 2 messages and save them for summarization
      const summaryCompletion = await summarizeConversation(history, lostChat);
      history = summaryCompletion!;
    console.log('\n' + history);
    }
  }
});

export default bot;
