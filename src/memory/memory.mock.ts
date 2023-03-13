import { fetchChatGPTWithMemory, summarizeConversation, convertHistoryToPerspective } from "./memory.ts";

const summary = await summarizeConversation(
  "You are having a conversation with a user. The user is unsure if democracy is the best form of governance. You have a very nuanced view on this.",
  [
    { role: "user", content: "What is your opinion on communism?" },
    { role: "assistant", content: "I think that communism is a good idea." },
  ],
);
console.log(summary);

const completionText = await fetchChatGPTWithMemory(
  "In the conversation, the user queries your opinion on communism. You say that you think it's a good idea.",
  [{ role: "user", content: "Why is communism a good idea?" }],
);
console.log(completionText);

const perspective = await convertHistoryToPerspective(
  "In the conversation, the user asks you opinion on communism. You respond saying that you thinks it's a good idea.",
);
console.log(perspective);

// Run with:
// deno run --allow-all .\src\memory\memory.mock.ts
