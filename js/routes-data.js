/**
 * Curated Singapore cycling routes.
 *
 * Paths are indicative waypoints for map display, not surveyed GPS tracks —
 * good enough to show the shape of a ride, not for turn-by-turn navigation.
 * distanceKm is the typical total ride distance (there and back / full loop).
 */

const ROUTES = [
  {
    id: "east-coast",
    name: "East Coast Park (Bedok → Changi Boardwalk)",
    region: "east",
    distanceKm: 24,
    start: { name: "East Coast Park (Bedok)", lat: 1.3010, lng: 103.9120 },
    tags: ["coastal", "flat", "food-stops", "scenic", "exposed"],
    description:
      "Singapore's classic coastal ride: a wide, flat dedicated path with sea breeze, park life and plenty of food stops along the way.",
    path: [
      [1.2980, 103.9060],
      [1.3010, 103.9120],
      [1.3080, 103.9300],
      [1.3200, 103.9550],
      [1.3400, 103.9750],
      [1.3550, 103.9880],
    ],
  },
  {
    id: "marina-bay",
    name: "Marina Bay Loop (Gardens by the Bay → Helix Bridge → Esplanade)",
    region: "central",
    distanceKm: 10,
    start: { name: "Marina Bay", lat: 1.2836, lng: 103.8607 },
    tags: ["urban", "flat", "scenic", "exposed", "night-friendly"],
    description:
      "A short, flat loop around the downtown skyline — postcard views of Marina Bay Sands, the Helix Bridge and the Singapore Flyer, mostly on wide pedestrian/cycle paths.",
    path: [
      [1.2836, 103.8607],
      [1.2818, 103.8636],
      [1.2870, 103.8637],
      [1.2903, 103.8590],
      [1.2870, 103.8555],
      [1.2836, 103.8607],
    ],
  },
  {
    id: "punggol-coney",
    name: "Punggol Waterway → Coney Island",
    region: "northeast",
    distanceKm: 13,
    start: { name: "Punggol Waterway Park", lat: 1.4043, lng: 103.9021 },
    tags: ["nature", "flat", "shaded", "family-friendly"],
    description:
      "A calm ride along Punggol Waterway Park into the rustic, car-free trails of Coney Island — partly shaded, good for a relaxed pace.",
    path: [
      [1.4043, 103.9021],
      [1.4070, 103.9080],
      [1.4110, 103.9150],
      [1.4160, 103.9230],
      [1.4110, 103.9260],
    ],
  },
  {
    id: "pasir-ris-changi",
    name: "Pasir Ris Park → Changi Beach",
    region: "east",
    distanceKm: 18,
    start: { name: "Pasir Ris Park", lat: 1.3721, lng: 103.9474 },
    tags: ["coastal", "flat", "shaded", "nature"],
    description:
      "Mangrove boardwalks and beach park scenery, with tree cover in the Pasir Ris mangrove section and open coast toward Changi.",
    path: [
      [1.3721, 103.9474],
      [1.3780, 103.9560],
      [1.3830, 103.9670],
      [1.3850, 103.9800],
      [1.3830, 103.9900],
    ],
  },
  {
    id: "rail-corridor",
    name: "Rail Corridor (Green Corridor), Bukit Timah stretch",
    region: "central",
    distanceKm: 20,
    start: { name: "Bukit Timah", lat: 1.3392, lng: 103.7768 },
    tags: ["shaded", "nature", "hilly", "partial-gravel"],
    description:
      "The old railway line reclaimed as a green trail — deep tree canopy, a noticeably cooler microclimate, with some unpaved and gently undulating stretches.",
    path: [
      [1.3392, 103.7768],
      [1.3450, 103.7800],
      [1.3520, 103.7830],
      [1.3600, 103.7850],
      [1.3670, 103.7870],
    ],
  },
  {
    id: "west-coast-jurong",
    name: "West Coast Park → Jurong Lake Gardens",
    region: "west",
    distanceKm: 16,
    start: { name: "West Coast Park", lat: 1.2967, lng: 103.7649 },
    tags: ["flat", "coastal", "shaded", "nature"],
    description:
      "Waterfront park paths from West Coast out to the lakeside gardens at Jurong — a mix of sea breeze and shaded park connector.",
    path: [
      [1.2967, 103.7649],
      [1.3050, 103.7550],
      [1.3180, 103.7450],
      [1.3300, 103.7350],
      [1.3399, 103.7295],
    ],
  },
  {
    id: "kallang-bishan",
    name: "Kallang River PCN → Bishan–Ang Mo Kio Park",
    region: "central",
    distanceKm: 14,
    start: { name: "Kallang Riverside Park", lat: 1.3100, lng: 103.8714 },
    tags: ["flat", "shaded", "park-connector", "nature"],
    description:
      "Follows the Kallang River park connector upstream to the naturalised river and lawns of Bishan–Ang Mo Kio Park — well shaded in the northern half.",
    path: [
      [1.3100, 103.8714],
      [1.3200, 103.8650],
      [1.3300, 103.8580],
      [1.3400, 103.8500],
      [1.3526, 103.8352],
    ],
  },
  {
    id: "woodlands-admiralty",
    name: "Woodlands Waterfront → Admiralty Park",
    region: "north",
    distanceKm: 10,
    start: { name: "Woodlands Waterfront", lat: 1.4438, lng: 103.7859 },
    tags: ["coastal", "flat", "shaded", "scenic"],
    description:
      "A quieter northern coastal path with views across the Johor Strait, alternating between open waterfront and shaded park sections.",
    path: [
      [1.4438, 103.7859],
      [1.4400, 103.7920],
      [1.4350, 103.7980],
      [1.4300, 103.8010],
    ],
  },
  {
    id: "tampines-bedok-reservoir",
    name: "Tampines Eco Green → Bedok Reservoir",
    region: "east",
    distanceKm: 12,
    start: { name: "Tampines Eco Green", lat: 1.3496, lng: 103.9568 },
    tags: ["flat", "shaded", "park-connector", "quiet"],
    description:
      "A quiet residential park connector loop linking Tampines Eco Green to the calm waters of Bedok Reservoir.",
    path: [
      [1.3496, 103.9568],
      [1.3450, 103.9480],
      [1.3400, 103.9380],
      [1.3360, 103.9300],
      [1.3410, 103.9350],
    ],
  },
  {
    id: "southern-ridges",
    name: "Southern Ridges (Alexandra Linear Park → Mount Faber)",
    region: "south",
    distanceKm: 10,
    start: { name: "HarbourFront", lat: 1.2653, lng: 103.8200 },
    tags: ["hilly", "shaded", "scenic", "requires-dismount"],
    description:
      "Forest canopy walkways and hilltop views over the southern coast. Note: some elevated bridges and stair sections (e.g. Henderson Waves) require dismounting and carrying your bike.",
    path: [
      [1.2653, 103.8200],
      [1.2720, 103.8180],
      [1.2790, 103.8150],
      [1.2830, 103.8100],
    ],
  },
  {
    id: "sentosa-siloso",
    name: "Sentosa Boardwalk → Siloso Beach",
    region: "south",
    distanceKm: 8,
    start: { name: "Sentosa Boardwalk", lat: 1.2650, lng: 103.8220 },
    tags: ["coastal", "flat", "exposed", "scenic", "tourist"],
    description:
      "A short, easy island loop with open sea views — popular and can get crowded on weekends; boardwalk access may have an entry fee.",
    path: [
      [1.2650, 103.8220],
      [1.2560, 103.8180],
      [1.2500, 103.8150],
      [1.2470, 103.8280],
    ],
  },
  {
    id: "jurong-lake-gardens",
    name: "Jurong Lake Gardens Loop",
    region: "west",
    distanceKm: 7,
    start: { name: "Jurong Lake Gardens", lat: 1.3399, lng: 103.7295 },
    tags: ["flat", "shaded", "nature", "family-friendly"],
    description:
      "A calm, easy lakeside loop with good shade — a good pick for a short ride or when the weather isn't cooperating elsewhere.",
    path: [
      [1.3399, 103.7295],
      [1.3440, 103.7250],
      [1.3470, 103.7300],
      [1.3430, 103.7340],
      [1.3399, 103.7295],
    ],
  },
];

