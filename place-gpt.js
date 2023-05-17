// CONFIG.debug.hooks = true

import {AiManager} from "./ai-classes/ai-manager.js";

// @todo change the renderSceneControls to getSceneControlButtons
Hooks.on("renderSceneControls", async (app, html) => {
    let place_gpt = $('<li class="scene-control" title="Create Place"><i class="fas fa-globe"></i></li>');
    place_gpt.click( async function() {
        await PlaceGPT.generatePopup().render(true)
    });
    html.children().first().append( place_gpt );
});

// @todo WIP
// Hooks.on("renderJournalPageSheet", (sheet, view, data) => {
//     view.find("a.placegpt-generate-room-description").click( ev => {
//         PlaceGPT.clickGenerateDescription(ev, sheet.object.parent._id);
//     });
// });

Hooks.on("ready", () => {
    console.log("place-gpt | Initializing AI");
    game.placeGPTAI = new AiManager().load_ai();
    game.placeGPT = PlaceGPT;
    console.log("place-gpt | Ready with AI provider: " + game.placeGPTAI.name);
});

class PlaceGPT {

    static async waitingForGpt(place, full_or_sections = "section") {
        const dialog = PlaceGPT.waitingPopup();
        dialog.render(true);

        // While the call is being made, show the waiting popup.
        // When the call is done, close the waiting popup and show the response in chat.
        const promise = game.placeGPTAI.getCompletion(place, full_or_sections);

        promise.then(
            (data) => {
                dialog.close();
                if (data !== null) {
                    if (game.settings.get("place-gpt", "outputTo") === 0 || game.settings.get("place-gpt", "outputTo") === 2) {
                        PlaceGPT.journalEntryPlaceDescription(place, data);
                    }
                    if (game.settings.get("place-gpt", "outputTo") === 1 || game.settings.get("place-gpt", "outputTo") === 2) {
                        PlaceGPT.chatPlaceDescription(place, data);
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
     * @todo WIP
     * @param event
     * @param journal_id
     */
    // static clickGenerateDescription(event, journal_id) {
    //     event.preventDefault();
    //     const journal = game.journal.get(journal_id);
    //     const page_id = event.target.closest("article.journal-entry-page").getAttribute("data-page-id");
    //     const page = journal.pages.get(page_id);
    //     let section_description = event.target.parentElement.children[0].innerText;
    //     let page_html = page.text.content;
    //     page.update({"text.content": page.text.content + "<div>Test</div>"});
    //     console.log(`place-gpt | Generating description for Journal "${journal.name}"`);
    // }


    /**
     *
     * Place example:
     * [{ "name": "Bridge", "description": "This is the command center of the spaceship. The walls are lined with screens displaying various readings and data. The captain's chair sits at the center of the room, facing the main viewscreen. There are doors leading to the rest of the ship.", "exits": { "north": "Captain's Quarters", "east": "Navigation Room", "south": "Main Corridor" }]
     *
     * @param placeDescription
     * @param placeJSON
     */
    static chatPlaceDescription(placeDescription, placeJSON) {

        // Go foreach placeJSON and create a text for each room:
        // RoomName
        // Description
        // Exits: North, East, South, West
        // Create a chat message with the text
        let placeGenerated = `<h1>${placeDescription}</h1>`;
        placeGenerated += PlaceGPT.parsePlaceJSONToHTML(placeDescription, placeJSON);

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
    static journalEntryPlaceDescription(placeDescription, placeJSON) {
        JournalEntry.create({
            name: placeDescription,
            content: PlaceGPT.parsePlaceJSONToHTML(placeDescription, placeJSON),
        });
    }

    static parsePlaceJSONToHTML(placeDescription, placeJSON) {
        let placeGenerated = "";
        placeJSON.forEach(room => {
            placeGenerated += `<div class="room">`;
            placeGenerated += `<h2>${room.name}</h2>`;
            placeGenerated += `<p class="placegpt-section-description">`;

            if (room.description !== undefined) {
                placeGenerated += room.description;
            }
            else {
                placeGenerated += `<a class="placegpt-generate-room-description">${game.i18n.localize("place-gpt.generate-room-description")}</a>`;
            }

            placeGenerated += `</p>`;

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
    static waitingPopup() {
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
    static generatePopup() {
        return new Dialog({
            title: game.i18n.localize("place-gpt.generate_a_place"),
            content: `
      <h2>${game.i18n.localize("place-gpt.generate_a_place")}</h2>
      <form>
        <div className="form-group">
          <textarea id="place-gpt-place" name="place-gpt-place" value=""></textarea>
        </div>
        <br/>
      </form>
    `,
            buttons: {
                generate: {
                    icon: "<i class='fas fa-check'></i>",
                    label: game.i18n.localize("place-gpt.Generate"),
                    callback: (html) => {
                        // Get the text prompt from the form
                        let place = html.find('[name="place-gpt-place"]')[0].value;

                        // @todo section loader
                        let full_or_sections = "full";
                        if (html.find('[name="place-gpt-full_or_sections"]')[0] !== undefined) {
                            full_or_sections = html.find('[name="place-gpt-full_or_sections"]')[0].value;
                        }

                        if (place === "") {
                            throw new Error(game.i18n.localize('place-gpt.error.prompt_required'));
                        }
                        PlaceGPT.waitingForGpt(place, full_or_sections);
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
}
