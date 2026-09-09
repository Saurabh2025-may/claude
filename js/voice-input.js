/**
 * Voice input using the browser's built-in SpeechRecognition (Web Speech API).
 * No external API/key needed — Chrome/Edge only. Lets the rider speak a
 * request like "I'm at Bedok, I've got 90 minutes, heading east" and have
 * it fill in the form.
 */

const NUMBER_WORDS = {
  half: 0.5,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  a: 1,
  an: 1,
};

const AREA_KEYWORDS = [
  { id: "northeast", keywords: ["north east", "north-east", "northeast", "punggol", "coney island"] },
  { id: "north", keywords: ["north", "woodlands", "admiralty"] },
  { id: "west", keywords: ["west", "jurong"] },
  { id: "south", keywords: ["south", "harbourfront", "sentosa"] },
  { id: "central", keywords: ["central", "marina bay", "kallang", "bishan", "rail corridor", "bukit timah"] },
  { id: "east", keywords: ["east", "bedok", "changi", "pasir ris", "tampines"] },
];

function isSpeechRecognitionSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function createRecognizer() {
  const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionImpl();
  recognition.lang = "en-SG";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  return recognition;
}

function parseDurationMinutes(transcript) {
  let totalMinutes = 0;
  let found = false;

  const hourMatch = transcript.match(/(\d+(?:\.\d+)?|half|a|an|one|two|three|four|five)\s*(?:hours?|hrs?)/);
  if (hourMatch) {
    const raw = hourMatch[1];
    const value = NUMBER_WORDS[raw] !== undefined ? NUMBER_WORDS[raw] : parseFloat(raw);
    totalMinutes += value * 60;
    found = true;
  }

  const minMatch = transcript.match(/(\d+)\s*(?:minutes?|mins?)/);
  if (minMatch) {
    totalMinutes += parseInt(minMatch[1], 10);
    found = true;
  }

  if (!found && /half an hour/.test(transcript)) {
    totalMinutes = 30;
    found = true;
  }

  if (!found) return null;
  return Math.round(totalMinutes);
}

function parseStartLocation(transcript) {
  let best = null;
  START_LOCATIONS.forEach((loc) => {
    const aliases = loc.name.toLowerCase().split("/").map((s) => s.trim());
    aliases.forEach((alias) => {
      if (alias && transcript.includes(alias)) {
        if (!best || alias.length > best.matchedLength) {
          best = { loc, matchedLength: alias.length };
        }
      }
    });
  });
  return best ? best.loc : null;
}

function parseAreaPreference(transcript) {
  for (const entry of AREA_KEYWORDS) {
    for (const kw of entry.keywords) {
      if (transcript.includes(kw)) {
        return entry.id;
      }
    }
  }
  return null;
}

/**
 * @param {string} rawTranscript
 * @returns {{ location: object|null, durationMinutes: number|null, areaId: string|null }}
 */
function parseVoiceCommand(rawTranscript) {
  const transcript = rawTranscript.toLowerCase();
  return {
    location: parseStartLocation(transcript),
    durationMinutes: parseDurationMinutes(transcript),
    areaId: parseAreaPreference(transcript),
  };
}
