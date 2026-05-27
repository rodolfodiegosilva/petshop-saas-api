---
type: always_apply
---

# Project Requirements

These rules are always applied for Augment.

## Database Workflow

All schema changes must use command-generated migrations:

```bash
npm run db:local:migration:generate -- src/database/migrations/DescriptiveMigrationName
npm run db:local:migration:deploy
npm run db:local:migration:status
npm run build
```

Never hand-write schema migrations. Never use `synchronize: true`.

## Module Structure

New business modules must include DTOs, controller, repository, service layer, and module file.

Split services by operation group when behavior is more than trivial:

- get/query
- create
- update
- delete

Controllers must not access TypeORM directly.

## Type Safety

Avoid `any`. Prefer DTOs, interfaces, entity types, `unknown`, generics, or narrow union types.
