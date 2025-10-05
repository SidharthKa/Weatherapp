/* Frontend logic:
 - Map with up to 2 pins (store coords)
 - Request backend for POWER weather data and for GES DISC AQ data
 - Chart time series for one or two locations (compare)
 - Probability chart: percent of days above threshold for each location
 - PDF export via html2canvas + jsPDF
 - Dark / light toggle
 - Text summary generation
*/

// ------------- CONFIG -------------
const BACKEND_BASE = "http://127.0.0.1:5000";
 // change to your deployed backend URL after deploy
const MAX_PINS = 2;

// Chart instances
let timeChart = null;
let probChart = null;

// state
const pins = []; // {lat, lon, marker}
let map, pinLayerGroup;

// initialize map
function initMap(){
  map = L.map('map').setView([20,78], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map);

  pinLayerGroup = L.layerGroup().addTo(map);

  map.on('click', (e) => {
    if (pins.length >= MAX_PINS) {
      alert(`You can compare up to ${MAX_PINS} locations. Clear pins to add new ones.`);
      return;
    }
    const m = L.marker(e.latlng).addTo(pinLayerGroup);
    const coord = { lat: parseFloat(e.latlng.lat.toFixed(4)), lon: parseFloat(e.latlng.lng.toFixed(4)), marker: m };
    pins.push(coord);
    updatePinsInfo();
  });

  document.getElementById('clearPins').addEventListener('click', () => {
    pins.forEach(p => pinLayerGroup.removeLayer(p.marker));
    pins.length = 0;
    updatePinsInfo();
  });

  updatePinsInfo();
}
function updatePinsInfo(){
  const el = document.getElementById('pinsInfo');
  if (pins.length === 0) el.innerText = "No locations selected";
  else el.innerHTML = pins.map((p,i) => `<div>Location ${i+1}: ${p.lat}, ${p.lon} <button data-i="${i}" class="removePin">Remove</button></div>`).join('');
  // attach remove handlers
  document.querySelectorAll('.removePin').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const idx = parseInt(ev.target.dataset.i,10);
      pinLayerGroup.removeLayer(pins[idx].marker);
      pins.splice(idx,1);
      updatePinsInfo();
    });
  });
}

// init charts as empty
function resetCharts(){
  if (timeChart) timeChart.destroy();
  if (probChart) probChart.destroy();
  timeChart = null; probChart = null;
}

// utility to build a human-readable summary message
function buildTextSummary(analyses, paramLabel, threshold){
  // analyses: [{locationLabel, avg, probOverThresh, dataPoints, aqSummary?}]
  const lines = [];
  lines.push(`Parameter: ${paramLabel}`);
  lines.push(`Threshold for probability: ${threshold === "" ? "none" : threshold}`);
  analyses.forEach((a, idx) => {
    lines.push(`Location ${idx+1} (${a.locationLabel}):`);
    lines.push(`  - Average ${paramLabel}: ${a.avg}`);
    lines.push(`  - Days above threshold: ${a.probOverThresh}% (${a.daysAbove}/${a.dataPoints})`);
    if (a.aqSummary) {
      lines.push(`  - Air Quality: ${a.aqSummary}`);
    }
  });
  // a gentle suggestion sentence
  const best = analyses.reduce((acc, cur) => (cur.probOverThresh < acc.probOverThresh ? cur : acc), analyses[0] || {probOverThresh:100});
  lines.push(`Recommendation: For lower probability of exceeding threshold, prefer location with lower percent value. Example: Location 1 has ${best.probOverThresh}%`);
  return lines.join('\n');
}

