# The Basement Circuit

Write a fighter in one sentence. Scout the challenger. Call the upset.

## Pollinations Integration

The Basement Circuit integrates directly with Pollinations.ai:
- **Text Generation (`https://gen.pollinations.ai/v1/chat/completions`)**: Defined in [`src/pollinations.js`](src/pollinations.js), querying `openai/gpt-5.6-sol` to forge structured fighter cards (stats, traits, and signed moves) from a single prompt.
- **Image Generation (`https://gen.pollinations.ai/v1/images/generations`)**: Defined in [`src/pollinations.js`](src/pollinations.js), querying `tongyi-mai/z-image-turbo` to generate contender avatar portraits.
- **Pollen OAuth PKCE**: In [`src/auth.js`](src/auth.js), connecting via `https://enter.pollinations.ai/authorize` to allow users to bring their own Pollen pass.

## Run locally

Serve this folder with `python -m http.server` and open `http://localhost:8000`.

[![Made with pollinations.ai](https://raw.githubusercontent.com/pollinations/pollinations/main/packages/ui/src/brand/badge-made-with.svg)](https://pollinations.ai/?ref=badge)
