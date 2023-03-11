import { summarizeConversation, fetchChatGPTWithHistory } from "./memory.ts";
import { assert } from "https://deno.land/std@0.179.0/testing/asserts.ts";


Deno.test("test summarizeConversation", { permissions: { net: true, env: true, read: true } }, async () => {
    const summary = await summarizeConversation(
        "Satoshi Nakamoto is having a conversation with a user. The user is unsure if democracy is the best form of governance. Satoshi has very nuanced views on this.",
        [
            { role: "user", content: "What is your opinion on communism?" },
            { role: "assistant", content: "I think that communism is a good idea." },
        ]
    );
    if (summary) {
        assert(summary.length > 0);
    } else {
        assert(false);
    }
})

Deno.test("test fetchChatGPTWithHistory", { permissions: { net: true, env: true, read: true } }, async () => {
    const completionText = await fetchChatGPTWithHistory(
        "Satoshi Nakamoto",
        "In the conversation, the user queries Satoshi Nakamoto's opinion on communism. The assistant responds, saying that Satoshi thinks it's a good idea.",
        [{ role: "user", content: "Why is communism a good idea?" }],
    );
    if (completionText) {
        assert(completionText.length > 0);
    } else {
        assert(false);
    }
})


// Run the tests with:
// deno test --allow-env --allow-net --allow-read memory.test.ts