// fetch POWER (weather) via backend
async function fetchWeatherFromBackend(lat, lon, parameter, start, end){
  const url = `${BACKEND_BASE}/api/weather?lat=${lat}&lon=${lon}&parameter=${parameter}&start=${start}&end=${end}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error fetching weather data from backend");
  return res.json();
}

// fetch AQ from backend (GES DISC proxy) - returns summary text or numeric summary
async function fetchAQFromBackend(lat, lon, start, end){
  // backend will need to know which GES DISC product/variable to query and use Earthdata credentials
  const url = `${BACKEND_BASE}/api/aq?lat=${lat}&lon=${lon}&start=${start}&end=${end}`;
  const res = await fetch(url);
  if (!res.ok) {
    // return null but don't break
    return null;
  }
  return res.json();
}

// Build time series chart for 1-2 locations
function drawTimeSeries(dates, datasets, paramLabel){
  const ctx = document.getElementById('timeChart').getContext('2d');
  if (timeChart) timeChart.destroy();
  timeChart = new Chart(ctx, {
    type: 'line',
    data: { labels: dates, datasets },
    options: { interaction: { mode: 'index', intersect: false }, stacked:false, plugins: { title: { display: true, text: 'Time series comparison' } } }
  });
}

// draw probability bar chart
function drawProbability(analyses){
  const ctx = document.getElementById('probChart').getContext('2d');
  if (probChart) probChart.destroy();
  const labels = analyses.map((a,i)=> `Loc ${i+1}`);
  const data = analyses.map(a => a.probOverThresh);
  probChart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: '% days > threshold', data, backgroundColor: ['#0077cc','#ff7043'] }]},
    options: { plugins: { title: { display: true, text: 'Probability of exceeding threshold' } }, scales:{ y:{ beginAtZero:true, max:100 }} }
  });
}

// main function when clicking Get Data
async function handleGetData(){
  try {
    if (pins.length === 0) return alert("Please add at least one location (click map).");
    const param = document.getElementById('parameter').value;
    const paramLabel = document.getElementById('parameter').selectedOptions[0].text;
    const start = document.getElementById('start-date').value;
    const end = document.getElementById('end-date').value;
    if (!start || !end) return alert("Please select start and end dates.");
    if (new Date(start) > new Date(end)) return alert("Start date must be before end date.");

    const thresholdRaw = document.getElementById('threshold').value;
    const threshold = thresholdRaw === "" ? null : Number(thresholdRaw);

    // For comparison we must align dates. We'll assume API returns daily values for full range.
    const allDates = []; // use dates from first dataset for chart labels
    const datasets = [];
    const analyses = [];

    for (let i=0;i<pins.length;i++){
      const p = pins[i];
      const json = await fetchWeatherFromBackend(p.lat, p.lon, param, start, end);
      // NASA POWER returns data.properties.parameter[param] {YYYYMMDD: value}
      if (!json || !json.properties || !json.properties.parameter || !json.properties.parameter[param]) {
        throw new Error("Invalid data returned from POWER API");
      }
      const paramObj = json.properties.parameter[param];
      const dates = Object.keys(paramObj).sort();
      const values = dates.map(d => paramObj[d] === null ? null : Number(paramObj[d]));
      if (i===0) allDates.push(...dates);
      // dataset for chart
      datasets.push({
        label: `Loc ${i+1} (${p.lat},${p.lon})`,
        data: values,
        fill:false,
        tension:0.2
      });

      // compute average and probability
      const validValues = values.filter(v => v !== null && !isNaN(v));
      const avg = validValues.reduce((a,b)=>a+b,0) / (validValues.length || 1);
      let daysAbove = 0;
      if (threshold !== null) {
        daysAbove = validValues.filter(v => v > threshold).length;
      }
      const probOverThresh = threshold === null ? 0 : Math.round((daysAbove / (validValues.length || 1)) * 100);

      // try fetch AQ summary (optional)
      let aqSummary = null;
      try {
        const aqJson = await fetchAQFromBackend(p.lat, p.lon, start, end);
        if (aqJson && aqJson.summary) {
          aqSummary = aqJson.summary; // the backend should return a friendly summary text or numeric average
        }
      } catch(e){ aqSummary = null; }

      analyses.push({
        locationLabel: `${p.lat},${p.lon}`,
        avg: avg.toFixed(2),
        daysAbove,
        dataPoints: validValues.length,
        probOverThresh,
        aqSummary
      });
    }

    // Draw charts and update summary
    resetCharts();
    drawTimeSeries(allDates, datasets, paramLabel);
    drawProbability(analyses);

    // text summary
    const text = buildTextSummary(analyses, paramLabel, threshold === null ? "" : threshold);
    document.getElementById('textSummary').innerText = text;

    // AQ summary area (simple)
    const aqSummaryEl = document.getElementById('aqSummary');
    aqSummaryEl.innerHTML = analyses.map((a,i)=> `<div><strong>Loc ${i+1} AQ</strong>: ${a.aqSummary ? a.aqSummary : 'No AQ data'}</div>`).join('');
  } catch(err){
    console.error(err);
    alert("Error during analysis: " + (err.message || err));
  }
}

// PDF export
async function exportPdf(){
  const node = document.querySelector('main#appRoot');
  const canvas = await html2canvas(node, { scale: 1.5 });
  const imgData = canvas.toDataURL('image/png');
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'landscape' });
  const w = pdf.internal.pageSize.getWidth();
  const h = pdf.internal.pageSize.getHeight();
  pdf.addImage(imgData, 'PNG', 5, 5, w-10, h-10);
  pdf.save('weather_report.pdf');
}

// theme toggle
function initTheme(){
  const toggle = document.getElementById('themeToggle');
  const label = document.getElementById('themeLabel');
  // default light
  if (!localStorage.getItem('dashTheme')) localStorage.setItem('dashTheme','light');
  applyTheme(localStorage.getItem('dashTheme'));
  toggle.checked = localStorage.getItem('dashTheme') === 'dark';
  toggle.addEventListener('change', () => {
    const t = toggle.checked ? 'dark' : 'light';
    applyTheme(t);
    localStorage.setItem('dashTheme', t);
  });
  function applyTheme(t){
    document.documentElement.setAttribute('data-theme', t);
    label.innerText = t === 'dark' ? '☀️ Light' : '🌙 Dark';
  }
}

// initial wiring
function wireUp(){
  document.getElementById('getData').addEventListener('click', handleGetData);
  document.getElementById('exportPdf').addEventListener('click', exportPdf);
  initTheme();
  initMap();
}

window.addEventListener('load', wireUp);
