# Цифровая визитка

Backend-визитка: PostgreSQL, Prisma, NestJS, GraphQL (Apollo Sandbox), Docker.

Запуск с пустой машины:

```bash
docker compose up --build
```

Sandbox: <http://localhost:3000/graphql>

```graphql
query {
  profile {
    name
    description
    links {
      title
      url
    }
    skills {
      name
    }
    experience {
      company
      position
      period
      achievements
    }
    projects {
      name
      url
    }
  }
}
```

Пароль базы `card` задан в `docker-compose.yml` и нужен только локальному контейнеру.

## Куда смотреть

| Задача | Файл |
| --- | --- |
| Имя, текст, ссылки, навыки, опыт, проекты | `src/card/card.ts` |
| Порт, путь GraphQL, подпись открытой даты, SQL-лог | `src/config/configuration.ts` и переменные окружения |
| Таблицы | `prisma/schema.prisma` |
| Что читается из базы | `src/profile/profile.repository.ts` |
| Как собирается ответ | `src/profile/profile.service.ts` |
| Схема GraphQL | `src/profile/profile.model.ts` и `profile.resolver.ts` |

## Слои

Данные, доступ к базе и GraphQL разделены, потому что правка факта не должна требовать правки запроса, а правка запроса не должна переписывать сид.

- `src/card/card.ts` — единственный источник фактов.
- `SeedService` при старте проверяет карточку и заново записывает строки. Повторный запуск не плодит дубли: старые списки удаляются, профиль обновляется.
- `ProfileRepository` ходит в Prisma и больше ничего не знает.
- `ProfileService` выбирает профиль по id из карточки и собирает строку периода. Месяцы лежат в базе, фраза «по настоящее время» берётся из `periodText`.
- `ProfileResolver` только переводит выборку GraphQL в флаги и вызывает сервис.

Мутаций нет. Запись через API разошлась бы с `card.ts`, и при следующем старте сид затёр бы её.

## Запрос к базе

`{ profile { name } }` читает одну строку `Profile`. Таблицы ссылок, навыков, опыта и проектов не открываются.

Резолвер смотрит поля запроса (`selection.ts`) и передаёт в репозиторий четыре флага. В `include` попадает только запрошенная связь. В `schema.prisma` включён preview `relationJoins`, поэтому запрошенные списки приходят одним JOIN (`relationLoadStrategy: 'join'`), а не отдельным запросом на каждую строку. Профиль один, поэтому DataLoader здесь ничего не сокращает.

`DEBUG_SQL=true` печатает SQL в лог. Так на созвоне видно, какие таблицы задел конкретный запрос.

## Что добавить

Навык, ссылка, проект, место работы или пункт в достижениях — одна запись в массиве `src/card/card.ts`. Порядок в массиве становится порядком в ответе.

Для правки без пересборки образа поднимите только базу и сервер в watch-режиме:

```bash
docker compose up -d postgres
npm install
npm run start:dev
```

Перед `npm run start:dev` скопируйте `.env.example` в `.env`. На Windows: `copy .env.example .env`.

Сохранили `card.ts` — Nest перезапустился и сид записал новое значение. В Docker тот же эффект даёт `docker compose up --build`.

Новое текстовое поле профиля повторяет путь `description`:

1. Колонка в `prisma/schema.prisma`.
2. `npx prisma migrate dev --name field` при запущенном PostgreSQL.
3. Поле в типе и в объекте `src/card/card.ts`.
4. Поле в `profile.model.ts`.
5. По одной строке в `profile.repository.ts` и `profile.service.ts`.

В навыках перечислено только то, с чем была коммерческая работа. NestJS, Prisma и GraphQL — стек этой визитки.

Месяц начала в `card.ts` стоит `2020-01` из расчёта «шесть лет». Если в трудовой другой месяц или уже есть дата окончания, меняется одна строка `startedOn` / `finishedOn`.
