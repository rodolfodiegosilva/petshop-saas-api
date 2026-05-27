# Agent Instructions

All AI agents and automation working in this repository must follow these rules.

## Read First

Before changing database structure, modules, entities, repositories, services, or controllers, read:

- [AI_DATABASE_CHANGE_REQUIREMENTS.md](./AI_DATABASE_CHANGE_REQUIREMENTS.md)

## Mandatory Database Workflow

All database schema changes must follow the command-driven migration workflow:

1. Change entities or database-related code.
2. Generate migration by command.
3. Review generated migration.
4. Apply migration by command.
5. Check migration status.
6. Run build.
7. Commit entity/code changes and generated migration together.

Never hand-write schema migrations. Never use `synchronize: true`.

## Mandatory Module Structure

New business modules must include:

- DTOs.
- Controller.
- Repository.
- Service layer.
- Module file.

When behavior is more than trivial, split services by operation group:

- get/query
- create
- update
- delete

Controllers must not access TypeORM directly.

## Type Safety

Avoid `any`. Prefer DTOs, interfaces, entity types, `unknown`, generics, or narrow union types.

Only use `any` when unavoidable for a framework or third-party API, after narrowing/validation, and with a short explanatory comment.
