const CACHE_KEY = 'minimal_weather_cache_v1';
const CACHE_TTL_MS = 15 * 60 * 1000; 
const GEOLOCATION_TIMEOUT_MS = 10000; 

const DEFAULT_LOCATION = {
  lat: 6.5244,
  lon: 3.3792,
  name: 'Lagos, Nigeria',
};


const elements = {
  locationName: document.getElementById('location-name'),
  currentDate: document.getElementById('current-date'),
  dayNightIcon: document.getElementById('day-night-icon'),
  locationNotice: document.getElementById('location-notice'),
  useLocationBtn: document.getElementById('use-location-btn'),
  cacheNotice: document.getElementById('cache-notice'),
  weatherContent: document.getElementById('weather-content'),
  currentTemp: document.getElementById('current-temp'),
  hourlyStrip: document.getElementById('hourly-strip'),
  detailsGrid: document.getElementById('details-grid'),
  dailyRow: document.getElementById('daily-row'),
  errorState: document.getElementById('error-state'),
  retryBtn: document.getElementById('retry-btn'),
};


const WEATHER_ICONS = {
  'clear-day': `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2"></path>
      <path d="M12 20v2"></path>
      <path d="m4.93 4.93 1.41 1.41"></path>
      <path d="m17.66 17.66 1.41 1.41"></path>
      <path d="M2 12h2"></path>
      <path d="M20 12h2"></path>
      <path d="m6.34 17.66-1.41 1.41"></path>
      <path d="m19.07 4.93-1.41 1.41"></path>
    </svg>
  `,
  'clear-night': `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
    </svg>
  `,
  'partly-cloudy-day': `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 2v2"></path>
      <path d="m4.93 4.93 1.41 1.41"></path>
      <path d="M20 12h2"></path>
      <path d="m19.07 4.93-1.41 1.41"></path>
      <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"></path>
      <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"></path>
    </svg>
  `,
  'partly-cloudy-night': `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 3a4.5 4.5 0 0 0 5.5 5.5 6 6 0 0 1-1.6 4.1"></path>
      <path d="M13 21H7a4.5 4.5 0 1 1 4.4-5.4H13a2.7 2.7 0 0 1 0 5.4Z"></path>
    </svg>
  `,
  cloudy: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
    </svg>
  `,
  fog: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
      <path d="M5 18h14"></path>
      <path d="M7 21h10"></path>
    </svg>
  `,
  drizzle: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
      <path d="M8 19v1"></path>
      <path d="M12 18v1"></path>
      <path d="M16 19v1"></path>
    </svg>
  `,
  rain: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
      <path d="m8 18-1.5 3"></path>
      <path d="m12.5 18-1.5 3"></path>
      <path d="m17 18-1.5 3"></path>
    </svg>
  `,
  thunderstorm: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"></path>
      <path d="m13 12-3 5h4l-3 5"></path>
    </svg>
  `,
  snow: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
      <path d="M8 18h.01"></path>
      <path d="M12 18h.01"></path>
      <path d="M16 18h.01"></path>
      <path d="M10 21h.01"></path>
      <path d="M14 21h.01"></path>
    </svg>
  `,
};

const WEATHER_LABELS = {
  'clear-day': 'Clear sky',
  'clear-night': 'Clear night',
  'partly-cloudy-day': 'Partly cloudy',
  'partly-cloudy-night': 'Partly cloudy night',
  cloudy: 'Cloudy',
  fog: 'Foggy',
  drizzle: 'Drizzle',
  rain: 'Rain',
  thunderstorm: 'Thunderstorm',
  snow: 'Snow',
};


function weatherCodeToIcon(code, isDay = 1) {
  const daytime = Boolean(isDay);
  if (code === 0) {
    return daytime ? 'clear-day' : 'clear-night';
  }
  if (code === 1 || code === 2) {
    return daytime ? 'partly-cloudy-day' : 'partly-cloudy-night';
  }
  if (code === 3) {
    return 'cloudy';
  }
  if (code === 45 || code === 48) {
    return 'fog';
  }
  if ([51, 53, 55, 56, 57].includes(code)) {
    return 'drizzle';
  }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return 'rain';
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return 'snow';
  }
  if ([95, 96, 99].includes(code)) {
    return 'thunderstorm';
  }
  return 'cloudy';
}


function degreesToCompass(degrees) {
  if (typeof degrees !== 'number' || Number.isNaN(degrees)) return '';
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round((((degrees % 360) + 360) % 360) / 45) % 8;
  return directions[index];
}


