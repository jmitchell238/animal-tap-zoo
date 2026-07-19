# Animal Tap Zoo

Find and tap cute zoo animals — big reactions, spoken names, snacks, **zero fail.** Built for ages **4–6**.

**Play:** https://jmitchell238.github.io/animal-tap-zoo/

Part of [Arcade Hub](https://jmitchell238.github.io/arcade-hub/).

---

## Features

- **Find Me!** mode: “Find the Lion!” with speech + glow hints
- **Free Play**: tap anyone for dances, hearts, streaks
- Animals **wander**, spin, and leave hearts
- Floating **treats** to tap for bonus cheer
- Habitats: **Savanna**, **Pond**, **Farm**, **Forest**
- Side-view cartoon animals (elephant trunk is a proper profile snout)
- Web Audio sounds + optional spoken names
- Sound / voice / reduced motion toggles
- Installable PWA (offline after first visit)


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
