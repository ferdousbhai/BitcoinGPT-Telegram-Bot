import { Bot } from "https://deno.land/x/grammy@v1.14.1/mod.ts";
import { Message, messagesToText } from "./openai/openai.ts";
import { summarizeConversation, convertHistoryToPerspective, fetchChatGPTWithHistory } from "./memory/memory.ts";
import { character, systemPrompt, CHAT_TURN_BUFFER_SIZE } from "./config.ts";


const chatBuffer = [] as Message[]; // Recent messages

let history: string; // Summary of the older messages

const bot = new Bot(Deno.env.get("TELEGRAM_BOT_TOKEN")!);


bot.command("startover", async (ctx) => {
  chatBuffer.length = 0;
  history = "";
  chatBuffer.push({ role: "user", content: "Let's start over!" })
  await sendChatResponse(ctx);
});

bot.command("memory", async (ctx) => {
  if (history) {
    const memory = await convertHistoryToPerspective(character, history);
    await ctx.reply(memory);
  } else {
    chatBuffer.push({ role: "user", content: "what do you remember from our conversation earlier?" })
    await sendChatResponse(ctx);
  }
});

// Listen for messages
bot.on("message", async (ctx) => {
  const messageText = ctx.message?.text;
  if (messageText && messageText.trim()) {
    // Update the chat buffer with the user's message
    chatBuffer.push({ role: "user", content: messageText! });
    // Handle the user's message, send a response and return the response text
    const responseText = await sendChatResponse(ctx);
    // Add response to the chat buffer
    chatBuffer.push({ role: "assistant", content: responseText });
    // Update the history with the user's message
    if (chatBuffer.length > CHAT_TURN_BUFFER_SIZE * 2) {
      const oldMessages = chatBuffer.splice(0, 2); // Remove the oldest turn and save them for summarization
      history = await summarizeConversation(character, history, oldMessages);
    }
    // Log the conversation
    console.log('*********************\n');
    console.log(messagesToText(character, chatBuffer));
    if(history) { console.log('Summary:\n' + history); }
  }
});

export default bot;


// deno-lint-ignore no-explicit-any
async function sendChatResponse(ctx: any): Promise<string> {
  // Show the typing indicator
  await ctx.api.sendChatAction(ctx.chat.id, "typing");
  // Call the ChatGPT API to generate a response
  const completionText = await fetchChatGPTWithHistory(
    character,
    history,
    [{ role: "system", content: systemPrompt }, ...chatBuffer,]
  );
  // Reply to the user
  await ctx.reply(completionText);
  // Return the response text
  return completionText;
}
