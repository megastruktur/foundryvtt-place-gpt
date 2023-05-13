# PlaceGPT module for FoundryVTT

# WARNING
**The module works only with ChatGPT for now so if you don't have openai account you won't be able to use it for now.**

## Description
This module allows you to generate places using the GPT model (currently ChatGPT3).
The Place is created as Journal entry by default but additionally can be added as Chat message (see module Settings).

![Launch](./screenshots/Launch.gif?raw=true "Launch")
![Result](./screenshots/Result.gif?raw=true "Result")


## Installation

### ChatGPT
1. Install and enable the module
2. Create account at openai.com (or use an existing one)
3. Go to https://platform.openai.com/account/api-keys and create a new API key
4. Go to module settings and insert the API key from the step above.

## Generators currently available
- ChatGPT (gpt-3.5-turbo-0301 model with temperature 0.2)

## To be done
1. Add more random generators (see the ./ai_classes directory)