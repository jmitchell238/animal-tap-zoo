# Animal Tap Zoo

Tap cute zoo animals — they bounce, make a sound, and sprinkle confetti. **Zero fail.** Built for ages **4–6**.

**Play:** https://jmitchell238.github.io/animal-tap-zoo/

Part of [Arcade Hub](https://jmitchell238.github.io/arcade-hub/).

---

## Features

- Big touch targets, short sessions
- Habitats: **Savanna**, **Pond**, **Farm**, **Forest**
- 14 cartoon animals drawn on canvas (no asset pack required)
- Soft Web Audio “animal” sounds
- Confetti + praise text; milestone cheer every 10 taps
- Sound mute + reduced motion
- Installable PWA (offline after first visit)
- Progress (tap counts / favorite) in `localStorage`

## Stack

Static HTML / CSS / Canvas. No build step.

| Path | Purpose |
|------|---------|
| `index.html` | Shell + menu chrome |
| `css/style.css` | Layout / kid-friendly UI |
| `js/config.js` | Version, habitats, animal data |
| `js/animals.js` | Canvas animal drawers |
| `js/game.js` | Field layout, tap logic, backgrounds |
| `js/main.js` | Input, screens, SW register |
| `manifest.webmanifest` + `sw.js` | PWA |

## Versioning

- `GAME_VERSION` in `js/config.js` — `MAJOR.MINOR.PATCH` (patch zero-padded to 3 digits)
- Keep `CACHE` in `sw.js` in sync: `'animal-tap-zoo-' + GAME_VERSION`

## Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

Service workers need **http://localhost** or **https**.

## Parents

- No lives, ads, accounts, or fail screens
- Every tap is success
- Use **Calm motion** if animations are too busy
- **Sound off** for quiet car rides

## License

Personal project for family Arcade Hub.
