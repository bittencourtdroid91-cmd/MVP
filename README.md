# Vitalis - Protocolo Maelly

App single-user (local-first) para acompanhamento diario de protocolo Hashimoto + Wegovy.

## O que ja esta implementado

- Persistencia local automatica (usuario unico)
- Dashboard semanal com score, streak e ranking mensal
- Checklist diario, hidratacao e registro de sintomas/humor
- Planejador de refeicoes com fotos e comparativo semanal
- Semaforo do joelho com ajuste automatico de carga de treino
- Modo crise com orientacoes rapidas
- Exportar/importar backup JSON
- Relatorio semanal em PDF
- PWA com instalacao e suporte offline
- Assistente IA via API segura (server-side)

## Desenvolvimento local

1. Instale dependencias:
   `npm ci`
2. Configure variaveis em `.env.local`:
   - `VITE_API_BASE_URL` (ex: `http://localhost:3000` para dev integrado ou URL da Vercel)
   - `GEMINI_API_KEY` (somente para API server-side)
3. Rode:
   `npm run dev`

## Deploy

### Vercel (frontend + API)

- Defina no projeto Vercel:
  - `GEMINI_API_KEY`
  - `VITE_API_BASE_URL` com a propria URL do deploy (ex: `https://seu-app.vercel.app`)
- A pasta `api/` ja contem endpoint `/api/chat`.

### GitHub Pages (frontend estatico)

- Workflow pronto em `.github/workflows/deploy-gh-pages.yml`
- O build usa `VITE_BASE_PATH=/<nome-do-repo>/`
- Para IA no Pages, configure `VITE_API_BASE_URL` apontando para sua API na Vercel.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`
- `npm run clean`
