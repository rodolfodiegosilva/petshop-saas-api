# Coding Conventions

These conventions are intended for Aider and any agent that reads repository convention files.

## Database Changes

All database schema changes must follow this exact flow:

```bash
npm run db:local:migration:generate -- src/database/migrations/DescriptiveMigrationName
npm run db:local:migration:deploy
npm run db:local:migration:status
npm run build
```

Never hand-write schema migrations. Never use `synchronize: true`.

## Modules

New business modules must include:

- DTOs.
- Controller.
- Repository.
- Service layer.
- Module file.

Split services by operation group when behavior is more than trivial:

- get/query
- create
- update
- delete

Controllers must not access TypeORM directly.

## Type Safety

Avoid `any`. Prefer DTOs, interfaces, entity types, `unknown`, generics, or narrow union types.
