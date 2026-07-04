# AGENTS.md — документация для ИИ-агентов

Этот файл — основной источник контекста для агентов, работающих с репозиторием **gym-diary-frontend**. Читай его в начале сессии и **обновляй при любых изменениях кода**, которые затрагивают описанные здесь разделы.

## Назначение проекта

Frontend-приложение «Gym Diary» — клиентская часть дневника тренировок. Архитектура — упрощённый FSD (Feature-Sliced Design).

## Стек

| Слой             | Технология                 | Версия (на момент инициализации) |
| ---------------- | -------------------------- | -------------------------------- |
| Сборка           | Vite                       | 8.1.3                            |
| UI               | React                      | ^19.2.7                          |
| HTTP-клиент      | axios                      | ^1.x                             |
| Стили            | Sass (SCSS modules)        | ^1.x                             |
| Маршрутизация    | react-router-dom           | ^7.x                             |
| Состояние (auth) | zustand                    | ^5.x                             |
| Язык             | TypeScript                 | 5.9.3                            |
| Линтер           | ESLint + typescript-eslint | ^10.x                            |
| Форматирование   | Prettier                   | ^3.x                             |

## Команды

```bash
npm run dev           # dev-сервер с HMR (порт по умолчанию — 5173)
npm run build         # проверка типов (tsc -b) + production-сборка в dist/
npm run build:pages   # сборка с base=/gym-diary-frontend/ (как на GitHub Pages)
npm run preview       # локальный просмотр production-сборки
npm run preview:pages # сборка для Pages + preview с корректным base path
npm run lint          # eslint + prettier --check
npm run lint:fix      # eslint --fix + prettier --write
npm run format        # prettier --write
npm run format:check  # prettier --check
```

Перед завершением задачи с изменениями кода убедись, что `npm run build` и `npm run lint` проходят без ошибок.

## Структура репозитория

```
gym-diary-frontend/
├── public/              # статика, отдаётся как есть (favicon, icons.svg)
├── src/
│   ├── app/                 # инициализация приложения, глобальные стили
│   │   ├── App.tsx          # корневой компонент
│   │   └── styles/
│   │       └── global.css
│   ├── pages/               # страницы (экраны)
│   │   ├── auth/
│   │   │   └── AuthPage.tsx
│   │   ├── workouts/
│   │   │   └── WorkoutsPage.tsx
│   │   ├── nutrition/
│   │   │   └── NutritionPage.tsx
│   │   └── measurements/
│   │       └── MeasurementsPage.tsx
│   ├── components/          # переиспользуемые UI-компоненты
│   │   ├── AppLayout/
│   │   │   ├── AppLayout.tsx
│   │   │   └── index.ts
│   │   ├── AppNav/
│   │   ├── AuthInit/
│   │   ├── GuestRoute/
│   │   ├── ProtectedRoute/
│   │   ├── RouteLoading/
│   │   └── chat/
│   │       ├── ChatDiaryPage/
│   │       └── ChatMessage/
│   ├── services/            # API-клиенты, работа с данными
│   ├── hooks/               # кастомные React-хуки
│   ├── utils/               # чистые утилиты
│   ├── types/               # общие TypeScript-типы
│   ├── constants/           # константы приложения
│   └── main.tsx             # точка входа React
├── index.html           # HTML-оболочка, монтирует #root
├── vite.config.ts       # конфигурация Vite
├── tsconfig.json        # корневой TS-конфиг (project references)
├── tsconfig.app.json    # TS для src/
├── tsconfig.node.json   # TS для vite.config.ts
├── .npmrc               # registry=https://registry.npmjs.org/ (перекрывает глобальный)
├── .prettierrc.json     # правила Prettier
├── eslint.config.js     # ESLint flat config
├── .github/
│   └── workflows/
│       ├── deploy.yml   # CI: сборка и деплой на GitHub Pages
│       └── lint.yml     # CI: lint + typecheck/build
├── AGENTS.md            # этот файл — документация для агентов
└── README.md            # краткая документация для людей
```

### Слои FSD (упрощённый)

