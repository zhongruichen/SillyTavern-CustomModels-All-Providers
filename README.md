# Custom Models (All Providers) for SillyTavern

This is a modified version of the [SillyTavern-CustomModels](https://github.com/LenAnderson/SillyTavern-CustomModels) extension by LenAnderson.

This version has been updated to support adding custom model names to nearly all API providers available in SillyTavern, not just the original three. This allows you to use new or unlisted models from any supported service.

## How to install
1. Go to the extensions panel in SillyTavern (the puzzle piece icon).
2. Go to the "Download Extension" tab.
3. Paste the URL of this repository into the text field: `https://github.com/zhongruichen/SillyTavern-CustomModels-All-Providers.git`
4. Click "Download".
5. Enable the extension in the "Installed" tab.
6. Reload the UI.

## How to use
1. Go to the API settings of your chosen provider (e.g., OpenAI, OpenRouter, etc.).
2. Next to the model selection dropdown, you will find a new "edit" button (a pen icon).
3. Click it to open a popup where you can add your custom model names, one per line.
4. Click "Save". The model selection dropdown will now include your custom models in a new "Custom Models" group.

## Supported Providers
This extension should now work for the vast majority of API providers, including (but not limited to):
- OpenAI
- Claude / Anthropic
- Google (AI Studio / Vertex)
- OpenRouter
- MistralAI
- Cohere
- DeepSeek
- Groq
- Perplexity
- Scale
- AI21
- 01.AI
- xAI (Grok)
- NovelAI
- KoboldAI
- Text Generation WebUI
- And many other OpenAI-compatible endpoints...

## Credits
- Original extension by **LenAnderson**.
- This fork is maintained by **zhongruichen**.