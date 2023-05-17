Hooks.on('init', () => {
    game.settings.register('place-gpt', 'openaiAPIToken', {
        name: 'OpenAI API Token',
        hint: 'Get the token at the OpenAPI developers console',
        scope: 'world',
        config: true,
        type: String,
        default: ''
    });
});

export class ChatGPT {

    get name() {
        return 'ChatGPT';
    }

    /**
     * Get a response from ChatGPT
     * @param prompt
     * @param full_or_sections
     * @returns {Promise<any|null>}
     */
    async getCompletion(prompt, full_or_sections = "section") {

        if (!game.settings.get('place-gpt', 'openaiAPIToken')) {
            ui.notifications.error(game.i18n.localize('place-gpt.error.no_api_token'));
            return null;
        }

        const apiUrl = 'https://api.openai.com/v1/chat/completions';

        let full_or_sections_prompt = game.i18n.localize("place-gpt.prompt_section");
        if (full_or_sections === "full") {
            full_or_sections_prompt = game.i18n.localize("place-gpt.prompt_full")
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + game.settings.get('place-gpt', 'openaiAPIToken')
        };

        const body = {
            'model': 'gpt-3.5-turbo-0301',
            'temperature': 0.2,
            'messages': [
                {'role': 'system', 'content': full_or_sections_prompt},
                {'role': 'user', 'content': prompt}
            ]
        };

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        };

        try {
            // @todo add different http error handling e.g. 429 is out of credits.
            const response = await fetch(apiUrl, requestOptions);
            const data = await response.json();

            // Retrieve the assistant's reply from the API response
            // Try to decode JSON (if the response is JSON)
            try {
                return JSON.parse(data.choices[0].message.content);
            }
            catch {
                // If the response is not JSON, return the raw string
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle error
            return null;
        }
    }
}