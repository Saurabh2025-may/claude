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

## How it works

- `js/routes-data.js` — curated Singapore route dataset (indicative paths, not surveyed GPS tracks) and area lists
- `js/weather.js` — fetches live conditions from [Open-Meteo](https://open-meteo.com/) (free, no API key)
- `js/planner.js` — turns conditions into an effective riding speed, a distance budget for the time window, and scores/ranks routes by fit, proximity, area preference, and condition-based tags
- `js/map.js` — renders the start point and suggested routes on a [Leaflet](https://leafletjs.com/)/OpenStreetMap map
- `js/app.js` — wires the form, geolocation, and results UI together

## Notes

- Route paths are approximate, for display purposes — not turn-by-turn navigation.
- Geolocation is restricted to Singapore's bounding box; outside of it, pick an area manually.
- No backend, database, or API keys required.
