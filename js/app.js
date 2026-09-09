/**
 * Wires up the form, geolocation, and results rendering.
 */

const SINGAPORE_BOUNDS = { minLat: 1.13, maxLat: 1.48, minLng: 103.55, maxLng: 104.09 };

function isWithinSingapore(lat, lng) {
  return (
    lat >= SINGAPORE_BOUNDS.minLat &&
    lat <= SINGAPORE_BOUNDS.maxLat &&
    lng >= SINGAPORE_BOUNDS.minLng &&
    lng <= SINGAPORE_BOUNDS.maxLng
  );
}

function populateAreaSelect() {
  const select = document.getElementById("destination-area");
  AREAS.forEach((area) => {
    const option = document.createElement("option");
    option.value = area.id;
    option.textContent = area.name;
    select.appendChild(option);
  });
}

function populateStartSelect() {
  const select = document.getElementById("start-location-select");
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Choose an area…";
  select.appendChild(placeholder);
  START_LOCATIONS.forEach((loc) => {
    const option = document.createElement("option");
    option.value = `${loc.lat},${loc.lng}`;
    option.textContent = loc.name;
    select.appendChild(option);
  });
}

function setDefaultDateTime() {
  const input = document.getElementById("start-time");
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  input.value = now.toISOString().slice(0, 16);
}

let currentStart = null; // { lat, lng, label }

function setStatus(message, isError) {
  const el = document.getElementById("location-status");
  el.textContent = message;
  el.classList.toggle("error", !!isError);
}

function useGeolocation() {
  if (!navigator.geolocation) {
    setStatus("Geolocation isn't available in this browser — pick an area below instead.", true);
    return;
  }
  setStatus("Locating you…", false);
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      if (!isWithinSingapore(latitude, longitude)) {
        setStatus("That location looks outside Singapore — pick an area below instead.", true);
        return;
      }
      currentStart = { lat: latitude, lng: longitude, label: "Your location" };
      document.getElementById("start-location-select").value = "";
      setStatus(`Using your current location (${latitude.toFixed(3)}, ${longitude.toFixed(3)}).`, false);
    },
    (err) => {
      setStatus(`Couldn't get your location (${err.message}) — pick an area below instead.`, true);
    },
    { timeout: 8000 }
  );
}

function onStartSelectChange(event) {
  const value = event.target.value;
  if (!value) return;
  const [lat, lng] = value.split(",").map(Number);
  const label = event.target.selectedOptions[0].textContent;
  currentStart = { lat, lng, label };
  setStatus(`Starting from ${label}.`, false);
}

function formatKm(n) {
  return `${n.toFixed(1)} km`;
}

function formatMinutes(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  if (h === 0) return `${m} min`;
  return `${h}h ${m}m`;
}

function renderResults(result, startTime) {
  const conditionsPanel = document.getElementById("conditions-panel");
  conditionsPanel.innerHTML = "";
  conditionsPanel.className = `conditions-panel ${result.conditions.severity}`;
  result.conditions.notes.forEach((note) => {
    const p = document.createElement("p");
    p.textContent = note;
    conditionsPanel.appendChild(p);
  });
  if (result.rideEndsAfterDark) {
    const p = document.createElement("p");
    p.textContent = `Your ride window ends at ${result.endTime.toLocaleTimeString("en-SG", {
      hour: "2-digit",
      minute: "2-digit",
    })}, after sunset — bring lights and reflective gear.`;
    conditionsPanel.appendChild(p);
  }

  const summary = document.getElementById("budget-summary");
  summary.textContent = `At an estimated ${result.effectiveSpeed.toFixed(
    1
  )} km/h for current conditions, you can cover about ${formatKm(result.maxDistanceKm)} in your time window.`;

  const list = document.getElementById("results-list");
  list.innerHTML = "";

  if (result.suggestions.length === 0) {
    list.innerHTML = "<p>No routes matched — try a longer duration.</p>";
    return;
  }

  result.suggestions.forEach(({ route, distanceToStart, distanceRatio }, i) => {
    const card = document.createElement("article");
    card.className = "route-card";

    const overBudget = distanceRatio > 1;
    const estRideMinutes = Math.min(route.distanceKm, result.maxDistanceKm) / result.effectiveSpeed * 60;

    card.innerHTML = `
      <h3>${i + 1}. ${route.name}</h3>
      <p class="route-meta">
        ${formatKm(route.distanceKm)} full route &middot;
        ${formatKm(distanceToStart)} from your start &middot;
        ~${formatMinutes(overBudget ? result.maxDistanceKm / result.effectiveSpeed * 60 : estRideMinutes)} ride
      </p>
      <p>${route.description}</p>
      ${overBudget ? `<p class="route-note">Longer than your time budget — plan to turn back partway, or extend your window.</p>` : ""}
      <p class="route-tags">${route.tags.map((t) => `<span>${t.replace("-", " ")}</span>`).join("")}</p>
    `;
    list.appendChild(card);
  });

  const startLabel = currentStart.label || "Start";
  setStartMarker(currentStart.lat, currentStart.lng, startLabel);
  renderRoutes(result.suggestions.map((s) => s.route));
}

async function handleSubmit(event) {
  event.preventDefault();
  const errorBox = document.getElementById("form-error");
  errorBox.textContent = "";

  if (!currentStart) {
    errorBox.textContent = "Please set a starting location first (use your location or pick an area).";
    return;
  }

  const startTimeValue = document.getElementById("start-time").value;
  const durationMinutes = Number(document.getElementById("duration").value);
  const areaId = document.getElementById("destination-area").value;

  if (!startTimeValue || !durationMinutes) {
    errorBox.textContent = "Please fill in a start time and ride duration.";
    return;
  }

  const startTime = new Date(startTimeValue);

  const submitButton = document.getElementById("submit-button");
  submitButton.disabled = true;
  submitButton.textContent = "Checking conditions…";

  try {
    const weather = await fetchConditions(currentStart.lat, currentStart.lng, startTime);
    const result = suggestRoutes({
      startLat: currentStart.lat,
      startLng: currentStart.lng,
      startTime,
      durationMinutes,
      areaId,
      weather,
    });
    renderResults(result, startTime);
    document.getElementById("results").hidden = false;
  } catch (err) {
    errorBox.textContent = `Couldn't fetch live conditions (${err.message}). Please try again.`;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Suggest my ride";
  }
}

function init() {
  populateAreaSelect();
  populateStartSelect();
  setDefaultDateTime();
  initMap();

  document.getElementById("use-location-button").addEventListener("click", useGeolocation);
  document.getElementById("start-location-select").addEventListener("change", onStartSelectChange);
  document.getElementById("ride-form").addEventListener("submit", handleSubmit);
}

document.addEventListener("DOMContentLoaded", init);
