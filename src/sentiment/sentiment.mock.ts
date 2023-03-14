import { getSentiment } from "./sentiment.ts";

const sentiment = await getSentiment(
  [{
    role: "user",
    content: "I'm hungry.",
  }, {
    role: "user",
    content: "I'm sad.",
  }, { role: "user", content: "I'm happy" }], 
);

console.log(sentiment);
