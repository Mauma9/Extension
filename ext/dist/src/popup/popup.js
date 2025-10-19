(() => {
    const titulo = document.getElementById('titulo');
    const botao = document.getElementById('teste');
    const botao2 = document.getElementById('reset');

    const mensagemOriginal = titulo?.textContent || 'Teste';
    let alternado = false;

    function alternarMensagem() {
        if (!titulo) return;
        alternado = !alternado;
        titulo.textContent = alternado ? 'Testado' : mensagemOriginal;

        
        // Envia uma mensagem para o service worker e loga a resposta no console
        console.log('Enviando mensagem para o background...');
        chrome.runtime.sendMessage({ type: 'PING' }, (response) => {
            if (response && response.ok) {
                console.log('Resposta do background:', response.time);
            } else {
                console.error('Falha ao comunicar com o background.');
            }
        });
        
    }

    function resetar(){
        if(!titulo) return;
        alternado = false;
        titulo.textContent = mensagemOriginal;
    }

    botao?.addEventListener('click', alternarMensagem);
    botao2?.addEventListener('click', resetar);
})();