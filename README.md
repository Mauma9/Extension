# Extensão Teste - Bootcamp II

Esta é uma extensão simples para o Google Chrome, desenvolvida como parte do Desafio de Entrega Inicial do Bootcamp II. O objetivo é demonstrar o entendimento da arquitetura do Manifest V3, incluindo a criação de um popup, um service worker em segundo plano e a interação entre eles.

## Funcionalidades

* **Popup Interativo:** Uma pequena janela que permite ao usuário interagir com a extensão.
* **Mudança de Texto:** Clique no botão "TESTE" para alterar o título e no "RESET" para voltar ao original.
* **Comunicação com Background:** O popup envia uma mensagem ao service worker ao ser clicado.
* **Injeção de Script:** Um content script é injetado em páginas do `developer.chrome.com` para destacar todos os links.

## 📂 Estrutura do Projeto

O projeto segue a estrutura de pastas recomendada para extensões do Chrome:

```
/
├─ src/
│  ├─ popup/ (HTML, JS do popup)
│  ├─ content/ (JS para injetar nas páginas)
│  └─ background/ (Service Worker)
├─ icons/ (Ícones da extensão)
├─ docs/ (Arquivos para o GitHub Pages)
├─ manifest.json (Arquivo principal de configuração)
├─ README.md
└─ LICENSE
```

## 🛠️ Instalação Local

Para instalar e testar a extensão localmente, siga os passos:

1.  Clone este repositório: `git clone https://github.com/seu-usuario/seu-repositorio.git`
2.  Abra o Google Chrome e acesse `chrome://extensions`.
3.  Ative o **Modo de Desenvolvedor** (Developer mode) no canto superior direito.
4.  Clique em **Carregar sem compactação** (Load unpacked).
5.  Selecione a pasta do projeto que você clonou.
6.  A extensão aparecerá na sua barra de ferramentas!

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
Feito por Mauma.