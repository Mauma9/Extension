console.log("Content script 'Teste' carregado!");

// Destaca todos os links na página para visualmente confirmar que o script foi injetado.
document.querySelectorAll('a').forEach(link => {
    link.style.border = '2px dashed #00F';
    link.style.borderRadius = '5px';
});