| Слой       | Путь              | Назначение                                         |
| ---------- | ----------------- | -------------------------------------------------- |
| app        | `src/app/`        | Корень приложения, провайдеры, global styles       |
| pages      | `src/pages/`      | Страницы; подпапка на экран (`home/`, `workout/`…) |
| components | `src/components/` | Общие UI-компоненты                                |
| services   | `src/services/`   | Запросы к API, работа с backend                    |
| hooks      | `src/hooks/`      | Переиспользуемая логика React                      |
| utils      | `src/utils/`      | Чистые функции без React                           |
| types      | `src/types/`      | Общие TypeScript-типы и интерфейсы                 |
| constants  | `src/constants/`  | Константы (маршруты, ключи, enum-like значения)    |

**Правила импортов:** слой может импортировать только из слоёв ниже — `app → pages → components`; `services`, `hooks`, `utils`, `types`, `constants` — общие, их можно импортировать откуда угодно. Не импортировать pages из components, services из utils и т.п. `types` и `constants` не импортируют UI-слои.

## Конвенции кода

- **Компоненты** — функциональные, с хуками; один компонент на папку `ComponentName/` с `ComponentName.tsx`, colocated styles и `index.ts` (re-export).
- **Импорты** — ES modules; для локальных модулей указывай расширение `.tsx`/`.ts` где требует `verbatimModuleSyntax`.
- **Стили** — SCSS modules (`Component.module.scss` рядом с компонентом); глобальные стили в `src/app/styles/global.scss`. **Цвета** — только через CSS-переменные `var(--color-*)` из `src/app/styles/tokens.scss` (не хексы в компонентах). Палитры: `_theme-light.scss`, `_theme-dark.scss`.
- **Типизация** — строгий TypeScript; не используй `any` без явной необходимости и комментария.
- **Экспорт** — default export для страниц/корневых компонентов; named export для утилит, хуков, типов.
- **Линтер** — правила React Hooks включены; не отключай правила без согласования.

## UI и дизайн

Ориентир для интерфейса — **мобильный Telegram** (паттерны чата, а не копирование брендинга один в один).

| Область    | Принцип (как в TG)                                                                                         |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| Composer   | Overlay поверх списка (прозрачный фон, сообщения видны под панелью), поле с обводкой `var(--color-border)` |
| Навигация  | Сайдбар слева (кнопка меню в хедере); заголовок — текущий раздел; Sign out в сайдбаре                      |
| Поле ввода | `font-size: 1rem` (≥16px — без зума iOS Safari); Enter → отправка только на desktop; на touch — перенос строки и кнопка отправки |
| Отступы    | `viewport-fit=cover`; `env(safe-area-inset-*)` у хедера и composer                                         |

При новых экранах и компонентах чата сначала смотри, как это решено в Telegram, и адаптируй под стек проекта (SCSS modules, токены `--color-*`).

### Тема (светлая / тёмная)

| Файл                               | Назначение                                 |
| ---------------------------------- | ------------------------------------------ |
| `src/app/styles/tokens.scss`       | Подключение тем на `:root`                 |
| `src/app/styles/_theme-light.scss` | Светлая палитра                            |
| `src/app/styles/_theme-dark.scss`  | Тёмная палитра                             |
| `src/constants/theme.ts`           | Ключ `localStorage`, тип `ThemePreference` |
| `src/utils/theme.ts`               | `initTheme()`, `applyThemePreference()`    |

По умолчанию — светлая тема. Тёмная включается через `prefers-color-scheme: dark` или `document.documentElement.dataset.theme = 'dark'`. Явный выбор: `applyThemePreference('light' | 'dark' | 'system')` (UI переключателя пока нет).

## Точки входа и маршрутизация

| Файл              | Роль                                              |
| ----------------- | ------------------------------------------------- |
| `index.html`      | Загружает `src/main.tsx`                          |
| `src/main.tsx`    | Монтирует `<App />` в `#root` внутри `StrictMode` |
| `src/app/App.tsx` | Корневой компонент; собирает страницы             |

Маршрутизация через **react-router-dom** с `basename={import.meta.env.BASE_URL}`.

| Путь            | Компонент              | Доступ                                          |
| --------------- | ---------------------- | ----------------------------------------------- |
| `/`             | redirect → `/workouts` | только авторизованные                           |
| `/workouts`     | `WorkoutsPage`         | только авторизованные                           |
| `/nutrition`    | `NutritionPage`        | только авторизованные                           |
| `/measurements` | `MeasurementsPage`     | только авторизованные                           |
| `/auth`         | `AuthPage`             | только гости (login/register на одной странице) |
| `*`             | redirect → `/workouts` | —                                               |

