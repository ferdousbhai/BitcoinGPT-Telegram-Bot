import { fetchChatGPT } from "./openai.ts";
import { Message } from "./openai.ts";

export interface State {
    system: string;
    longTermMemory: string;
    buffer: Message[]; 
}

// Update the long term memory with the new user prompt and return the new state
export async function updateLongTermMemory(state: State, newUserPrompt: string): Promise<State> {
    try {
        const generatedText = await fetchChatGPT([
            {role: "system", content: state.system + '\n' + state.longTermMemory },
            { role: "user", content: newUserPrompt }
        ]);
        state.longTermMemory = generatedText!;
        return state;
    } catch (error) {
        console.log(error);
        return state;
    }
}