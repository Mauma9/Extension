import fs from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';

const distDir = 'dist';

// Função de pausa
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  try {
    console.log(`Limpando o diretório '${distDir}' antigo...`);
    fs.rmSync(distDir, { recursive: true, force: true });
    fs.mkdirSync(distDir);

    console.log('Pasta \'dist\' recriada. Aguardando 1 segundo para o sistema assentar...');
    await delay(1000); // Pausa de 1 segundo

    console.log('Iniciando cópia dos arquivos...');

    // Vamos copiar um por um para ver onde falha
    console.log('Copiando manifest.json...');
    fs.copyFileSync('manifest.json', path.join(distDir, 'manifest.json'));
    console.log('-> manifest.json copiado.');

    console.log('Copiando pasta icons/ ...');
   // fs.cpSync('icons', path.join(distDir, 'icons'), { recursive: true });
    console.log('-> pasta icons/ copiada.');

    console.log('Copiando pasta src/ ...');
    fs.cpSync('src', path.join(distDir, 'src'), { recursive: true });
    console.log('-> pasta src/ copiada.');

    console.log('Arquivos copiados com sucesso.');

  } catch (err) {
    // Vamos usar console.log normal para garantir que apareça
    console.log('--- ERRO DETECTADO DURANTE A CÓPIA ---');
    console.log('Mensagem:', err.message);
    console.log('Código:', err.code);
    console.log('Caminho:', err.path);
    console.log('----------------------------------------');
    process.exit(1); // Para o script
  }

  // Se a cópia foi bem-sucedida, vamos para o zip
  try {
    console.log('Gerando o arquivo extension.zip...');
    const output = fs.createWriteStream(path.join(distDir, 'extension.zip'));
    const archive = archiver('zip', { zlib: { level: 9 } });

    await new Promise((resolve, reject) => {
      output.on('close', resolve);
      archive.on('error', reject);
      archive.pipe(output);
      archive.glob('**/*', {
          cwd: distDir, 
          ignore: ['extension.zip'] 
      });
      archive.finalize();
    });

    console.log(`Build concluído: '${distDir}/' pronto e 'extension.zip' gerado.`);

  } catch (zipErr) {
    console.log('--- ERRO DETECTADO DURANTE O ZIP ---');
    console.log('Mensagem:', zipErr.message);
    console.log('------------------------------------');
    process.exit(1);
  }
}

// Executa a função principal
main();