# Getting started

- Clone Repo: `git clone ...`
- Install dependencies: `cd <> && npm install`
- Start database: `docker-compose up ada-db -d`
- Start rabbitmq: `docker-compose up rabbitmq -d`
- `optional:` Configure Database
    - `docker-compose.yml` Database
    - `src/app.module.ts` [TypeORM](https://typeorm.io/) Configuration
- Run server: `npm run start`
    - Debugging mode: `npm run start:debug`
- Run tests: `npm test`