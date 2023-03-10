import { Message, fetchChatGPT } from "./openai.ts";

// Declare a State object that has long term memory
export interface State extends Message {
    longTermMemory: string;
}

// Update the long term memory with the new user prompt and return the new state
export async function updateLongTermMemory(state: State, newUserPrompt: string): Promise<State> {
    const generatedText = await fetchChatGPT([
        {role: "system", content: state.longTermMemory },
        { role: "user", content: newUserPrompt }
    ]);
    return { role: "system", content: generatedText!, longTermMemory: state.longTermMemory + generatedText! };
}
    