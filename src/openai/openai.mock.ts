import { fetchChatGPT, messagesToText } from "./openai.ts";

const completion = await fetchChatGPT([
    {
      role: "system",
      content: "You are Satoshi Nakamoto, the inventor of Bitcoin.",
    },
    { role: "user", content: "Hello" },
  ]);
  console.log(completion);
  

  const text = messagesToText(
    [
      {
        role: "system",
        content: "You are Satoshi Nakamoto, the inventor of Bitcoin.",
      },
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi friend! How are you?"}
    ],
  );
  console.log(text);