Защита маршрутов: `ProtectedRoute` / `GuestRoute`. Авторизованные страницы обёрнуты в `AppLayout` с `AppNav`: кнопка меню → сайдbar (Workouts, Nutrition, Measurements, Sign out). При старте `AuthInit` восстанавливает сессию через `GET /auth/me` по токену из `localStorage`.

## Деплой (GitHub Pages)

Сайт публикуется на `https://vanya2535.github.io/gym-diary-frontend/` при push в `main`.

| Компонент                       | Назначение                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `vite.config.ts` → `base`       | Берётся из env `BASE_PATH` (по умолчанию `/`)                                                           |
| `.github/workflows/deploy.yml`  | Сборка с `BASE_PATH=/gym-diary-frontend/`, `VITE_API_URL` (Render backend), деплой через GitHub Actions |
| `import.meta.env.BASE_URL`      | Использовать для путей к файлам из `public/` (иконки, favicon и т.д.)                                   |
| `scripts/copy-spa-fallback.mjs` | После `build:pages` копирует `index.html` → `404.html` (SPA deep links)                                 |
| `public/manifest.webmanifest`   | `start_url: "."` — «Добавить на экран» открывает корень репозитория, не `/auth`                         |

GitHub Pages не знает client-side маршруты (`/auth`, `/workouts` …). Без `404.html` прямой заход или иконка на главном экране с URL вида `…/gym-diary-frontend/auth` отдаёт 404. `404.html` (копия `index.html`) загружает SPA, React Router с `basename={import.meta.env.BASE_URL}` обрабатывает путь.

Локальная проверка Pages-сборки: `npm run preview:pages`.

Первичная настройка репозитория на GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions** (не «Deploy from a branch»).

Если Source = branch/main, на сайте будет dev-версия `index.html` и ошибка `GET .../src/main.tsx 404` — GitHub отдаёт исходники, а не `dist/`. Исправление: переключить Source на GitHub Actions, re-run workflow **Deploy to GitHub Pages**.

При переименовании репозитория обнови `BASE_PATH` в workflow и скрипте `build:pages`. Для custom domain задай `BASE_PATH=/`.

## API и окружение

Backend: **gym-diary-backend** (Fastify, opaque Bearer token).

### Переменные окружения

| Переменная     | Назначение                           | Пример                                                                         |
| -------------- | ------------------------------------ | ------------------------------------------------------------------------------ |
| `VITE_API_URL` | Базовый URL API (без trailing slash) | `http://localhost:3000` (dev), `https://gym-diary-backend.onrender.com` (prod) |

Шаблон: `.env.example`. Локально скопируй в `.env`.

**Production (GitHub Pages):** `VITE_API_URL` задаётся в `.github/workflows/deploy.yml` на шаге Build (Vite вшивает значение при сборке). После смены URL бэкенда — обнови workflow и re-run deploy.

**Backend CORS:** origin фронта `https://vanya2535.github.io` должен быть в `CORS_ORIGINS` на Render (см. backend `render.yaml`).

### Авторизация

| Эндпоинт                                   | Метод            | Auth   | Описание                                     |
| ------------------------------------------ | ---------------- | ------ | -------------------------------------------- |
| `/auth/register`                           | POST             | —      | `{ nickname, password }` → `{ token, user }` |
| `/auth/login`                              | POST             | —      | `{ nickname, password }` → `{ token, user }` |
| `/auth/me`                                 | GET              | Bearer | `{ user }`                                   |
| `/workouts`, `/nutrition`, `/measurements` | GET/POST         | Bearer | list/create diary entries                    |
| `/{resource}/:id`                          | GET/PATCH/DELETE | Bearer | get/update/delete entry                      |

Токен хранится в `localStorage` (ключ `gym-diary:auth-token`). Запросы с токеном: заголовок `Authorization: Bearer <token>` (axios interceptor в `api.ts`). Logout — только на клиенте (очистка токена); эндпоинта logout на backend нет.

Diary entries: `{ id, content, authorId, createdAt }`. List API — cursor pagination: `?limit=1..100` (default 20), `?cursor=<id>` для следующей страницы; ответ `{ items, nextCursor }`. Backend отдаёт страницы от новых к старым (`createdAt desc`).

