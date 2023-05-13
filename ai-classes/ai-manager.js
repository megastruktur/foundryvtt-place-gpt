import { ChatGPT } from "./chatgpt.js";

export const ai_providers = {
    0: {
        "name": "chatgpt",
        "class": ChatGPT,
    }
}

export class AiManager {

    load_ai() {
        let ai_provider = game.settings.get('place-gpt', 'ai_selector');
        let ai_class = ai_providers[ai_provider].class;
        return new ai_class();
    }
}