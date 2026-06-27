# Gym Diary — Frontend

Клиентская часть дневника тренировок. Стек: React 19, TypeScript, Vite.

## Разработка

```bash
npm install
npm run dev
```

Приложение доступно на [http://localhost:5173](http://localhost:5173).

## Сборка

```bash
npm run build      # production-сборка в dist/
npm run preview    # просмотр dist/ локально
npm run lint       # oxlint
```

## Деплой на GitHub Pages

Сайт: **https://vanya2535.github.io/gym-diary-frontend/**

Деплой автоматический при push в ветку `main` (workflow `.github/workflows/deploy.yml`).

### Первичная настройка

1. Запушь репозиторий на GitHub.
2. Открой **Settings → Pages → Build and deployment**.
3. В поле **Source** выбери **GitHub Actions** (не «Deploy from a branch»).
4. После первого успешного workflow сайт будет доступен по ссылке выше.

> **Важно:** если Source = «Deploy from a branch / main», GitHub отдаёт исходники репозитория (`index.html` с `/src/main.tsx`), а не сборку из `dist/`. В консоли будет `404` на `main.tsx`. Переключи Source на **GitHub Actions** и перезапусти workflow **Deploy to GitHub Pages** (Actions → Re-run all jobs).

### Локальная проверка Pages-сборки

GitHub Pages отдаёт приложение из подпути `/gym-diary-frontend/`:

```bash
npm run preview:pages
```

## Документация для агентов

См. [AGENTS.md](./AGENTS.md) — архитектура, конвенции и чеклисты для ИИ-агентов.
