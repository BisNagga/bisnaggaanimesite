# Escalas Médicas — Cloudflare Pages

Projeto React + Vite + PWA pronto para deploy na Cloudflare Pages.

## Integração já configurada
Apps Script Web App:

`https://script.google.com/macros/s/AKfycbwYdHwJbTvkL6Y0Hvb5Ya1v8zltDer2Whk62yNs9-IGt4PZlYn9jJY6yavN3budQFqR/exec`

## Rodando localmente
```bash
npm install
npm run dev
```

## Build
```bash
npm install
npm run build
```

## Deploy na Cloudflare Pages
- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: 20 ou compatível

## Estrutura esperada no backend
Abas do Google Sheets:
- IMPORTACAO_FORMULARIO_MEDICOS
- MEDICOS
- HOSPITAIS
- PLANTOES
- LANCAMENTOS_PLANTAO
- ABATIMENTOS_PLANTAO
- PAGAMENTOS
- CONFIG
