/* global mapboxgl, scrollama, storyConfig */

const ALL_STORY_LAYERS = [
  "access-service-area",
  "outlets-supermarkets",
  "outlets-hawker-centres",
  "hdb-price-sqm",
  "hdb-floor-area",
  "hdb-access-context",
  "hdb-outside-500m"
];

const chaptersElement = document.getElementById("chapters");
const legendElement = document.getElementById("legend");
const mapStatus = document.getElementById("map-status");
const progressBar = document.querySelector("#progress span");

function createChapter(chapter, index) {
  const step = document.createElement("article");
  step.className = `step ${chapter.alignment || "left"}`;
  step.id = chapter.id;
  step.dataset.chapterIndex = String(index);
  step.innerHTML = `
    <div class="chapter-card">
      <p class="chapter-number">Chapter ${String(index + 1).padStart(2, "0")}</p>
      <h2>${chapter.title}</h2>
      <p>${chapter.description}</p>
      <div class="stat">
        ${chapter.stats.map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join("")}
      </div>
    </div>`;
  chaptersElement.appendChild(step);
}

storyConfig.chapters.forEach(createChapter);

function renderLegend(legend) {
  if (!legend) {
    legendElement.classList.remove("visible");
    return;
  }
  let body = `<h3>${legend.title}</h3>`;
  if (legend.type === "gradient") {
    body += `<div class="legend-gradient"></div><div class="legend-scale"><span>${legend.min}</span><span>${legend.max}</span></div>`;
  } else if (legend.type === "sizes") {
    body += legend.items.map(([label, size]) => `<div class="legend-row"><span class="legend-swatch" style="width:${size}px;height:${size}px;flex-basis:${size}px;background:#5d6b70"></span><span>${label}</span></div>`).join("");
  } else {
    body += legend.items.map(([label, color, shape]) => `<div class="legend-row"><span class="legend-swatch ${shape || ""}" style="background:${color}"></span><span>${label}</span></div>`).join("");
  }
  legendElement.innerHTML = body;
  legendElement.classList.add("visible");
}

mapboxgl.accessToken = storyConfig.accessToken;

const map = new mapboxgl.Map({
  container: "map",
  style: storyConfig.style,
  ...storyConfig.initialView,
  attributionControl: true,
  cooperativeGestures: true
});
map.scrollZoom.disable();
map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

function addFallbackSource(id, data) {
  if (!map.getSource(id)) map.addSource(id, { type: "geojson", data });
}

