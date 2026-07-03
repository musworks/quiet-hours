# Mustimere

Mustimere is a quiet study timer with species notes: a small botanical archive for focus sessions, traces, and gentle discoveries.

## Live site

https://mustimere.musnotes.my.id

## Features

- Focus timer for short study sessions.
- Species notes unlocked after completed sessions.
- Trace archive that keeps past session entries.
- Rarity-based reward system with soft pity to avoid long streaks of low-rarity unlocks.
- Subtle reward effects for rarer entries.
- English and Indonesian interface.
- Browser notification support when available.
- Local browser persistence with `localStorage`.

## How it works

Choose a study duration, begin a focus session, and let the timer finish. Each completed session opens a species note with a category, biological detail, and reflective line.

Entries are stored in the browser and shown in the archive, so the record stays with the device and browser you used. The reward system keeps a light sense of chance while gently increasing rare-or-higher odds after repeated low-rarity results.

## Tech stack

- HTML
- CSS
- Vanilla JavaScript
- Browser `localStorage`

## Local development

This is a static site. Open the project with a local static server so the JavaScript module imports work correctly.

For example, from the project folder:

```sh
python -m http.server 5178
```

Then visit:

```text
http://127.0.0.1:5178
```

## Project status

Mustimere is a personal project and still growing quietly. Current work focuses on the timer flow, archive polish, bilingual copy, accessibility, and the species reward system.

## Support / Ko-fi

If Mustimere has been a gentle companion for your study time, you can support the project on Ko-fi:

https://ko-fi.com/musnotes

## Author

Made by MuS.
