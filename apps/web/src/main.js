import './style.css';

// --- URLs da API ---
// URL do NOSSO backend (para rodar local com Docker)
const LOCAL_API_URL = 'http://localhost:3000';
// URL da API PÚBLICA de Geocodificação (para rodar online no GitHub Pages)
const PUBLIC_GEO_API = 'https://geocoding-api.open-meteo.com/v1';
// URL da API PÚBLICA de Clima (usada em ambos os casos)
const PUBLIC_WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

// O Vite define 'import.meta.env.PROD' como 'true' quando rodamos 'npm run build'
const IS_PRODUCTION = import.meta.env.PROD;

// Define qual API de geocodificação usar
const GEO_API_URL = IS_PRODUCTION ? PUBLIC_GEO_API : LOCAL_API_URL;

// --- Elementos ---
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const weatherResultDiv = document.getElementById('weather-result');

searchButton.addEventListener('click', getWeather);

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    weatherResultDiv.innerHTML = `<p class="error">Por favor, digite o nome de uma cidade.</p>`;
    return;
  }
  weatherResultDiv.innerHTML = `<p>Buscando...</p>`;

  try {
    // --- PASSO 1: Buscar coordenadas ---
    let latitude, longitude, name, admin1;
    
    // Define a URL de busca correta (local vs. produção)
    const searchPath = IS_PRODUCTION ? '/search' : '/api/search';
    const geoURL = `${GEO_API_URL}${searchPath}?name=${city}&count=1&language=pt&format=json`;

    console.log(`Modo ${IS_PRODUCTION ? 'PROD' : 'DEV'}. Buscando geo em: ${geoURL}`);

    const geoResponse = await fetch(geoURL);
    if (!geoResponse.ok) throw new Error('Cidade não encontrada.');
    
    const geoData = await geoResponse.json();

    // Extrai os dados da localização.
    // A API pública (PROD) aninha os dados em 'results', a nossa (DEV) não.
    const location = IS_PRODUCTION ? geoData.results[0] : geoData;

    if (!location) {
        throw new Error('Dados de localização não encontrados.');
    }

    latitude = location.latitude;
    longitude = location.longitude;
    name = location.name;
    admin1 = location.admin1;

    // --- PASSO 2: Buscar clima (Sempre na API pública) ---
    const weatherURL = `${PUBLIC_WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    console.log("Buscando clima em:", weatherURL);

    const weatherResponse = await fetch(weatherURL);
    if (!weatherResponse.ok) {
      throw new Error('Não foi possível obter o clima.');
    }
    const weatherData = await weatherResponse.json();

    // Passo 3: Exibir os resultados
    displayWeather(weatherData.current_weather, name, admin1);

  } catch (error) {
    weatherResultDiv.innerHTML = `<p class="error">${error.message}</p>`;
    console.error("Erro ao buscar clima:", error);
  }
}

// (O resto do arquivo 'displayWeather' e 'getWeatherCondition' continua igual)
function displayWeather(weather, city, region) {
  const html = `
    <h2>${city}, ${region || ''}</h2>
    <div class="weather-card">
      <p class="temperature">${weather.temperature}°C</p>
      <p class="condition">${getWeatherCondition(weather.weathercode)}</p>
      <p>Vento: ${weather.windspeed} km/h</p>
    </div>
  `;
  weatherResultDiv.innerHTML = html;
}

function getWeatherCondition(code) {
  const conditions = {
    0: 'Céu limpo', 1: 'Quase limpo', 2: 'Parcialmente nublado', 3: 'Nublado',
    45: 'Nevoeiro', 48: 'Nevoeiro depositando gelo',
    51: 'Garoa leve', 53: 'Garoa moderada', 55: 'Garoa densa',
    61: 'Chuva leve', 63: 'Chuva moderada', 65: 'Chuva forte',
    80: 'Pancadas de chuva leves', 81: 'Pancadas de chuva moderadas', 82: 'Pancadas de chuva violentas',
    95: 'Trovoada',
  };
  return conditions[code] || 'Condição desconhecida';
}