function uvLabel(uvIndex) {
  const rounded = Math.max(0, Math.round(uvIndex ?? 0));
  if (rounded <= 2) return `${rounded} low`;
  if (rounded <= 5) return `${rounded} moderate`;
  if (rounded <= 7) return `${rounded} high`;
  if (rounded <= 10) return `${rounded} very high`;
  return `${rounded} extreme`;
}


function formatLocationDate(isoDateTime) {
  const datePart = (isoDateTime || '').slice(0, 10);
  const [year, month, day] = datePart.split('-').map(Number);
  if (!year || !month || !day) return '';
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(date);
}


function formatShortDate(isoDate) {
  const [year, month, day] = (isoDate || '').slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return '';
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
}


function formatSunTime(isoDateTime) {
  const timePart = (isoDateTime || '').split('T')[1];
  if (!timePart) return '--:--';
  const [hourStr, minuteStr] = timePart.split(':');
  const hour24 = Number(hourStr);
  const minute = Number(minuteStr);
  if (Number.isNaN(hour24) || Number.isNaN(minute)) return '--:--';

  const period = hour24 >= 12 ? 'p.m.' : 'a.m.';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${String(hour12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`;
}


function formatPressure(hpa) {
  const rounded = Math.round(hpa);
  return `${String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} hPa`;
}


function formatVisibility(meters) {
  if (typeof meters !== 'number' || Number.isNaN(meters)) return '-- km';
  const km = meters >= 1000 ? Math.round(meters / 1000) : Number((meters / 1000).toFixed(1));
  return `${km} km`;
}


function formatClockTime(timestampMs) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(timestampMs));
}



function saveCache(payload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch (error) {

  }
}

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !parsed.weather ||
      !parsed.weather.current ||
      typeof parsed.timestamp !== 'number'
    ) {
      return null;
    }
    return parsed;
  } catch (error) {
    return null;
  }
}

function isCacheFresh(cache, lat, lon) {
  if (!cache) return false;
  const ageMs = Date.now() - cache.timestamp;
  const sameLocation =
    Math.abs(cache.lat - lat) < 0.05 && Math.abs(cache.lon - lon) < 0.05;
  return ageMs < CACHE_TTL_MS && sameLocation;
}


function getLocation() {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve({ ...DEFAULT_LOCATION, isFallback: true });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          name: null,
          isFallback: false,
        });
      },
      () => {
        resolve({ ...DEFAULT_LOCATION, isFallback: true });
      },
      {
        enableHighAccuracy: false,
        timeout: GEOLOCATION_TIMEOUT_MS,
        maximumAge: 5 * 60 * 1000,
      }
    );
  });
}


async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'weather_code',
      'is_day',
    ].join(','),
    hourly: ['temperature_2m', 'weather_code', 'is_day', 'visibility', 'uv_index'].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'uv_index_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: '8',
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Weather API responded with status ${response.status}`);
  }
  return response.json();
}


