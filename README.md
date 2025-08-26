# sozjaz.github.io
## Быстрый старт
1. `cd sozjaz-backend && npm install && npm run start:dev`
2. `cd sozjaz-frontend && npm install && npm run dev`

## Продакшн
- Backend: `npm run build && npm run start:prod` (порт configurable via `.env`)
- Frontend: `npm run build && npm run start`
...

## Конфигурация
- `.env.sample`: `PORT=4000`, `DATABASE_URL=...`, `CORS_ALLOWED=...`
...

## CORS и API
Frontend отправляет запросы на `http://localhost:4000/api`

## Разработка
IDE рекомендации, линтер, форматтер, commit messages, возможно Husky/Git hooks.

## Roadmap / Future
- Dockerize
- CI/CD
- Мониторинг, тестирование и т.д.
