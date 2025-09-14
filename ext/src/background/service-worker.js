// Evento acionado quando a extensão é instalada
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ install_time: Date.now() });
  console.log('Extensão instalada com sucesso!');
});


// Ouve mensagens enviadas pelo popup ou outros scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PING') {
    // Responde à mensagem com um objeto
    sendResponse({ ok: true, time: new Date().toISOString() });
  }
  // É importante retornar true se você for responder de forma assíncrona
  return true;
});
