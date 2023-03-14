import { fetchChatGPT } from "./openai.ts";
import { assert } from "https://deno.land/std@0.179.0/testing/asserts.ts";

Deno.test("test fetchChatGPT", {
  permissions: { net: true, env: true, read: true },
}, async () => {
  const completion = await fetchChatGPT([
    {
      role: "system",
      content: "You are Satoshi Nakamoto, the inventor of Bitcoin.",
    },
    { role: "user", content: "Hello" },
  ]);
  if (completion) {
    assert(completion.length > 0);
  } else {
    assert(false);
  }
});

// Run the tests with:
// deno test --allow-all .\src\openai\openai.test.ts