async function reverseGeocode(lat, lon, isFallback) {
  const fallbackLabel = isFallback ? DEFAULT_LOCATION.name : 'Your location';
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(
      lat
    )}&longitude=${encodeURIComponent(lon)}&localityLanguage=en`;
    const response = await fetch(url);
    if (!response.ok) {
      return fallbackLabel;
    }
    const data = await response.json();
    const city = data.city || data.locality || data.principalSubdivision || '';
    const country = (data.countryName || '').replace(/\s*\(the\)$/i, '');

    if (city && country) return `${city}, ${country}`;
    if (city) return city;
    if (country) return country;
    return fallbackLabel;
  } catch (error) {
    return fallbackLabel;
  }
}



function findCurrentHourIndex(weather) {
  const hourlyTimes = weather?.hourly?.time || [];
  const currentIso = weather?.current?.time || '';
  if (!hourlyTimes.length || !currentIso) return 0;

  const currentHourPrefix = currentIso.slice(0, 13);
  const exactIndex = hourlyTimes.findIndex((t) => t.startsWith(currentHourPrefix));
  return exactIndex >= 0 ? exactIndex : 0;
}

function renderLoadingSkeleton() {
  elements.errorState.hidden = true;
  elements.weatherContent.hidden = false;
  elements.weatherContent.classList.remove('is-loaded');

  elements.locationName.innerHTML =
    '<span class="skeleton skeleton-title" aria-hidden="true"></span>';
  elements.currentDate.innerHTML =
    '<span class="skeleton skeleton-subtitle" aria-hidden="true"></span>';
  elements.dayNightIcon.innerHTML = '';
  elements.currentTemp.innerHTML =
    '<span class="skeleton skeleton-hero" aria-hidden="true"></span>';

  elements.hourlyStrip.innerHTML = Array.from({ length: 7 })
    .map(
      () => `
      <div class="hour-item" role="listitem" aria-hidden="true">
        <span class="skeleton skeleton-hour-time"></span>
        <span class="skeleton skeleton-hour-icon"></span>
        <span class="skeleton skeleton-hour-temp"></span>
      </div>
    `
    )
    .join('');

  elements.detailsGrid.innerHTML = Array.from({ length: 8 })
    .map(
      () => `
      <div class="detail-cell" aria-hidden="true">
        <span class="skeleton skeleton-detail-label"></span>
        <span class="skeleton skeleton-detail-value"></span>
      </div>
    `
    )
    .join('');

  elements.dailyRow.innerHTML = Array.from({ length: 6 })
    .map(
      () => `
      <div class="day-item" role="listitem" aria-hidden="true">
        <span class="skeleton skeleton-day-date"></span>
        <span class="skeleton skeleton-day-temps"></span>
      </div>
    `
    )
    .join('');
}

function renderErrorState() {
  elements.weatherContent.hidden = true;
  elements.locationNotice.hidden = true;
  elements.cacheNotice.hidden = true;
  elements.locationName.textContent = 'Weather';
  elements.currentDate.textContent = '';
  elements.dayNightIcon.innerHTML = '';
  elements.errorState.hidden = false;
}

function renderCurrent(weather, locationLabel) {
  const { current } = weather;
  const isDay = current.is_day === 1;

  elements.locationName.textContent = locationLabel;
  elements.currentDate.textContent = formatLocationDate(current.time);

  const iconKey = isDay ? 'clear-day' : 'clear-night';
  elements.dayNightIcon.innerHTML = WEATHER_ICONS[iconKey];
  elements.dayNightIcon.setAttribute(
    'aria-label',
    isDay ? 'Daytime at location' : 'Nighttime at location'
  );
  elements.dayNightIcon.setAttribute('role', 'img');

  elements.currentTemp.textContent = `${Math.round(current.temperature_2m)}°`;
}

function renderHourly(weather, currentHourIndex) {
  const { current, hourly } = weather;
  const items = [];


  const nowIconKey = weatherCodeToIcon(current.weather_code, current.is_day);
  items.push({
    time: 'Now',
    iconKey: nowIconKey,
    temp: `${Math.round(current.temperature_2m)}°`,
  });


  const start = currentHourIndex + 1;
  const end = Math.min(start + 24, hourly.time.length);
  for (let i = start; i < end; i++) {
    const timeStr = (hourly.time[i] || '').slice(11, 16);
    const iconKey = weatherCodeToIcon(hourly.weather_code[i], hourly.is_day[i]);
    items.push({
      time: timeStr,
      iconKey,
      temp: `${Math.round(hourly.temperature_2m[i])}°`,
    });
  }

  elements.hourlyStrip.innerHTML = items
    .map(
      (item) => `
      <div class="hour-item" role="listitem">
        <span class="hour-time">${item.time}</span>
        <span class="hour-icon" role="img" aria-label="${WEATHER_LABELS[item.iconKey]}">
          ${WEATHER_ICONS[item.iconKey]}
        </span>
        <span class="hour-temp">${item.temp}</span>
      </div>
    `
    )
    .join('');
}

function renderDetails(weather, currentHourIndex) {
  const { current, hourly, daily } = weather;

  const sunrise = formatSunTime(daily.sunrise?.[0]);
  const sunset = formatSunTime(daily.sunset?.[0]);
  const feelsLike = `${Math.round(current.apparent_temperature)}°`;
  const compass = degreesToCompass(current.wind_direction_10m);
  const wind = `${Math.round(current.wind_speed_10m)} km/h ${compass}`.trim();
  const humidity = `${Math.round(current.relative_humidity_2m)}%`;
  const pressure = formatPressure(current.surface_pressure);
  const visibility = formatVisibility(hourly.visibility?.[currentHourIndex]);
  const uvValue = hourly.uv_index?.[currentHourIndex] ?? daily.uv_index_max?.[0] ?? 0;
  const ultraviolet = uvLabel(uvValue);

  const cells = [
    { label: 'Sunrise', value: sunrise },
    { label: 'Sunset', value: sunset },
    { label: 'Feels like', value: feelsLike },
    { label: 'Wind', value: wind },
    { label: 'Humidity', value: humidity },
    { label: 'Atmospheric pressure', value: pressure },
    { label: 'Visibility', value: visibility },
    { label: 'Ultraviolet', value: ultraviolet },
  ];

  elements.detailsGrid.innerHTML = cells
    .map(
      (cell) => `
      <div class="detail-cell">
        <dt class="detail-label">${cell.label}</dt>
        <dd class="detail-value">${cell.value}</dd>
      </div>
    `
    )
    .join('');
}

function renderDaily(weather) {
  const { daily } = weather;
  const days = [];

  // Next 6 days starting tomorrow (indices 1..6)
  const total = Math.min(7, daily.time.length);
  for (let i = 1; i < total; i++) {
    const dateLabel = formatShortDate(daily.time[i]);
    const minTemp = Math.round(daily.temperature_2m_min[i]);
    const maxTemp = Math.round(daily.temperature_2m_max[i]);
    days.push({
      dateLabel,
      range: `${minTemp}°/${maxTemp}°`,
    });
  }

  elements.dailyRow.innerHTML = days
    .map(
      (day) => `
      <div class="day-item" role="listitem">
        <span class="day-date">${day.dateLabel}</span>
        <span class="day-temps">${day.range}</span>
      </div>
    `
    )
    .join('');
}

function renderWeather(weather, locationLabel, { isFallback = false, cacheTimestamp = null } = {}) {
  const currentHourIndex = findCurrentHourIndex(weather);

  elements.errorState.hidden = true;
  elements.weatherContent.hidden = false;

  renderCurrent(weather, locationLabel);
  renderHourly(weather, currentHourIndex);
  renderDetails(weather, currentHourIndex);
  renderDaily(weather);

  elements.locationNotice.hidden = !isFallback;

  if (cacheTimestamp) {
    elements.cacheNotice.textContent = `Last updated at ${formatClockTime(cacheTimestamp)}`;
    elements.cacheNotice.hidden = false;
  } else {
    elements.cacheNotice.hidden = true;
  }

  // Trigger soft fade-in
  elements.weatherContent.classList.remove('is-loaded');
  void elements.weatherContent.offsetWidth;
  elements.weatherContent.classList.add('is-loaded');
}

/* ==========================================================================
   Application Lifecycle & Orchestration
   ========================================================================== */

async function loadWeatherFlow({ forceRefresh = false } = {}) {
  const cached = loadCache();

  if (cached) {
    renderWeather(cached.weather, cached.locationName, {
      isFallback: Boolean(cached.isFallback),
      cacheTimestamp: null,
    });
  } else {
    renderLoadingSkeleton();
  }

  const location = await getLocation();

  if (!forceRefresh && isCacheFresh(cached, location.lat, location.lon)) {
    elements.locationNotice.hidden = !location.isFallback;
    return;
  }

  try {
    const [weather, resolvedName] = await Promise.all([
      fetchWeather(location.lat, location.lon),
      reverseGeocode(location.lat, location.lon, location.isFallback),
    ]);

    const payload = {
      weather,
      locationName: resolvedName,
      lat: location.lat,
      lon: location.lon,
      isFallback: location.isFallback,
      timestamp: Date.now(),
    };

    saveCache(payload);
    renderWeather(weather, resolvedName, {
      isFallback: location.isFallback,
      cacheTimestamp: null,
    });
  } catch (error) {
    if (cached) {
      renderWeather(cached.weather, cached.locationName, {
        isFallback: Boolean(cached.isFallback),
        cacheTimestamp: cached.timestamp,
      });
    } else {
      renderErrorState();
    }
  }
}

async function handleUseMyLocation() {
  const cached = loadCache();
  elements.useLocationBtn.disabled = true;
  elements.useLocationBtn.textContent = 'Locating…';

  try {
    const location = await getLocation();

    if (location.isFallback) {
      elements.locationNotice.hidden = false;
      return;
    }

    const [weather, resolvedName] = await Promise.all([
      fetchWeather(location.lat, location.lon),
      reverseGeocode(location.lat, location.lon, false),
    ]);

    const payload = {
      weather,
      locationName: resolvedName,
      lat: location.lat,
      lon: location.lon,
      isFallback: false,
      timestamp: Date.now(),
    };

    saveCache(payload);
    renderWeather(weather, resolvedName, {
      isFallback: false,
      cacheTimestamp: null,
    });
  } catch (error) {
    if (cached) {
      renderWeather(cached.weather, cached.locationName, {
        isFallback: Boolean(cached.isFallback),
        cacheTimestamp: cached.timestamp,
      });
    } else {
      renderErrorState();
    }
  } finally {
    elements.useLocationBtn.disabled = false;
    elements.useLocationBtn.textContent = 'Use my location';
  }
}


elements.useLocationBtn.addEventListener('click', handleUseMyLocation);
elements.retryBtn.addEventListener('click', () => {
  loadWeatherFlow({ forceRefresh: true });
});

loadWeatherFlow();