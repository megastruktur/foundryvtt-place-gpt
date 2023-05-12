Hooks.on('init', () => {
    game.settings.register('place-gpt', 'dummyMode', {
        name: 'Dummy Mode',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register('place-gpt', 'openaiAPIToken', {
        name: 'OpenAI API Token',
        scope: 'world',
        config: true,
        type: String,
        default: ''
    });

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
});
