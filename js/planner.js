/**
 * Core suggestion logic: given a start location, start time, duration and
 * an optional destination area, rank the curated routes taking current
 * weather conditions into account.
 */

const BASE_SPEED_KMH = 16; // relaxed leisure cycling pace

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

/**
 * Turn raw weather into an effective speed multiplier and a list of
 * human-readable condition notes / tag boosts used for scoring.
 */
function assessConditions(weather) {
  let speedMultiplier = 1;
  const notes = [];
  const boostTags = [];
  const penalizeTags = [];
  let severity = "good"; // good | caution | poor

  const isRaining = weather.rainMm > 0.2 || weather.weatherCode >= 51;
  const highRainChance = weather.rainProbabilityPct >= 60;

  if (isRaining || highRainChance) {
    speedMultiplier *= 0.7;
    penalizeTags.push("coastal", "exposed", "hilly");
    boostTags.push("shaded", "park-connector");
    notes.push(
      isRaining
        ? `${weather.description} expected (${weather.rainProbabilityPct}% chance) — consider a shorter, sheltered route or rescheduling.`
        : `High chance of rain (${weather.rainProbabilityPct}%) — pick a route with bail-out points.`
    );
    severity = isRaining ? "poor" : "caution";
  }

  if (weather.feelsLikeC >= 34) {
    speedMultiplier *= 0.85;
    boostTags.push("shaded", "nature");
    penalizeTags.push("exposed");
    notes.push(
      `Feels like ${Math.round(weather.feelsLikeC)}°C — heat stress risk. Favouring shaded routes; bring extra water.`
    );
    if (severity === "good") severity = "caution";
  }

  if (weather.uvIndex >= 8) {
    notes.push(`UV index ${Math.round(weather.uvIndex)} (very high) — sunscreen and a cap are strongly recommended.`);
    if (severity === "good") severity = "caution";
  }

  if (weather.windSpeedKmh >= 25) {
    speedMultiplier *= 0.9;
    penalizeTags.push("exposed", "coastal");
    notes.push(`Wind around ${Math.round(weather.windSpeedKmh)} km/h — exposed coastal stretches will feel harder.`);
    if (severity === "good") severity = "caution";
  }

  if (notes.length === 0) {
    notes.push(`${weather.description}, feels like ${Math.round(weather.feelsLikeC)}°C — good riding conditions.`);
  }

  return { speedMultiplier, notes, boostTags, penalizeTags, severity };
}

function scoreRoute(route, { startLat, startLng, maxDistanceKm, areaId, boostTags, penalizeTags }) {
  const distanceToStart = haversineKm(startLat, startLng, route.start.lat, route.start.lng);

  // Distance fit: how well the route length matches the time budget.
  const distanceRatio = route.distanceKm / maxDistanceKm;
  let distanceFitScore;
  if (distanceRatio <= 1) {
    // Fits within budget; prefer routes that use most of the available time.
    distanceFitScore = distanceRatio * 10;
  } else {
    // Over budget: still suggest it (rider can turn back early) but penalize.
    distanceFitScore = 10 - (distanceRatio - 1) * 10;
  }

  const proximityScore = Math.max(0, 10 - distanceToStart / 2);

  const areaScore = areaId && areaId !== "any" && route.region === areaId ? 6 : 0;

  const tagBoost = route.tags.filter((t) => boostTags.includes(t)).length * 1.5;
  const tagPenalty = route.tags.filter((t) => penalizeTags.includes(t)).length * 1.5;

  const total = distanceFitScore + proximityScore + areaScore + tagBoost - tagPenalty;

  return { total, distanceToStart, distanceRatio };
}

/**
 * @param {Object} params
 * @param {number} params.startLat
 * @param {number} params.startLng
 * @param {Date} params.startTime
 * @param {number} params.durationMinutes
 * @param {string} params.areaId - 'any' or a region id from AREAS
 * @param {Object} params.weather - result of fetchConditions()
 */
function suggestRoutes(params) {
  const { startLat, startLng, startTime, durationMinutes, areaId, weather } = params;

  const conditions = assessConditions(weather);
  const durationHours = durationMinutes / 60;
  const effectiveSpeed = BASE_SPEED_KMH * conditions.speedMultiplier;
  const maxDistanceKm = durationHours * effectiveSpeed;

  const scored = ROUTES.map((route) => {
    const score = scoreRoute(route, {
      startLat,
      startLng,
      maxDistanceKm,
      areaId,
      boostTags: conditions.boostTags,
      penalizeTags: conditions.penalizeTags,
    });
    return { route, ...score };
  }).sort((a, b) => b.total - a.total);

  const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
  const sunset = estimatedSunset(startTime);
  const rideEndsAfterDark = endTime.getTime() > sunset.getTime();

  return {
    conditions,
    effectiveSpeed,
    maxDistanceKm,
    endTime,
    rideEndsAfterDark,
    suggestions: scored.slice(0, 3),
  };
}