function addFallbackLayers() {
  if (!storyConfig.useLocalDataFallback) return;

  addFallbackSource("food-outlets-source", "data/food-outlets.geojson");
  addFallbackSource("food-access-source", "data/food-access-500m.geojson");
  addFallbackSource("hdb-address-source", "data/hdb-resale-addresses.geojson");

  if (!map.getLayer("access-service-area")) {
    map.addLayer({
      id: "access-service-area", type: "fill", source: "food-access-source",
      paint: { "fill-color": "#b56bd6", "fill-opacity": 0, "fill-outline-color": "#9847bd" }
    });
  }
  if (!map.getLayer("hdb-access-context")) {
    map.addLayer({
      id: "hdb-access-context", type: "circle", source: "hdb-address-source",
      paint: { "circle-radius": 3.5, "circle-color": "#606b60", "circle-opacity": 0, "circle-stroke-width": 0.25, "circle-stroke-color": "#ffffff" }
    });
  }
  if (!map.getLayer("hdb-price-sqm")) {
    map.addLayer({
      id: "hdb-price-sqm", type: "circle", source: "hdb-address-source",
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 2.2, 14, 6.5],
        "circle-color": ["interpolate", ["linear"], ["get", "median_price_sqm"], 2850, "#d7eef5", 3850, "#a5d8e4", 4536, "#77c4d8", 5167, "#6867ac", 6136, "#54236f", 10850, "#2b0d39"],
        "circle-opacity": 0,
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 0.25
      }
    });
  }
  if (!map.getLayer("hdb-floor-area")) {
    map.addLayer({
      id: "hdb-floor-area", type: "circle", source: "hdb-address-source",
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["get", "median_floor_area"], 31, 2.5, 67, 4, 102, 7, 133, 10, 243, 16],
        "circle-color": "#53666d",
        "circle-opacity": 0,
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 0.5
      }
    });
  }
  if (!map.getLayer("hdb-outside-500m")) {
    map.addLayer({
      id: "hdb-outside-500m", type: "circle", source: "hdb-address-source",
      filter: ["==", ["get", "outside_500m"], 1],
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 2.5, 14, 7],
        "circle-color": "#ef3326",
        "circle-opacity": 0,
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 0.4
      }
    });
  }
  if (!map.getLayer("outlets-supermarkets")) {
    map.addLayer({
      id: "outlets-supermarkets", type: "circle", source: "food-outlets-source",
      filter: ["==", ["get", "category"], "Supermarket"],
      paint: { "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 3, 14, 7], "circle-color": "#18b64b", "circle-opacity": 0, "circle-stroke-color": "#ffffff", "circle-stroke-width": 0.7 }
    });
  }
  if (!map.getLayer("outlets-hawker-centres")) {
    map.addLayer({
      id: "outlets-hawker-centres", type: "circle", source: "food-outlets-source",
      filter: ["==", ["get", "category"], "Hawker centre"],
      paint: { "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 3.5, 14, 7.5], "circle-color": "#249ac8", "circle-opacity": 0, "circle-stroke-color": "#ffffff", "circle-stroke-width": 0.7 }
    });
  }
}

function opacityProperty(layer) {
  const mapLayer = map.getLayer(layer);
  if (!mapLayer) return null;
  return { fill: "fill-opacity", circle: "circle-opacity", line: "line-opacity", symbol: "icon-opacity" }[mapLayer.type] || null;
}

function showChapter(chapter, index) {
  map.flyTo({ ...chapter.location, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1800, essential: true });
  ALL_STORY_LAYERS.forEach(layer => {
    const property = opacityProperty(layer);
    if (!property) return;
    let opacity = chapter.visibleLayers.includes(layer) ? 0.84 : 0;
    if (layer === "access-service-area" && opacity) opacity = 0.38;
    if (layer === "hdb-access-context" && opacity) opacity = 0.35;
    map.setPaintProperty(layer, property, opacity);
    if (map.getLayer(layer).type === "circle" && map.getPaintProperty(layer, "circle-stroke-opacity") !== undefined) {
      map.setPaintProperty(layer, "circle-stroke-opacity", opacity);
    }
  });
  renderLegend(chapter.legend);
  document.querySelectorAll(".step").forEach((element, elementIndex) => element.classList.toggle("active", elementIndex === index));
}

function popupHtml(properties) {
  if (properties.median_price_sqm !== undefined) {
    return `<div class="popup-title">${properties.address}</div><div class="popup-meta">${properties.town}<br>${properties.access_class}<br>Median price per m²: S$${Number(properties.median_price_sqm).toLocaleString()}<br>Median resale price: S$${Number(properties.median_resale_price).toLocaleString()}<br>Median floor area: ${properties.median_floor_area} m²<br>Transactions: ${properties.transaction_count}</div>`;
  }
  return `<div class="popup-title">${properties.name || properties.category}</div><div class="popup-meta">${properties.category || ""}<br>${properties.address || ""}</div>`;
}

map.on("load", () => {
  addFallbackLayers();
  mapStatus.textContent = "Map ready";
  mapStatus.classList.add("ready");
  showChapter(storyConfig.chapters[0], 0);

  const clickableLayers = ["outlets-supermarkets", "outlets-hawker-centres", "hdb-price-sqm", "hdb-floor-area", "hdb-access-context", "hdb-outside-500m"].filter(id => map.getLayer(id));
  map.on("click", event => {
    const features = map.queryRenderedFeatures(event.point, { layers: clickableLayers });
    if (!features.length) return;
    new mapboxgl.Popup({ closeButton: true, maxWidth: "290px" }).setLngLat(event.lngLat).setHTML(popupHtml(features[0].properties)).addTo(map);
  });
  map.on("mousemove", event => {
    map.getCanvas().style.cursor = map.queryRenderedFeatures(event.point, { layers: clickableLayers }).length ? "pointer" : "";
  });
});

map.on("error", event => {
  if (event.error) mapStatus.textContent = "Map data is still loading";
});

const scroller = scrollama();
scroller.setup({ step: ".step", offset: 0.52, progress: true })
  .onStepEnter(response => showChapter(storyConfig.chapters[Number(response.element.dataset.chapterIndex)], Number(response.element.dataset.chapterIndex)))
  .onStepProgress(response => {
    const total = storyConfig.chapters.length;
    const progress = (Number(response.element.dataset.chapterIndex) + response.progress) / total;
    progressBar.style.width = `${Math.max(0, Math.min(1, progress)) * 100}%`;
  });

window.addEventListener("resize", () => scroller.resize());
