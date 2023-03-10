import { Bot } from "https://deno.land/x/grammy@v1.14.1/mod.ts";
import { Message, fetchChatGPT } from "./openai.ts";
import { State, updateLongTermMemory } from "./memory.ts";

const systemInstructions = await Deno.readTextFile("./system.txt");

const CHAT_BUFFER_SIZE = 2; // Number of recent turns to remember for chat context

const chatHistory: Message[] = [];

let state: State = {
    system: systemInstructions,
    longTermMemory: "",
    buffer: [],
  };

const bot = new Bot(Deno.env.get("TELEGRAM_BOT_TOKEN")!);

// Suggest commands to users:
await bot.api.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "startover", description: "Start over" },
  { command: "help", description: "Show help text" },
  // { command: "settings", description: "Open settings" },
]);

bot.command("start", (ctx) => {
  ctx.reply("Hello! I'm Satoshi Nakamoto, the creator of Bitcoin. Ask me anything!")
  cleanUp();
});

bot.command("startover", (ctx) => {
  ctx.reply("Let's start over!")
  cleanUp();
})

bot.command("help", (ctx) => {
  ctx.reply("Ask me anything about Bitcoin!")
})

// Listen for messages
bot.on("message", async (ctx) => {
  const messageText = ctx.message?.text;
  if (messageText && messageText.trim()) {
    // Show that the bot is typing a response
    await ctx.api.sendChatAction(ctx.chat.id, "typing");
    // Add the user's message to the chat history
    chatHistory.push({ role: "user", content: messageText! });
    // Update the chat buffer
    state.buffer.push({ role: "user", content: messageText! });
    if (state.buffer.length > CHAT_BUFFER_SIZE*2) {
      state.buffer.splice(0, 2);
    }
    // Call the ChatGPT API to generate a response
    const generatedText = await fetchChatGPT([
      {
        role: "system",
        content: systemInstructions + '\n' + state.longTermMemory,
      },
      ...state.buffer,
    ]);
    // Reply to the user
    try {
      await ctx.reply(generatedText!);
      chatHistory.push({ role: "assistant", content: generatedText! });
      state.buffer.push({ role: "assistant", content: generatedText! });
      // Update the state with the new long term memory
      if(chatHistory.length > CHAT_BUFFER_SIZE * 2) {
        state = await updateLongTermMemory(state, messageText);
      }
    } catch (error) {
      console.log(error);
    }
    console.log(state);
  }
});

export default bot;



// Helper function to reset the chat
function cleanUp() {
  chatHistory.length = 0;
  state.buffer.length = 0;
  state.longTermMemory = "";
}
