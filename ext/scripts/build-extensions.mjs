import fs from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';

const distDir = 'dist';

console.log(`Limpando o diretório '${distDir}' antigo...`);
// 1. Limpa e recria a pasta 'dist'
fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir);

console.log('Copiando arquivos da extensão...');
try {
  // 2. Copia os arquivos e pastas necessários para a pasta 'dist'
  
  // Copia o manifest.json da raiz
  fs.copyFileSync('manifest.json', path.join(distDir, 'manifest.json'));
  
  // Copia a pasta 'icons' inteira
  fs.cpSync('icons', path.join(distDir, 'icons'), { recursive: true });
  
  // Copia a pasta 'src' inteira (que contém popup, background, styles, etc.)
  fs.cpSync('src', path.join(distDir, 'src'), { recursive: true });

  console.log('Arquivos copiados com sucesso.');
} catch (err) {
  console.error('Erro ao copiar os arquivos:', err);
  process.exit(1); // Para o script se a cópia falhar
}


// 3. Gera o arquivo .zip (como o script anterior fazia)
console.log('Gerando o arquivo extension.zip...');
const output = fs.createWriteStream(path.join(distDir, 'extension.zip'));
const archive = archiver('zip', { zlib: { level: 9 } }); // Compressão máxima

// Usamos uma Promise para esperar o zip ser finalizado
await new Promise((resolve, reject) => {
  output.on('close', resolve); // Resolve a promise quando o zip for fechado
  archive.on('error', reject); // Rejeita em caso de erro

  // Adiciona tudo que está na pasta 'dist' ao zip
  archive.pipe(output);
  
  // Define o diretório de trabalho como 'dist'
  // Adiciona tudo, ignorando o próprio .zip que está sendo criado
  archive.glob('**/*', {
      cwd: distDir, 
      ignore: ['extension.zip'] 
  });
  
  archive.finalize(); // Finaliza a escrita do zip
});

console.log(`Build concluído: '${distDir}/' pronto e 'extension.zip' gerado.`);