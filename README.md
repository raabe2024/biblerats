# BibleRats v0.2.1 — correção PWA / ícone

Esta versão corrige o problema do ícone quebrado e torna o aviso de instalação mais robusto no telemóvel.

## Importante ao enviar para GitHub
Todos estes arquivos precisam ficar na RAIZ do repositório, inclusive:
- icon-192.png
- icon-512.png
- icon-maskable-192.png
- icon-maskable-512.png
- apple-touch-icon.png
- manifest.webmanifest
- service-worker.js
- index.html
- app.js
- books.js
- styles.css

Não é necessário usar a pasta `icons`.

## Depois de publicar
1. Aguarde o GitHub Pages concluir o deploy.
2. Abra no navegador: `.../biblerats/icon-192.png`
   - deve aparecer o rato.
3. Abra: `.../biblerats/manifest.webmanifest`
   - deve aparecer o JSON do manifest.
4. Feche abas antigas do BibleRats e abra novamente.
5. Se já existia um atalho antigo com ícone genérico, remova esse atalho e instale novamente.

Os ícones `maskable` continuam incluídos para permitir que launchers Android adaptem o ícone para círculo, squircle, quadrado arredondado etc.
