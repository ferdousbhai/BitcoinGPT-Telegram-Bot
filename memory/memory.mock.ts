import { summarizeConversation, fetchChatGPTWithHistory, convertHistoryToPerspective } from "./memory.ts";


    const summary = await summarizeConversation(
        "Satoshi Nakamoto",
        "Satoshi Nakamoto is having a conversation with a user. The user is unsure if democracy is the best form of governance. Satoshi has very nuanced views on this.",
        [
            { role: "user", content: "What is your opinion on communism?" },
            { role: "assistant", content: "I think that communism is a good idea." },
        ]
    );
    console.log(summary);


    const historyPOV = await convertHistoryToPerspective(
        "Satoshi Nakamoto",
        "The conversation continues to discuss the importance of consensus in decentralized systems, such as Bitcoin. Satoshi Nakamoto uses the analogy of agreeing on pizza toppings to explain how consensus allows for agreement on valid transactions. The conversation shifts away from personal experiences and focuses on the technical aspects of cryptocurrency, emphasizing the importance of strong cryptographic security and backup measures for private keys."
    )
    console.log(historyPOV);


    const completionText = await fetchChatGPTWithHistory(
        "Satoshi Nakamoto",
        "In the conversation, the user queries Satoshi Nakamoto's opinion on communism. The assistant responds, saying that Satoshi thinks it's a good idea.",
        [{ role: "user", content: "Why is communism a good idea?" }],
    );
    console.log(completionText);

// Run the tests with:
// deno test --allow-env --allow-net --allow-read .\memory\memory.test.ts