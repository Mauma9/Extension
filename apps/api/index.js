import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = 3000;

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

app.use(cors());

/**
 * Rota ÚNICA: Geocodificação
 * Converte um nome de cidade em coordenadas (latitude/longitude)
 * Ex: /api/search?city=SaoPaulo
 */
app.get('/api/search', async (req, res) => {
  const { city } = req.query;
  console.log(`[API] Recebida requisição /api/search para cidade: ${city}`);

  if (!city) {
    return res.status(400).json({ error: 'Cidade não fornecida' });
  }

  // URL SIMPLES: Apenas geocodificação
  const url = `${GEOCODING_API}?name=${city}&count=1&language=pt&format=json`;
  console.log(`[API] Buscando na API externa: ${url}`);

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Falha ao buscar dados na API');
    
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: 'Cidade não encontrada' });
    }
    
    // Retorna apenas os dados de localização
    console.log('[API] Geocodificação encontrada:', data.results[0]);
    res.json(data.results[0]); 

  } catch (error) {
    console.error('[API] Erro na Rota /api/search:', error); 
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API (proxy Open-Meteo) rodando em http://localhost:${port}`);
});