# AI Database Change Requirements

This repository has a mandatory database-change workflow.

Any AI agent, automation, or developer changing database structure must follow this process. Do not bypass it.

## Hard Rule

Never create or edit schema migrations manually for database changes.

All database schema changes must be generated with the TypeORM CLI command for the target environment, then applied with the migration deploy command.

## Required Workflow

1. Change the TypeORM entities or database-related code.
2. Generate the migration by command:

```bash
npm run db:local:migration:generate -- src/database/migrations/DescriptiveMigrationName
```

3. Review the generated migration file.
4. Apply the migration by command:

```bash
npm run db:local:migration:deploy
```

5. Verify migration status:

```bash
npm run db:local:migration:status
```

6. Run build:

```bash
npm run build
```

7. Commit the entity changes and generated migration together.

## Environment-Specific Commands

Local:

```bash
npm run db:local:migration:generate -- src/database/migrations/DescriptiveMigrationName
npm run db:local:migration:deploy
npm run db:local:migration:status
```

Staging:

```bash
npm run db:staging:migration:generate -- src/database/migrations/DescriptiveMigrationName
npm run db:staging:migration:deploy
npm run db:staging:migration:status
```

Production:

```bash
npm run db:production:migration:generate -- src/database/migrations/DescriptiveMigrationName
npm run db:production:migration:deploy
npm run db:production:migration:status
```

## Prohibited Actions

- Do not set `synchronize: true`.
- Do not hand-write a migration for a schema change.
- Do not apply schema changes directly in MySQL.
- Do not commit entity schema changes without the generated migration.
- Do not mark work complete before running migration status.

## Required Module Structure

Every new business module must follow the project layering standard.

Required files/layers:

- DTOs for all request payloads.
- Controller for HTTP routes only.
- Service layer for business rules.
- Repository layer for persistence and TypeORM access.
- Module file wiring providers, controllers, imports, and exports.

The controller must not access TypeORM repositories directly.

The service layer must not be implemented as one large catch-all service. Split services by operation group when the module has more than trivial behavior:

- `get` or `query` service for reads.
- `create` service for creation flows.
- `update` service for update flows.
- `delete` service for removal/deactivation flows.

Example module shape:

```text
src/modules/example/
├── dto/
├── entities/
├── repositories/
│   └── example.repository.ts
├── services/
│   ├── example-get.service.ts
│   ├── example-create.service.ts
│   ├── example-update.service.ts
│   └── example-delete.service.ts
├── example.controller.ts
└── example.module.ts
```

Small modules may keep a single service only when the behavior is truly minimal. If the service grows beyond simple orchestration, split it before continuing.

## Type Safety Requirements

Avoid `any`.

Use explicit DTOs, interfaces, entity types, `unknown`, generics, or narrow union types instead.

`any` is only allowed when all of the following are true:

- A third-party API or framework type cannot reasonably be expressed.
- The value is narrowed or validated before business logic uses it.
- A short code comment explains why `any` is necessary.

## Existing Initial Migration

The initial schema migration was generated and applied through the command workflow:

```bash
npm run db:local:migration:generate -- src/database/migrations/InitialPetshopSaasSchema
npm run db:local:migration:deploy
npm run db:local:migration:status
```
