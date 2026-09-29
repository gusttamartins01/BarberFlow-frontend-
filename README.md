# BarberFlow Frontend

Frontend React, TypeScript e Vite para o BarberFlow.

## Integração com a API

Copie `.env.example` para `.env`. Por padrão, o Vite encaminha as chamadas `/api` para `http://localhost:3333`, evitando CORS durante o desenvolvimento. Para usar outra instância local, ajuste `VITE_API_PROXY_TARGET`.

Inicie o backend com `PORT=3333`, `DATABASE_URL` configurada para o PostgreSQL e `LOG_LEVEL=info` no `.env` do backend. Depois, inicie este frontend com `npm run dev`. A `DATABASE_URL` deve permanecer apenas no backend.

As telas consomem `GET /services`, `GET /barbers`, `GET /business-hours` e `GET /appointments`. Ao solicitar uma reserva, o frontend cria o cliente em `POST /customers` e então o agendamento em `POST /appointments`.

Em produção, configure `VITE_API_BASE_URL` para uma URL acessível pelo navegador e disponibilize a API na mesma origem por um reverse proxy, ou habilite CORS no backend para a origem do frontend. O proxy definido no Vite vale apenas para desenvolvimento.

## Scripts

- `npm run dev`: servidor de desenvolvimento.
- `npm run build`: validação TypeScript e build de produção.
- `npm run lint`: ESLint.
- `npm run preview`: pré-visualização do build.