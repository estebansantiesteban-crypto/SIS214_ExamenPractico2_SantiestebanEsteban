const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=-16.5&longitude=-68.15&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=America%2FLa_Paz';

const weatherDescriptions = new Map([
  [0, 'Despejado'],
  [1, 'Mayormente despejado'],
  [2, 'Parcialmente nublado'],
  [3, 'Nublado'],
  [45, 'Niebla'],
  [48, 'Niebla con escarcha'],
  [51, 'Llovizna ligera'],
  [53, 'Llovizna moderada'],
  [55, 'Llovizna intensa'],
  [56, 'Llovizna helada ligera'],
  [57, 'Llovizna helada intensa'],
  [61, 'Lluvia ligera'],
  [63, 'Lluvia moderada'],
  [65, 'Lluvia intensa'],
  [66, 'Lluvia helada ligera'],
  [67, 'Lluvia helada intensa'],
  [71, 'Nevada ligera'],
  [73, 'Nevada moderada'],
  [75, 'Nevada intensa'],
  [77, 'Granizo pequeño'],
  [80, 'Chubascos ligeros'],
  [81, 'Chubascos moderados'],
  [82, 'Chubascos intensos'],
  [85, 'Chubascos de nieve ligeros'],
  [86, 'Chubascos de nieve intensos'],
  [95, 'Tormenta'],
  [96, 'Tormenta con granizo ligero'],
  [99, 'Tormenta con granizo intenso']
]);

const formatValue = (value, unit, label) => {
  if (!Number.isFinite(value) || typeof unit !== 'string' || unit.length === 0) {
    throw new Error(`La respuesta del servicio no contiene un valor válido para ${label}.`);
  }

  return `${new Intl.NumberFormat('es-BO', { maximumFractionDigits: 1 }).format(value)} ${unit}`;
};

const getHttpErrorMessage = (status) => {
  if (status === 400) return 'La solicitud del clima no es válida (HTTP 400).';
  if (status === 404) return 'No se encontró el servicio del clima (HTTP 404).';
  if (status === 500) return 'El servicio del clima está experimentando un error (HTTP 500).';
  return `El servicio del clima respondió con un error (HTTP ${status}).`;
};

const formatObservationTime = (value) => {
  if (
    typeof window.dayjs !== 'function'
    || typeof window.dayjs_plugin_utc !== 'function'
    || typeof window.dayjs_plugin_timezone !== 'function'
  ) {
    throw new Error('No se pudo cargar Day.js para formatear la hora de la lectura.');
  }

  window.dayjs.extend(window.dayjs_plugin_utc);
  window.dayjs.extend(window.dayjs_plugin_timezone);
  window.dayjs.locale('es');

  const observedAt = window.dayjs.tz(value, 'America/La_Paz');
  if (!observedAt.isValid()) {
    throw new Error('La respuesta del clima contiene una fecha de lectura no válida.');
  }

  return observedAt.locale('es').format('D [de] MMMM [de] YYYY, HH:mm');
};

export const initWeather = async () => {
  const card = document.querySelector('.weather-card');
  const status = document.getElementById('weather-status');
  const details = document.getElementById('weather-details');
  const updated = document.getElementById('weather-updated');
  if (!card || !status || !details || !updated) return;

  card.dataset.state = 'loading';
  card.setAttribute('aria-busy', 'true');
  status.textContent = 'Consultando el clima…';
  details.hidden = true;

  try {
    const response = await fetch(WEATHER_URL);
    if (!response.ok) {
      throw new Error(getHttpErrorMessage(response.status));
    }
    if (response.status !== 200) {
      throw new Error(`El servicio devolvió un estado HTTP inesperado (${response.status}).`);
    }

    const { current, current_units: units } = await response.json();
    if (!current || !units || typeof current.time !== 'string') {
      throw new Error('La respuesta del servicio no incluye las condiciones actuales.');
    }

    const values = {
      temperature: formatValue(current.temperature_2m, units.temperature_2m, 'temperatura'),
      feelsLike: formatValue(current.apparent_temperature, units.apparent_temperature, 'sensación térmica'),
      humidity: formatValue(current.relative_humidity_2m, units.relative_humidity_2m, 'humedad'),
      wind: formatValue(current.wind_speed_10m, units.wind_speed_10m, 'viento'),
      condition: weatherDescriptions.get(current.weather_code) ?? 'Condición no disponible',
      observedAt: formatObservationTime(current.time)
    };

    document.getElementById('weather-temperature').textContent = values.temperature;
    document.getElementById('weather-feels-like').textContent = values.feelsLike;
    document.getElementById('weather-humidity').textContent = values.humidity;
    document.getElementById('weather-wind').textContent = values.wind;
    document.getElementById('weather-condition').textContent = values.condition;
    updated.textContent = `Lectura del ${values.observedAt} (hora de La Paz).`;
    card.dataset.state = 'success';
    details.hidden = false;
    updated.hidden = false;
    status.textContent = 'Clima actualizado correctamente.';
  } catch (error) {
    card.dataset.state = 'error';
    status.textContent = error instanceof Error
      ? error.message
      : 'No fue posible consultar el clima por un error inesperado.';
    console.error('No se pudo actualizar el clima de La Paz.', error);
  } finally {
    card.setAttribute('aria-busy', 'false');
  }
};