import {ai_providers} from '../ai-classes/ai-manager.js';

Hooks.on('init', () => {
    game.settings.register('place-gpt', 'outputTo', {
        name: game.i18n.localize('place-gpt.settings.outputTo.name'),
        hint: game.i18n.localize('place-gpt.settings.outputTo.hint'),
        scope: 'world',
        config: true,
        type: Number,
        choices: {
            0: game.i18n.localize('place-gpt.settings.outputTo.journal'),
            1: game.i18n.localize('place-gpt.settings.outputTo.chat'),
            2: game.i18n.localize('place-gpt.settings.outputTo.both'),
        },
        default: 0,
    });

    // get the index and name for each AI provider
    // let ai_provider_choices = ["ChatGPT"];
    let ai_provider_choices = {};
    for (let [index, ai_provider] of Object.entries(ai_providers)) {
        ai_provider_choices[index] = ai_provider.name;
    }
    game.settings.register('place-gpt', 'ai_selector', {
        name: game.i18n.localize('place-gpt.settings.ai_selector.name'),
        hint: game.i18n.localize('place-gpt.settings.ai_selector.hint'),
        scope: 'world',
        config: true,
        type: Number,
        choices: ai_provider_choices,
        default: 0,
    });
});
