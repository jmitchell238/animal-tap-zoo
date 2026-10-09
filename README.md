# Animal Tap Zoo

Find and tap zoo animals. They react, say their names, and get snacks. There's no way to fail. Made for ages 4–6.

Play at https://jmitchell238.github.io/animal-tap-zoo/. It's one of the games in [Arcade Hub](https://jmitchell238.github.io/arcade-hub/).

## Features

- Find Me mode: the game asks for an animal ("Find the Lion!"), says it out loud, and makes it glow if you need a hint
- Free Play: tap any animal to make it dance or send up hearts
- Animals wander around and spin
- Floating treats to tap for extra cheers
- Four habitats: Savanna, Pond, Farm and Forest
- Sound effects, with optional spoken animal names
- Settings for sound, voice and Calm motion
- Installable PWA that works offline after the first visit

## For parents

- No lives, ads, accounts or fail screens. Every tap counts as a success.
- Turn on Calm motion if the animation is too busy.
- Turn the sound off for quiet car rides.

## Files

| Path | Contents |
|------|----------|
| `index.html` | Page and menus |
| `css/style.css` | Styles |
| `js/config.js` | Version, habitats, animal data |
| `js/animals.js` | Animal drawing |
| `js/game.js` | Layout, tap handling, backgrounds |
| `js/main.js` | Input, screens, service worker registration |
| `manifest.webmanifest`, `sw.js` | PWA |

## Running locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080. The service worker needs `localhost` or HTTPS.

Plain HTML, CSS and canvas with no build step.

## Tests

```bash
node tests/run.mjs
```

## Versioning

When you bump `GAME_VERSION` in `js/config.js`, set `CACHE` in `sw.js` to `'animal-tap-zoo-' + GAME_VERSION`.

## License

Personal project for the family.
