import { getSentiment } from "./sentiment.ts";
import { assert } from "https://deno.land/std@0.179.0/testing/asserts.ts";

Deno.test("getSentiment", async () => {
  const sentiment = await getSentiment([
    {
      role: "user",
      content: "I'm hungry.",
    },
    {
      role: "user",
      content: "I'm sad.",
    },
    {
      role: "user",
      content: "I'm happy",
    },
  ]);
  assert(sentiment.length>0);
});
