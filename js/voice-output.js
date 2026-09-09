/**
 * Text-to-speech via the Inworld AI TTS REST API.
 * https://docs.inworld.ai/tts/synthesize-speech
 *
 * The API key is entered by the user and kept only in this browser's
 * localStorage — it is sent directly from the browser to Inworld's API.
 * There is no backend, so the key is visible in this browser's network
 * requests; only use this on a device/browser you trust, and don't
 * publicly share a deployment with your key already saved in it.
 */

const INWORLD_TTS_ENDPOINT = "https://api.inworld.ai/tts/v1/voice";
const INWORLD_STORAGE_KEYS = {
  apiKey: "inworldApiKey",
  voiceId: "inworldVoiceId",
  modelId: "inworldModelId",
};
const INWORLD_DEFAULTS = {
  voiceId: "Ashley",
  modelId: "inworld-tts-1.5-max",
};

function getInworldSettings() {
  return {
    apiKey: localStorage.getItem(INWORLD_STORAGE_KEYS.apiKey) || "",
    voiceId: localStorage.getItem(INWORLD_STORAGE_KEYS.voiceId) || INWORLD_DEFAULTS.voiceId,
    modelId: localStorage.getItem(INWORLD_STORAGE_KEYS.modelId) || INWORLD_DEFAULTS.modelId,
  };
}

function saveInworldSettings({ apiKey, voiceId, modelId }) {
  localStorage.setItem(INWORLD_STORAGE_KEYS.apiKey, apiKey || "");
  localStorage.setItem(INWORLD_STORAGE_KEYS.voiceId, voiceId || INWORLD_DEFAULTS.voiceId);
  localStorage.setItem(INWORLD_STORAGE_KEYS.modelId, modelId || INWORLD_DEFAULTS.modelId);
}

function hasInworldApiKey() {
  return !!getInworldSettings().apiKey;
}

/**
 * Synthesize speech for `text` and play it. Throws on failure so callers
 * can surface a status message.
 */
async function speakWithInworld(text) {
  const { apiKey, voiceId, modelId } = getInworldSettings();
  if (!apiKey) {
    throw new Error("No Inworld API key saved yet — add one in Voice settings.");
  }

  // The API accepts up to 2000 characters per request.
  const trimmedText = text.length > 2000 ? `${text.slice(0, 1990)}…` : text;

  const response = await fetch(INWORLD_TTS_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: trimmedText,
      voiceId,
      modelId,
      audioConfig: { audioEncoding: "MP3", sampleRateHertz: 24000 },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Inworld TTS request failed (${response.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`);
  }

  const data = await response.json();
  if (!data.audioContent) {
    throw new Error("Inworld TTS response had no audio content.");
  }

  const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
  await audio.play();
  return audio;
}
