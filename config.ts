export const character = "Satoshi Nakamoto";
export const systemPrompt = await Deno.readTextFile(`./characters/${character}.txt`);
export const CHAT_TURN_BUFFER_SIZE = 2; // Number of recent turns to remember for chat context