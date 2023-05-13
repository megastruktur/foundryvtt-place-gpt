# PlaceGPT module for FoundryVTT
<p align="center">
<img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/megastruktur/foundryvtt-place-gpt"> <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/megastruktur/foundryvtt-place-gpt"> <img alt="GitHub All Releases" src="https://img.shields.io/github/downloads/megastruktur/foundryvtt-place-gpt/total" /> <img alt="GitHub Release Date" src="https://img.shields.io/github/release-date/megastruktur/foundryvtt-place-gpt?label=latest%20release" /> 
</p>
<p align="center">
<img alt="GitHub" src="https://img.shields.io/github/license/megastruktur/foundryvtt-place-gpt"> <a href="https://github.com/megastruktur/foundryvtt-place-gpt/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/megastruktur/foundryvtt-place-gpt"></a> <a href="https://github.com/megastruktur/foundryvtt-place-gpt/network"><img alt="GitHub forks" src="https://img.shields.io/github/forks/megastruktur/foundryvtt-place-gpt"></a> <a href="https://github.com/megastruktur/foundryvtt-place-gpt/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/megastruktur/foundryvtt-place-gpt"></a> 
</p>

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