UI — чат (`ChatDiaryPage`): дизайн composer и взаимодействий — по паттернам мобильного Telegram (см. раздел «UI и дизайн»). Первая страница при монтировании, старые сообщения подгружаются при прокрутке вверх через `IntersectionObserver` (sentinel вверху списка). Размер страницы: `DIARY_PAGE_SIZE` (20) в `constants/diary.ts`. **Long press** — первое выделение; далее **клик** переключает выделение. **Клик** без режима выделения — редактирование: контент в textarea, над полем ссылка с первой строкой (скролл к сообщению), Save → `PATCH`. при **≥1** выделенном в `AppNav`: слева — «назад», справа — копирование и удаление (меню скрыто). → `ConfirmDeleteModal` → один `DELETE /{resource}` с `{ ids }`. Состояние выделения: `hooks/diarySelectionStore.ts`. Сервис: `src/services/diary-entry.ts` (`createDiaryEntryService`, `workoutsService`, `nutritionService`, `measurementsService`).

HTTP-клиент: `src/services/api.ts` (axios instance `apiClient`, обёртка `apiRequest`). Auth: `src/services/auth.ts`, `src/hooks/authStore.ts`, `src/utils/tokenStorage.ts`.

### npm registry

В корне лежит `.npmrc` с `registry=https://registry.npmjs.org/` — он перекрывает корпоративный registry из глобального конфига. Не удаляй и не меняй без необходимости; после `npm install` в `package-lock.json` все `resolved` должны указывать на `registry.npmjs.org`.

Для GitHub Pages задай `VITE_API_URL` при сборке (см. `deploy.yml`). На Render у бэкенда добавь origin фронта в `CORS_ORIGINS`.

## Документация: что обновлять

Любое изменение кода должно сопровождаться актуализацией документации. Минимальный чеклист:

| Изменение                              | Обновить                                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------------------------ |
| Новая команда npm, скрипт, зависимость | `AGENTS.md` (раздел «Стек», «Команды», «Зависимости (npm)»), при необходимости `README.md` |
| Новый каталог, слой архитектуры        | `AGENTS.md` (раздел «Структура»)                                                           |
| Новые соглашения (стиль, паттерны)     | `AGENTS.md` (раздел «Конвенции»)                                                           |
| Маршруты, страницы                     | `AGENTS.md` (раздел «Маршрутизация»)                                                       |
| API, env, auth                         | `AGENTS.md` (раздел «API»), `.env.example`                                                 |
| Пользовательский quick start           | `README.md`                                                                                |

Не создавай лишние markdown-файлы без запроса пользователя. Держи информацию в `AGENTS.md` (для агентов) и `README.md` (для людей).

## Типичные задачи агента

1. **Новая фича** — создай файлы в подходящем каталоге `src/`, подключи в дереве компонентов, обнови `AGENTS.md`.
2. **Рефакторинг** — сохрани публичное поведение; обнови документацию, если меняется структура или контракты.
3. **Зависимости** — см. раздел «Зависимости (npm)» ниже; зафиксируй назначение пакета в разделе «Стек».
4. **Багфикс** — минимальный diff; документацию трогай только если баг связан с неверным описанием поведения.

## Зависимости (npm)

CI (GitHub Actions) использует **`npm ci`** — нужна полная синхронизация `package.json` и `package-lock.json`.

**Версии — только exact (без `^`, `~`, `*`):**

- В `package.json` — точные версии: `"vite": "8.1.3"`, не `"^8.1.3"`.
- В `.npmrc`: **`save-exact=true`**.
- Не редактируй `package-lock.json` вручную; не удаляй lock из репозитория.

**Обязательно для агента:**

1. Коммить **`package.json` + `package-lock.json`** вместе.
2. После изменений: **`npm install`**, затем **`rm -rf node_modules && npm ci`**, затем **`npm run build`**.
3. Обновляй раздел «Стек» и npm-скрипты при смене пакетов.

**Типичные ошибки:** только `package.json` без lock; диапазоны версий → разный граф на CI (rolldown optional bindings); TypeScript 6.x без совместимого `typescript-eslint` → `ERESOLVE`.

## Ограничения

- Не коммить `.env` и секреты.
- Не менять `git config`.
- Не добавлять тесты и документацию сверх необходимого, если пользователь явно не просил.
- Следуй существующим паттернам проекта; не over-engineer.
