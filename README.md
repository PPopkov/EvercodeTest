# Career Project

**REST API на Node.js** для отслеживания криптовалют: CRUD валют и адресов, цены с Binance, высота блокчейна и балансы адресов с Blockchair.

**Что умеет сервер:**

- создавать, смотреть, менять и удалять валюты и адреса кошельков;
- по расписанию обновлять цены (Binance), высоту блокчейна и балансы адресов (Blockchair);
- отдавать сохранённые данные из базы (GET не ходит во внешние API);
- проверять Bearer-токен в заголовке запроса;
- показывать документацию в браузере на `/docs`.

**Нужно:** Node.js версии 22 или новее.

---

## Как запустить

1. Установить зависимости:

```bash
npm install
```

2. Создать в корне проекта файл `.env`:

```env
AUTH_TOKEN=мой-секретный-токен
PORT=3000
```

`AUTH_TOKEN` — обязательный. Без него авторизация не заработает.

3. Инициализировать базу (создать таблицы):

```bash
npm run db:init
```

Должно вывести: `Database initialized successfully.`

4. Запустить:

```bash
npm run dev
```

или для production:

```bash
npm run build
npm run db:init
npm start
```

5. Открыть в браузере: `http://localhost:3000/docs` — там все методы API.

Файл базы `data/app.db` создаётся при первом подключении. **Таблицы** — только через `npm run db:init` (или повторно после смены схемы).

---

## Как пользоваться API

В **каждый** запрос (включая `/status` и `/docs`) нужен заголовок:

```
Authorization: Bearer мой-секретный-токен
```

### Список методов

| Что сделать | Метод | Адрес |
| --- | --- | --- |
| Проверить, что сервер жив | GET | `/status` |
| Все валюты | GET | `/currency` |
| Одна валюта | GET | `/currency/1` |
| Добавить валюту | POST | `/currency` |
| Изменить валюту | PUT | `/currency/1` |
| Удалить валюту | DELETE | `/currency/1` |
| Текущие цены по тикеру | GET | `/price?currency=BTC` |
| История цен | GET | `/price/history?currency=BTC` |
| Все адреса | GET | `/address` |
| Один адрес | GET | `/address/1` |
| Добавить адрес | POST | `/address` |
| Изменить адрес | PUT | `/address/1` |
| Удалить адрес | DELETE | `/address/1` |
| Баланс адреса по id | GET | `/address/1/balance` |
| Высота блокчейна | GET | `/blockchain?currency=BTC` |

### Пример: добавить Bitcoin

```json
{
  "name": "Bitcoin",
  "ticker": "BTC",
  "blockchain": "bitcoin"
}
```

`blockchain` — имя сети в Blockchair (строчными буквами, например `bitcoin`, `ethereum`).

### Пример: добавить адрес

```json
{
  "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "label": "My wallet",
  "ticker": "BTC"
}
```

### Пример: баланс адреса

`GET /address/1/balance` — вернёт баланс из базы. Данные обновляет scheduler через Blockchair.

---

## Из чего состоит проект

```
index.ts          ← сборка зависимостей, scheduler, запуск сервера
config.ts         ← настройки из .env

src/
  routes/         ← HTTP-запросы
  services/       ← бизнес-логика и вызовы внешних API
  repository/     ← SQL-запросы к SQLite
  database/       ← подключение и миграции
  middleware/     ← auth и обработка ошибок
  errors/         ← NotFoundError, ValidationError и др.
  types/          ← интерфейсы TypeScript
  config/         ← Swagger
  utils/          ← логгер
```

**Как идёт обычный запрос:**

```
Запрос → auth → route → service → repository → SQLite
                                      ↓
                              errorHandler (если ошибка)
```

**Как работает scheduler (по умолчанию каждые 40 сек):**

```
scheduler → syncPrices (один запрос к Binance → фильтр по валютам → запись в prices + prices_history)
         → syncHeight (Blockchair)
         → syncAddressBalance для каждого адреса (Blockchair)
```

GET-эндпоинты читают только из базы. Sync выполняется в фоне.

---

## Настройки (.env)

| Переменная | Зачем | По умолчанию |
| --- | --- | --- |
| `AUTH_TOKEN` | Секрет для входа в API | — (обязательно) |
| `PORT` | Порт сервера | `3000` |
| `PRICE_UPDATE_INTERVAL` | Интервал scheduler, мс | `40000` |
| `BINANCE_API_URL` | URL Binance API | `https://api.binance.com/api/v3/ticker/price` |
| `BINANCE_RETRIES` | Повторы при ошибке Binance | `3` |
| `BINANCE_TIMEOUT` | Таймаут Binance, мс | `5000` |
| `BLOCKCHAIR_API_URL` | URL Blockchair API | `https://api.blockchair.com` |
| `BLOCKCHAIR_RETRIES` | Повторы при ошибке Blockchair | `3` |
| `BLOCKCHAIR_TIMEOUT` | Таймаут Blockchair, мс | `5000` |
| `NODE_ENV` | Окружение | `development` |

---

## Скрипты

| Команда | Описание |
| --- | --- |
| `npm run dev` | Запуск с hot-reload (tsx) |
| `npm run db:init` | Создание таблиц в SQLite (`src/database/init.ts`) |
| `npm run build` | Сборка TypeScript в `dist/` |
| `npm start` | Запуск собранного приложения |
| `npm run typecheck` | Проверка типов без сборки |
| `npm test` | Запуск тестов (Jest) |

---

## Тесты

```bash
npm test
```

52 теста: auth (401/403), CRUD валют и адресов, цены, история, blockchain, balance, scheduler.

---

## Технологии

- **Node.js 22** — среда выполнения
- **TypeScript** — типизация
- **Express 5** — маршруты и middleware
- **better-sqlite3** — SQLite в файле `data/app.db`
- **Axios** — запросы к Binance и Blockchair
- **Swagger** — документация на `/docs`
- **Jest + Supertest** — тесты API
