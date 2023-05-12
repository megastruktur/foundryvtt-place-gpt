Hooks.on("init", () => {
    game.settings.register("place-gpt", "dummyMode", {
        name: "Dummy Mode",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register("place-gpt", "openaiAPIToken", {
        name: "OpenAI API Token",
        scope: "world",
        config: true,
        type: String,
        default: ''
    });
});
