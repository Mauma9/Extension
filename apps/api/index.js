import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = 3000;

// URLs das APIs gratuitas do Open-Meteo
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

app.use(cors()); // Permite que o PWA (web) acesse esta API

/**
 * Rota 1: Geocodificação
 * Converte um nome de cidade em coordenadas (latitude/longitude)
 * Ex: /api/search?city=SaoPaulo
 */
app.get('/api/search', async (req, res) => {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ error: 'Cidade não fornecida' });
  }

  try {
    const response = await fetch(`${GEOCODING_API}?name=${city}&count=1&language=pt&format=json`);
    if (!response.ok) throw new Error('Falha ao buscar geocodificação');
    
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: 'Cidade não encontrada' });
    }
    
    // Retorna o primeiro resultado encontrado
    res.json(data.results[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Rota 2: Previsão do Tempo
 * Busca o clima atual com base na latitude e longitude.
 * Ex: /api/weather?lat=-23.55&lon=-46.64
 */
app.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Coordenadas (lat, lon) não fornecidas' });
  }

  // Pede apenas o clima atual (current_weather=true)
  const url = `${WEATHER_API}?latitude=${lat}&longitude=${lon}&current_weather=true`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Falha ao buscar dados do clima');
    
    const data = await response.json();
    res.json(data.current_weather); // Retorna apenas os dados do clima atual

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API (proxy Open-Meteo) rodando em http://localhost:${port}`);
});