export class Dummy {

    get name() {
        return 'Dummy';
    }

    /**
     * Get a response from ChatGPT
     * @param prompt
     * @returns {Promise<any|null>}
     */
    async getCompletion(prompt) {

        const apiUrl = '/modules/place-gpt/assets/dummy.json';

        const headers = {
            'Content-Type': 'application/json',
        };

        const requestOptions = {
            method: 'GET',
            headers: headers
        };

        try {

            await new Promise(r => setTimeout(r, 2000));

            const response = await fetch(apiUrl, requestOptions);
            const data = await response.json();

            // Retrieve the assistant's reply from the API response
            // Try to decode JSON (if the response is JSON)
            try {
                return data;
            }
            catch(error) {
                // If the response is not JSON, return the raw string
                console.error('place-gpt Error:', error);
                return null;
            }
        } catch (error) {
            console.error('place-gpt Error:', error);
            // Handle error
            return null;
        }
    }
}