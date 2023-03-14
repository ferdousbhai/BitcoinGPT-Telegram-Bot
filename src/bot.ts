import { Bot } from "https://deno.land/x/grammy@v1.14.1/mod.ts";
import { Message } from "./openai/openai.ts";
import {
  messagesToText,
  fetchChatGPTWithMemory,
  summarizeConversation,
} from "./memory/memory.ts";
import { CHAT_CONTEXT_SIZE, systemPrompt } from "../config.ts";


const chatBuffer = [] as Message[]; // Recent messages

let history: string; // Summary of the older messages

const bot = new Bot(Deno.env.get("TELEGRAM_BOT_TOKEN")!);


// Listen for messages
bot.on("message", async (ctx) => {
  const messageText = ctx.message?.text?.trim();
  if (messageText) {
    // Update the chat buffer with the user's message
    chatBuffer.push({ role: "user", content: messageText! });
    // Handle the user's message, send a response and return the response text
    const responseText = await sendChatResponse(ctx);
    // Add response to the chat buffer
    chatBuffer.push({ role: "assistant", content: responseText });
    // Update the history with the user's message
    if (chatBuffer.length > CHAT_CONTEXT_SIZE) {
      const oldMessages = chatBuffer.splice(0, 2); // Remove the last two messages and save them for summarization
      history = await summarizeConversation(history, oldMessages);
    }
    // Log the conversation
    console.log("*********************\n");
    console.log(messagesToText(chatBuffer));
    if (history) console.log("Summary:\n" + history);
  }
});

export default bot;

// deno-lint-ignore no-explicit-any
async function sendChatResponse(ctx: any): Promise<string> {
  // Show the typing indicator
  await ctx.api.sendChatAction(ctx.chat.id, "typing");
  // Call the ChatGPT API to generate a response
  const completionText = await fetchChatGPTWithMemory(
    history,
    [{ role: "system", content: systemPrompt }, ...chatBuffer],
  );
  // Reply to the user
  await ctx.reply(completionText);
  // Return the response text
  return completionText;
}
