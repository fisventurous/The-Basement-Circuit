# The Basement Circuit

A retro text-driven fight simulator and tactical card battler set in an underground boxing ring.

![The Basement Circuit - Main Event Arena](the-basement-circuit-ss-main.webp)

## How It Works

Every fight night pits your custom contender against the house veteran, Pigeon Pete, across a 3-bout series.

1. **Scout the Corner Whisper**: Inspect Pete's active tell, vice, or habit before inking your card, or bribe the cellar informant for an unscripted AI leak.
2. **Ink Your Contender**: Describe your fighter in a single punchy line (up to 80 characters). The matchmaker translates your concept into attributes (Power, Speed, Guard), a bespoke stamina pool, and signature moves.
3. **Fight the 3-Bout Card**: Each bout runs up to 7 rounds of momentum-driven action, featuring stamina fatigue, clinch work, and sudden-death tiebreakers.
4. **Corner Adjustments**: Between bouts, adapt your ring approach: press the attack, tuck your chin, or gamble on a haymaker to exploit Pete's shifts.
5. **Dossiers & Portraits**: Generate retro pulp comic portraits for both corners, inspectable in detail via the interactive zoom viewer.

![The Matchmaker's Programme](the-basement-circuit-ss.webp)

## Powered by Pollinations

- **Fighter Generation**: `openai/gpt-5.6-sol` extracts structured stats, combat moves, and flaw exploits from natural-language descriptions via `https://gen.pollinations.ai/v1/chat/completions` ([`src/pollinations.js`](src/pollinations.js)).
- **Card Portraits**: `black-forest-labs/flux.1.1-pro` (with `tongyi-mai/z-image-turbo` fallback) renders stylised retro comic portraits for each fighter via `https://gen.pollinations.ai/image/` ([`src/pollinations.js`](src/pollinations.js)).
- **Pollen Auth**: Native OAuth PKCE flow allowing players to connect their own Pollinations pass directly in the browser ([`src/auth.js`](src/auth.js)).

## Running Locally

Serve the directory with any static HTTP server:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

[![Made with pollinations.ai](https://raw.githubusercontent.com/pollinations/pollinations/main/packages/ui/src/brand/badge-made-with.svg)](https://pollinations.ai/?ref=badge)
