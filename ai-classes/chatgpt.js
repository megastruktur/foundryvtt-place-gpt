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

    /**
     * Get a response from ChatGPT
     * @param prompt
     * @returns {Promise<any|null>}
     */
    async getCompletion(prompt) {

        if (!game.settings.get('place-gpt', 'openaiAPIToken')) {
            ui.notifications.error(game.i18n.localize('place-gpt.error.no_api_token'));
            return null;
        }

        // Test data
        if (game.settings.get("place-gpt", "dummyMode") === true) {
            let dummyJson = game.i18n.localize('place-gpt.dummy_completion');

            // wait 2 secs to emulate the call to the API
            await new Promise(r => setTimeout(r, 2000));
            return JSON.parse(dummyJson);
        }

        const apiUrl = 'https://api.openai.com/v1/chat/completions';

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + game.settings.get('place-gpt', 'openaiAPIToken')
        };

        const body = {
            'model': 'gpt-3.5-turbo-0301',
            'temperature': 0.2,
            'messages': [
                {'role': 'system', 'content': game.i18n.localize("place-gpt.prompt")},
                {'role': 'user', 'content': prompt}
            ]
        };

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        };

        try {
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