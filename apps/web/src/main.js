import './style.css';

// URL da NOSSA API (o backend que criamos na Ação 1)
// O Vite usará VITE_API_URL em produção (definido no Docker Compose)
// Em desenvolvimento (npm run dev), usará o localhost:3000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
    // Passo 1: Buscar coordenadas (Geocodificação) em NOSSA API
    const geoResponse = await fetch(`${API_URL}/api/search?city=${city}`);
    if (!geoResponse.ok) {
      throw new Error('Cidade não encontrada.');
    }
    const location = await geoResponse.json();
    
    const { latitude, longitude, name, admin1 } = location;

    // Passo 2: Buscar clima usando as coordenadas em NOSSA API
    const weatherResponse = await fetch(`${API_URL}/api/weather?lat=${latitude}&lon=${longitude}`);
    if (!weatherResponse.ok) {
      throw new Error('Não foi possível obter o clima.');
    }
    const weather = await weatherResponse.json();

    // Passo 3: Exibir os resultados
    displayWeather(weather, name, admin1);

  } catch (error) {
    weatherResultDiv.innerHTML = `<p class="error">${error.message}</p>`;
  }
}

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

// Função auxiliar para traduzir códigos do Open-Meteo
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