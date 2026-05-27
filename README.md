# Petshop SaaS API

Generic multi-tenant petshop SaaS API built with NestJS, TypeORM and MySQL.

## Layers

Every business module follows:

```text
controller -> service -> repository -> TypeORM entity
```

## Environments

Use `APP_ENV` to select an environment file:

```bash
APP_ENV=local npm run start:dev
APP_ENV=staging npm run start:prod
APP_ENV=production npm run start:prod
```

Available files:

- `env/.env.local`
- `env/.env.staging`
- `env/.env.production`
- `env/.env.example`

## Scripts

Application:

```bash
npm run start:local
npm run build:staging
npm run start:staging
npm run build:production
npm run start:production
```

## Database

`synchronize` is always `false`. Use migrations:

```bash
npm run db:local:migration:create -- src/database/migrations/ManualChange
npm run db:local:migration:generate -- src/database/migrations/AddBillingFields
npm run db:local:migration:status
npm run db:local:migration:deploy
npm run db:local:migration:run
npm run db:local:migration:revert
npm run db:local:migration:show
npm run db:local:schema:log

npm run db:staging:migration:create -- src/database/migrations/ManualChange
npm run db:staging:migration:generate -- src/database/migrations/AddBillingFields
npm run db:staging:migration:status
npm run db:staging:migration:deploy
npm run db:staging:migration:run
npm run db:staging:migration:revert
npm run db:staging:migration:show
npm run db:staging:schema:log

npm run db:production:migration:create -- src/database/migrations/ManualChange
npm run db:production:migration:generate -- src/database/migrations/AddBillingFields
npm run db:production:migration:status
npm run db:production:migration:deploy
npm run db:production:migration:run
npm run db:production:migration:revert
npm run db:production:migration:show
npm run db:production:schema:log
```

Generate or create migrations by passing the target path:

```bash
npm run db:local:migration:generate -- src/database/migrations/AddBillingFields
npm run db:staging:migration:generate -- src/database/migrations/AddBillingFields
npm run db:production:migration:generate -- src/database/migrations/AddBillingFields

npm run db:local:migration:create -- src/database/migrations/ManualChange
```

`migration:deploy` is an alias for TypeORM `migration:run`. `migration:status` is an alias for TypeORM `migration:show`.

## Local MySQL

```bash
docker compose up -d
npm run migration:run
npm run start:dev
```
