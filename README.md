# SG Ride Planner

A single-page web app that suggests a bicycle ride around Singapore based on:

- **Where you're starting from** — your browser's geolocation, or an area you pick manually
- **When you're riding and for how long** — start time and ride duration
- **Where you feel like going** (optional) — a preferred region of Singapore
- **Current conditions** — live weather (rain, heat, UV, wind) fetched for that place and time

It ranks a curated set of well-known Singapore cycling routes (East Coast Park, Punggol
Waterway, the Rail Corridor, Southern Ridges, and more), adjusting both the pace estimate
and which routes get recommended based on the weather — e.g. favouring shaded, sheltered
park-connector routes over exposed coastal ones when it's raining, very hot, or windy —
and warns if your ride would run past sunset.

## Running it

This is a static site with no build step. Serve the folder with any static file server
(opening `index.html` directly via `file://` can be blocked by the browser for the
weather API fetch, so a local server is recommended):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

or

```bash
npx serve .
```

## Voice

- **Speak your request** (top-left button) uses the browser's built-in speech recognition
  (Chrome/Edge only, no account needed) to fill in your start location, ride duration, and
  preferred area from something like *"I'm at Bedok, I've got 90 minutes, heading east."*
  Fields it can't confidently parse are left for you to set manually.
- **Read this to me** (on the results panel) and **Test voice** (in Voice settings) use the
  [Inworld AI](https://inworld.ai/) TTS API to speak the conditions and top route suggestion
  aloud. Open **Voice settings (Inworld AI)** and paste in your Inworld API key, voice ID
  (default `Ashley`), and model ID (default `inworld-tts-1.5-max`) to enable it.
  - There's no backend: the key is stored only in this browser's `localStorage` and sent
    directly from your browser to Inworld's API on each request. Only use this on a
    device/browser you trust, and don't publicly deploy a copy of this app with your key
    already saved in it — anyone using that deployment could see the key in their network
    requests and use your quota.

## How it works

- `js/routes-data.js` — curated Singapore route dataset (indicative paths, not surveyed GPS tracks) and area lists
- `js/weather.js` — fetches live conditions from [Open-Meteo](https://open-meteo.com/) (free, no API key)
- `js/planner.js` — turns conditions into an effective riding speed, a distance budget for the time window, and scores/ranks routes by fit, proximity, area preference, and condition-based tags
- `js/map.js` — renders the start point and suggested routes on a [Leaflet](https://leafletjs.com/)/OpenStreetMap map
- `js/voice-input.js` — browser speech recognition + a small parser for location/duration/area
- `js/voice-output.js` — Inworld AI TTS request/playback
- `js/app.js` — wires the form, geolocation, voice controls, and results UI together

## Notes

- Route paths are approximate, for display purposes — not turn-by-turn navigation.
- Geolocation is restricted to Singapore's bounding box; outside of it, pick an area manually.
- No backend or database. Inworld voice output needs your own Inworld API key (see Voice above); everything else needs no API keys.