const AREAS = [
  { id: "any", name: "Surprise me (nearest good route)" },
  { id: "east", name: "East (East Coast / Bedok / Changi)" },
  { id: "northeast", name: "North-East (Punggol / Coney Island)" },
  { id: "north", name: "North (Woodlands / Admiralty)" },
  { id: "west", name: "West (West Coast / Jurong)" },
  { id: "central", name: "Central (Marina Bay / Kallang / Bishan / Rail Corridor)" },
  { id: "south", name: "South (HarbourFront / Sentosa)" },
];

const START_LOCATIONS = [
  { name: "Marina Bay", lat: 1.2836, lng: 103.8607 },
  { name: "Bedok / East Coast", lat: 1.3236, lng: 103.9273 },
  { name: "Changi", lat: 1.3644, lng: 103.9915 },
  { name: "Punggol", lat: 1.4043, lng: 103.9021 },
  { name: "Pasir Ris", lat: 1.3721, lng: 103.9474 },
  { name: "Tampines", lat: 1.3496, lng: 103.9568 },
  { name: "Woodlands", lat: 1.4382, lng: 103.7891 },
  { name: "Bishan", lat: 1.3526, lng: 103.8352 },
  { name: "Toa Payoh", lat: 1.3343, lng: 103.8563 },
  { name: "Kallang", lat: 1.3100, lng: 103.8714 },
  { name: "West Coast", lat: 1.2967, lng: 103.7649 },
  { name: "Jurong Lake", lat: 1.3399, lng: 103.7295 },
  { name: "Bukit Timah / Rail Corridor", lat: 1.3392, lng: 103.7768 },
  { name: "HarbourFront / Southern Ridges", lat: 1.2653, lng: 103.8200 },
  { name: "Sentosa", lat: 1.2494, lng: 103.8303 },
];
