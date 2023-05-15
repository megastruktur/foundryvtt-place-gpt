import {AiManager} from "./ai-classes/ai-manager.js";

Hooks.on("renderSceneControls", async (app, html) => {
    let place_gpt = $('<li class="scene-control" title="Create Place"><i class="fas fa-globe"></i></li>');
    place_gpt.click( async function() {
        await generatePopup().render(true)
    });
    html.children().first().append( place_gpt );
});

Hooks.on("ready", () => {
    console.log("place-gpt | Initializing AI");
    game.placeGPT = new AiManager().load_ai();
    console.log("place-gpt | Ready with AI provider: " + game.placeGPT.name);
});


async function waitingForGpt(place) {
    const dialog = waitingPopup();
    dialog.render(true);

    // While the call is being made, show the waiting popup.
    // When the call is done, close the waiting popup and show the response in chat.
    const promise = game.placeGPT.getCompletion(place);

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
                ui.notifications.info(game.i18n.localize('place-gpt.success.success_generating_place'));
            }
            else {
                ui.notifications.error(game.i18n.localize('place-gpt.error.error_generating_place'));
            }
        }
    )
        .catch(function(error) {
            dialog.close();
            console.log(error);
            ui.notifications.error(game.i18n.localize('place-gpt.error.error_generating_place'));
        });
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
        placeGenerated += `<div class="room">`;
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
        placeGenerated += `</div>`;
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
        default: "close",
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
                callback: (html) => {
                    // Get the text prompt from the form
                    let place = html.find('[name="place-gpt"]')[0].value;

                    if (place === "") {
                        throw new Error(game.i18n.localize('place-gpt.error.prompt_required'));
                    }
                    waitingForGpt(place);
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
