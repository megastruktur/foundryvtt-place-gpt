Hooks.on("renderSceneControls", async (app, html) => {
    let place_gpt = $('<li class="scene-control" title="Create Place"><i class="fas fa-globe"></i></li>');
    place_gpt.click( async function() {
        await generatePopup().render(true)
    });
    html.children().first().append( place_gpt );
});


async function waitingForGpt(place) {
    const dialog = waitingPopup();
    dialog.render(true);

    // Make the call to chatGPT with getChatGPTResponse function.
    // While the call is being made, show the waiting popup.
    // When the call is done, close the waiting popup and show the response in chat.
    const promise = getChatGPTResponse(place);

    promise.then(
        (data) => {
            dialog.close();
            if (data !== null) {
                if (game.settings.get("place-gpt", "outputTo") === 0 || game.settings.get("place-gpt", "outputTo") === 2) {
                    journalEntryPlaceDescription(place, data);
                }
                if (game.settings.get("place-gpt", "outputTo") === 1 || game.settings.get("place-gpt", "outputTo") === 2) {
                    chatPlaceDescription(place, data);
                }
            }
            else {
                ui.notifications.error("Error generating place");
            }
        }
    );
}


/**
 *
 * Place example:
 * [{ "name": "Bridge", "description": "This is the command center of the spaceship. The walls are lined with screens displaying various readings and data. The captain's chair sits at the center of the room, facing the main viewscreen. There are doors leading to the rest of the ship.", "exits": { "north": "Captain's Quarters", "east": "Navigation Room", "south": "Main Corridor" }]
 *
 * @param placeDescription
 * @param placeJSON
 */
function chatPlaceDescription(placeDescription, placeJSON) {

    // Go foreach placeJSON and create a text for each room:
    // RoomName
    // Description
    // Exits: North, East, South, West
    // Create a chat message with the text
    let placeGenerated = `<h1>${placeDescription}</h1>`;
    placeGenerated += parsePlaceJSONToHTML(placeDescription, placeJSON);

    ChatMessage.create({
        content: placeGenerated,
        speaker: ChatMessage.getSpeaker({ alias: placeDescription }),
    });

}

/**
 * @todo What if the entry exists already?
 * @param placeDescription
 * @param placeJSON
 */
function journalEntryPlaceDescription(placeDescription, placeJSON) {
    JournalEntry.create({
        name: placeDescription,
        content: parsePlaceJSONToHTML(placeDescription, placeJSON),
    });
}

function parsePlaceJSONToHTML(placeDescription, placeJSON) {
    let placeGenerated = "";
    placeJSON.forEach(room => {
        placeGenerated += `<h2>${room.name}</h2>`;
        placeGenerated += `<p>${room.description}</p>`;

        // check if room.exits exists
        if (room.exits !== undefined) {
            placeGenerated += `<h3>${game.i18n.localize("place-gpt.Exits")}</h3>`;
            let exits = "";
            for (let [key, value] of Object.entries(room.exits)) {
                exits += `<p><b>${key}</b>: ${value}</p>`;
            }
            placeGenerated += exits;
        }
    });
    return placeGenerated;
}


/**
 * Waiting Popup Dialog
 * @returns {Dialog}
 */
function waitingPopup() {
    return new Dialog({
        title: `${game.i18n.localize("place-gpt.Generating")}`,
        content: `
      <h2>${game.i18n.localize("place-gpt.generating_the_place")}</h2>
      <form>
        <div className="form-group">
          <label>${game.i18n.localize("place-gpt.waiting_for_generate")}</label>
        </div><br/>
      </form>
    `,
        buttons: {
            cancel: {
                icon: "<i class='fas fa-times'></i>",
                label: game.i18n.localize('Cancel'),
            },
        },
        default: "cancel",
    });
}


/**
 * Generate Popup Dialog
 * @returns {Dialog}
 */
function generatePopup() {
    return new Dialog({
        title: game.i18n.localize("place-gpt.generate_a_place"),
        content: `
      <h2>${game.i18n.localize("place-gpt.generate_a_place")}</h2>
      <form>
        <div className="form-group">
          <textarea id="place-gpt" name="place-gpt" value=""></textarea>
        </div><br/>
      </form>
    `,
        buttons: {
            generate: {
                icon: "<i class='fas fa-check'></i>",
                label: game.i18n.localize("place-gpt.Generate"),
                callback: async (html) => {
                    // Get the text prompt from the form
                    let place = html.find('[name="place-gpt"]')[0].value;
                    await waitingForGpt(place);
                    // console.log(placeGenerated);
                },
            },
            cancel: {
                icon: "<i class='fas fa-times'></i>",
                label: game.i18n.localize('Cancel'),
            },
        },
        default: "generate",
    });
}


/**
 * Make a request to ChatGPT to get response
 * @param message
 * @returns {Promise<any|null>}
 */
async function getChatGPTResponse(message) {

    // Test data
    if (game.settings.get("place-gpt", "dummyMode") === true) {
        let dummyJson = '[ { "name": "Living Room", "description": "The living room is cozy and inviting, with a plush sofa and armchair arranged around a coffee table. A TV sits on a stand against one wall, and a bookshelf lines another. A large window lets in plenty of natural light, and there is a door leading to the front porch.", "exits": { "east": "Kitchen", "south": "Main Hallway" } }, { "name": "Kitchen", "description": "The kitchen is small but functional, with a stove, refrigerator, and sink. There is a small table with two chairs for dining. A window above the sink looks out onto the backyard, and there is a door leading to the back porch.", "exits": { "west": "Living Room" } }, { "name": "Main Hallway", "description": "The main hallway runs the length of the house, with doors leading to the various rooms. There is a coat closet by the front door, and a staircase leading to the second floor.", "exits": { "north": "Living Room", "east": "Bathroom", "south": "Bedroom 1", "west": "Bedroom 2" } }, { "name": "Bathroom", "description": "The bathroom is small but functional, with a sink, toilet, and shower/tub combo. There is a small window for ventilation.", "exits": { "west": "Main Hallway" } }, { "name": "Bedroom 1", "description": "This bedroom is cozy and comfortable, with a double bed, dresser, and closet. A window looks out onto the front yard.", "exits": { "north": "Main Hallway" } }, { "name": "Bedroom 2", "description": "This bedroom is slightly larger than the other, with a queen bed, dresser, and closet. A window looks out onto the backyard.", "exits": { "east": "Main Hallway" } } ]';

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
            {'role': 'user', 'content': message}
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