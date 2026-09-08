/* global mapboxgl, storyConfig */
const ALL_STORY_LAYERS = ['access-service-area', 'outlets-supermarkets', 'outlets-hawker-centres', 'hdb-price-sqm', 'hdb-floor-area', 'hdb-access-context', 'hdb-outside-500m'];
const chaptersElement = document.getElementById('chapters');
const legendElement = document.getElementById('legend');
const legendBody = document.getElementById('legend-body');
const mapStatus = document.getElementById('map-status');
const progressBar = document.querySelector('#progress span');
const selector = document.getElementById('chapter-select');
const positionLabel = document.getElementById('chapter-position');
const mobileQuery = window.matchMedia('(max-width: 760px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const priceExpression = ['interpolate', ['linear'], ['get', 'median_price_sqm'], ...storyConfig.priceStops.flat()];
const floorExpression = ['sqrt', ['*', ['get', 'median_floor_area'], storyConfig.floorAreaScale]];
let currentIndex = -1;
let map;
let mapReady = false;
let activePopup;
let placeMarker;
let scheduled = false;

function createChapter(chapter, index) {
  const step = document.createElement('article');
  step.className = `step left ${chapter.kind || ''}`;
  step.id = chapter.id;
  step.dataset.chapterIndex = index;
  step.setAttribute('aria-labelledby', `${chapter.id}-title`);
  const media = chapter.image ? `<figure class="place-photo"><img src="${chapter.image.src}" alt="${escapeHTML(chapter.image.alt)}" width="900" height="1200" loading="lazy"><figcaption>${escapeHTML(chapter.image.caption)} <a href="${chapter.image.source}" target="_blank" rel="noreferrer">Source</a> · <a href="${chapter.image.license}" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>. Display cropped; full photograph at source.</figcaption><p class="photo-error" hidden>Photograph unavailable. The linked source shows Yuhua Village Market and Food Centre in September 2025.</p></figure>` : '';
  const stats = chapter.stats?.length ? `<div class="stat">${chapter.stats.map(([value,label]) => `<div><strong>${escapeHTML(value)}</strong><span>${escapeHTML(label)}</span></div>`).join('')}</div>` : '';
  const comparison = chapter.comparison ? `<div class="comparison" role="img" aria-label="Transaction median price per square metre: within 500 metres, 4875 dollars; outside, 4662 dollars. Within is 4.6 percent higher.">${chapter.comparison.map(([label,value],i) => `<div class="comparison-row"><div><span>${label}</span><strong>S$${Math.round(value).toLocaleString('en-SG')}</strong></div><div class="bar-track"><span class="bar ${i ? 'outside' : ''}" style="width:${value / 6000 * 100}%"></span></div></div>`).join('')}<div class="comparison-axis"><span>0</span><span>S$6,000/m²</span></div><p class="comparison-result">4.6% higher within the service areas</p></div>` : '';
  step.innerHTML = `<div class="chapter-card"><p class="chapter-number">Chapter ${String(index+1).padStart(2,'0')}${chapter.kind === 'qualitative' ? ' · Qualitative perspective' : ''}</p><h2 id="${chapter.id}-title">${escapeHTML(chapter.title)}</h2>${media}<p>${escapeHTML(chapter.description)}</p>${stats}${comparison}${(chapter.paragraphs || []).map(p => `<p>${escapeHTML(p)}</p>`).join('')}${chapter.source ? `<p class="source-note"><a href="${chapter.source.url}" target="_blank" rel="noreferrer">${escapeHTML(chapter.source.label)}</a></p>` : ''}${chapter.note ? `<p class="method-note">${escapeHTML(chapter.note)}</p>` : ''}</div>`;
  step.querySelector('img')?.addEventListener('error', event => {
    event.target.hidden = true;
    step.querySelector('.photo-error').hidden = false;
  });
  chaptersElement.appendChild(step);
  selector.add(new Option(`${String(index+1).padStart(2,'0')} · ${chapter.nav || chapter.title}`, chapter.id));
}
selector.add(new Option('Introduction','top'));
storyConfig.chapters.forEach(createChapter);
const steps = [...document.querySelectorAll('.step')];
selector.addEventListener('change', () => {
  const id = selector.value;
  const target = document.getElementById(id);
  history.replaceState(null,'',`#${id}`);
  target.scrollIntoView({behavior: reducedMotion.matches ? 'instant' : 'smooth',block:'start'});
});

function renderLegend(legend) {
  if (!legend) { legendElement.classList.remove('visible'); return; }
  let body = '';
  if (legend.type === 'gradient') {
    const stops = storyConfig.priceStops;
    const min = stops[0][0], max = stops.at(-1)[0];
    body = `<div class="legend-gradient" style="background:linear-gradient(90deg,${stops.map(([v,c])=>`${c} ${(v-min)/(max-min)*100}%`).join(',')})"></div><div class="legend-scale"><span>S$2,850</span><span>S$10,850</span></div><p class="legend-note">Continuous scale · darker means higher</p>`;
  } else if (legend.type === 'sizes') {
    body = `<div class="size-key">${legend.items.map(v=>{const diameter=2*Math.sqrt(v*storyConfig.floorAreaScale);return `<div class="legend-row"><span class="legend-swatch" style="width:${diameter}px;height:${diameter}px;flex-basis:${diameter}px;background:#53666d"></span><span>${v} m²</span></div>`;}).join('')}</div><p class="legend-note">Circle area is proportional to floor area</p>`;
  } else {
    body = legend.items.map(([label,color,shape])=>`<div class="legend-row"><span class="legend-swatch ${shape || ''}" style="background:${color}"></span><span>${label}</span></div>`).join('');
  }
  legendElement.querySelector('summary').textContent = legend.title;
  legendBody.innerHTML = body;
  legendElement.classList.add('visible');
}

function configureLegend() {
  legendElement.querySelector('details').open = !mobileQuery.matches;
}
configureLegend();

function addFallbackSource(id, data) {
  if (!map.getSource(id)) map.addSource(id, { type: "geojson", data });
}

function addFallbackLayers() {
  if (!storyConfig.useLocalDataFallback) return;

  if (!map.getLayer("outlets-supermarkets") || !map.getLayer("outlets-hawker-centres")) addFallbackSource("food-outlets-source", "data/food-outlets.geojson");
  if (!map.getLayer("access-service-area")) addFallbackSource("food-access-source", "data/food-access-500m.geojson");
  if (ALL_STORY_LAYERS.some(id => id.startsWith("hdb-") && !map.getLayer(id))) addFallbackSource("hdb-address-source", "data/hdb-resale-addresses.geojson");

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
        "circle-color": priceExpression,
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
        "circle-radius": floorExpression,
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

function applyEncodings() {
  // The same expressions apply to Studio vector layers and any GeoJSON fallback.
  if (map.getLayer('hdb-price-sqm')) map.setPaintProperty('hdb-price-sqm','circle-color',priceExpression);
  if (map.getLayer('hdb-floor-area')) map.setPaintProperty('hdb-floor-area','circle-radius',floorExpression);
  if (map.getLayer('hdb-access-context')) map.setFilter('hdb-access-context',['==',['get','outside_500m'],0]);
}

function cameraOptions(chapter) {
  const width = window.innerWidth;
  const cardWidth = steps[storyConfig.chapters.indexOf(chapter)]?.getBoundingClientRect().width || 400;
  const padding = mobileQuery.matches ? {left:20,right:20,top:18,bottom:36} : {left:cardWidth + Math.max(28,width*.045) + 24,right:40,top:74,bottom:54};
  if (chapter.location.zoom < 12) {
    const fitted = map.cameraForBounds([[103.60,1.22],[104.02,1.47]],{padding,maxZoom:chapter.location.zoom});
    return {...chapter.location,...fitted,padding};
  }
  return {...chapter.location,padding};
}

function showChapter(index, animate = true) {
  currentIndex = index;
  const chapter = storyConfig.chapters[index];
  steps.forEach((step,i)=>step.classList.toggle('active',i===index));
  selector.value = chapter?.id || 'top';
  positionLabel.textContent = chapter ? `${index+1} / ${steps.length}` : 'Introduction';
  progressBar.style.width = `${chapter ? (index+1)/steps.length*100 : 0}%`;
  renderLegend(chapter?.legend);
  if (!mapReady) return;
  activePopup?.remove();
  placeMarker?.remove();
  const visible = chapter?.visibleLayers || storyConfig.chapters[0].visibleLayers;
  ALL_STORY_LAYERS.forEach(id => {
    const layer = map.getLayer(id);
    if (!layer) return;
    const isVisible = visible.includes(id);
    map.setLayoutProperty(id,'visibility',isVisible?'visible':'none');
    if (layer.type === 'circle') {
      const opacity = !isVisible ? 0 : id==='hdb-access-context' ? .55 : id==='hdb-floor-area' ? .68 : .88;
      map.setPaintProperty(id,'circle-opacity',opacity);
      map.setPaintProperty(id,'circle-stroke-opacity',opacity);
    } else if (layer.type === 'fill') map.setPaintProperty(id,'fill-opacity',isVisible ? .28 : 0);
  });
  if (chapter?.kind==='qualitative') {
    const label = document.createElement('div');
    label.className = 'place-marker';
    label.textContent = 'Yuhua Village · Blk 254';
    placeMarker = new mapboxgl.Marker({element:label,anchor:'bottom'}).setLngLat(chapter.location.center).addTo(map);
  }
  const camera = chapter ? cameraOptions(chapter) : {...storyConfig.initialView,padding:{left:0,right:0,top:0,bottom:0}};
  map.flyTo({...camera,duration:!animate || reducedMotion.matches?0:900});
}

function updateActiveChapter() {
  scheduled = false;
  const line = mobileQuery.matches ? 56 + window.innerHeight*.42 + 48 : window.innerHeight*.5;
  let next = -1;
  for (let i=0;i<steps.length;i++) if(steps[i].getBoundingClientRect().top<=line) next=i;
  if (next!==currentIndex) showChapter(next);
}
function scheduleChapterCheck() {
  if (!scheduled) { scheduled=true; requestAnimationFrame(updateActiveChapter); }
}
window.addEventListener('scroll',scheduleChapterCheck,{passive:true});
window.addEventListener('resize',()=>{
  map?.resize();
  if (mapReady) showChapter(currentIndex,false);
  scheduleChapterCheck();
});
mobileQuery.addEventListener('change',configureLegend);
document.fonts.ready.then(scheduleChapterCheck);

function popupHtml(p) {
  if (p.median_price_sqm!==undefined) return `<div class="popup-title">${escapeHTML(p.address)}</div><div class="popup-meta">${escapeHTML(p.town)}<br>${escapeHTML(p.access_class)}<br>Median price per m²: S$${Number(p.median_price_sqm).toLocaleString('en-SG')}<br>Median resale price: S$${Number(p.median_resale_price).toLocaleString('en-SG')}<br>Median floor area: ${escapeHTML(p.median_floor_area)} m²<br>Transactions: ${escapeHTML(p.transaction_count)}</div>`;
  return `<div class="popup-title">${escapeHTML(p.name || p.category)}</div><div class="popup-meta">${escapeHTML(p.category)}<br>${escapeHTML(p.address)}</div>`;
}
function clickableLayers() {
  return (storyConfig.chapters[currentIndex]?.visibleLayers || storyConfig.chapters[0].visibleLayers).filter(id=>map.getLayer(id)?.type==='circle' && map.getLayoutProperty(id,'visibility')!=='none');
}
function mapMessage(message) {
  mapStatus.textContent=message;
  mapStatus.classList.remove('ready');
}
try {
  if(typeof mapboxgl==='undefined') throw new Error('Map library unavailable');
  mapboxgl.accessToken=storyConfig.accessToken;
  map = new mapboxgl.Map({container:'map',style:storyConfig.style,...storyConfig.initialView,attributionControl:true,cooperativeGestures:true});
  map.scrollZoom.disable();
  map.addControl(new mapboxgl.NavigationControl({showCompass:false}),'top-right');
  const loadTimer = setTimeout(()=>{if(!mapReady)mapMessage('The map is taking longer to load. You can still read the story below.');},12000);
  map.on('load',()=>{
    clearTimeout(loadTimer);
    addFallbackLayers();
    applyEncodings();
    mapReady=true;
    mapStatus.classList.add('ready');
    showChapter(currentIndex,false);
    map.on('click',event=>{
      const features=map.queryRenderedFeatures(event.point,{layers:clickableLayers()});
      if(!features.length)return;
      activePopup?.remove();
      activePopup=new mapboxgl.Popup({maxWidth:'290px'}).setLngLat(event.lngLat).setHTML(popupHtml(features[0].properties)).addTo(map);
    });
    map.on('mousemove',event=>{map.getCanvas().style.cursor=map.queryRenderedFeatures(event.point,{layers:clickableLayers()}).length?'pointer':'';});
  });
  map.on('error',()=>mapMessage('Some map content could not load. The chapter text and figures remain available.'));
} catch(error) {
  mapMessage('The interactive map is unavailable. You can still read all seven chapters below.');
}
updateActiveChapter();
