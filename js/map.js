/**
 * Thin wrapper around Leaflet for showing the start point and suggested
 * route paths on a Singapore-centered map.
 */

let map;
let startMarker;
let routeLayers = [];

const ROUTE_COLORS = ["#1d7a6e", "#c65d24", "#2a5db0"];

function initMap() {
  map = L.map("map", { scrollWheelZoom: false }).setView([1.3521, 103.8198], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);
}

function clearRoutes() {
  routeLayers.forEach((layer) => map.removeLayer(layer));
  routeLayers = [];
}

function setStartMarker(lat, lng, label) {
  if (startMarker) {
    map.removeLayer(startMarker);
  }
  startMarker = L.marker([lat, lng]).addTo(map).bindPopup(label || "Start");
}

function renderRoutes(routes) {
  clearRoutes();
  const bounds = [];

  routes.forEach((route, i) => {
    const color = ROUTE_COLORS[i % ROUTE_COLORS.length];
    const line = L.polyline(route.path, { color, weight: 4, opacity: 0.85 }).addTo(map);
    line.bindPopup(`<strong>${route.name}</strong><br>${route.distanceKm} km`);
    routeLayers.push(line);
    route.path.forEach((p) => bounds.push(p));
  });

  if (startMarker) {
    bounds.push(startMarker.getLatLng());
  }

  if (bounds.length > 0) {
    map.fitBounds(bounds, { padding: [30, 30] });
  }
}
