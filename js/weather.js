/**
 * Weather lookup via Open-Meteo (free, no API key required).
 * https://open-meteo.com/
 */

const WMO_DESCRIPTIONS = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with hail",
};

/**
 * Fetch conditions for a location, for a specific target time (Date object).
 * Returns a plain object with the fields the planner needs, using the
 * forecast hour closest to targetTime.
 */
async function fetchConditions(lat, lng, targetTime) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,uv_index` +
    `&hourly=temperature_2m,apparent_temperature,precipitation_probability,rain,uv_index,wind_speed_10m,weather_code` +
    `&timezone=Asia%2FSingapore&forecast_days=2`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather lookup failed (${response.status})`);
  }
  const data = await response.json();

  const hourly = data.hourly;
  let hourIndex = 0;
  if (hourly && hourly.time) {
    let bestDiff = Infinity;
    hourly.time.forEach((t, i) => {
      const diff = Math.abs(new Date(t).getTime() - targetTime.getTime());
      if (diff < bestDiff) {
        bestDiff = diff;
        hourIndex = i;
      }
    });
  }

  const weatherCode = hourly.weather_code ? hourly.weather_code[hourIndex] : data.current?.weather_code ?? 0;

  return {
    time: hourly.time[hourIndex],
    temperatureC: hourly.temperature_2m[hourIndex],
    feelsLikeC: hourly.apparent_temperature[hourIndex],
    rainProbabilityPct: hourly.precipitation_probability
      ? hourly.precipitation_probability[hourIndex]
      : 0,
    rainMm: hourly.rain ? hourly.rain[hourIndex] : 0,
    uvIndex: hourly.uv_index ? hourly.uv_index[hourIndex] : 0,
    windSpeedKmh: hourly.wind_speed_10m ? hourly.wind_speed_10m[hourIndex] : 0,
    weatherCode,
    description: WMO_DESCRIPTIONS[weatherCode] || "Unknown",
  };
}

/**
 * Singapore's sunset time barely moves through the year (~18:50–19:25).
 * Use a fixed, conservative estimate rather than adding a whole almanac dependency.
 */
function estimatedSunset(date) {
  const sunset = new Date(date);
  sunset.setHours(19, 0, 0, 0);
  return sunset;
}
