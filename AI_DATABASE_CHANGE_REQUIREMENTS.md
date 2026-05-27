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

## Existing Initial Migration

The initial schema migration was generated and applied through the command workflow:

```bash
npm run db:local:migration:generate -- src/database/migrations/InitialPetshopSaasSchema
npm run db:local:migration:deploy
npm run db:local:migration:status
```

