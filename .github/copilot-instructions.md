# Copilot Instructions

AI coding assistants working in this repository must follow these rules.

## Mandatory Database Workflow

All database schema changes must be generated and applied through commands.

Required flow:

1. Change entities or database-related code.
2. Generate migration by command:

```bash
npm run db:local:migration:generate -- src/database/migrations/DescriptiveMigrationName
```

3. Review the generated migration.
4. Apply migration by command:

```bash
npm run db:local:migration:deploy
```

5. Check migration status:

```bash
npm run db:local:migration:status
```

6. Run build:

```bash
npm run build
```

7. Commit entity/code changes and generated migration together.

Never hand-write schema migrations. Never use `synchronize: true`.

## Mandatory Module Structure

New business modules must include DTOs, controller, repository, service layer, and module file.

Controllers must not access TypeORM directly.

Split service behavior by operation group when the module has more than trivial behavior:

- get/query
- create
- update
- delete

## Type Safety

Avoid `any`. Prefer DTOs, interfaces, entity types, `unknown`, generics, or narrow union types.

Only use `any` when unavoidable for a framework or third-party API, after narrowing/validation, and with a short explanatory comment.

## Full Requirements

Read `AI_DATABASE_CHANGE_REQUIREMENTS.md` before database, entity, repository, service, controller, or module changes.
