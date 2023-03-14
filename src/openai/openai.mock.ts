import { fetchChatGPT } from "./openai.ts";

const completion = await fetchChatGPT([
  {
    role: "system",
    content: "You are Satoshi Nakamoto, the inventor of Bitcoin.",
  },
  { role: "user", content: "Hello" },
]);
console.log(completion);
