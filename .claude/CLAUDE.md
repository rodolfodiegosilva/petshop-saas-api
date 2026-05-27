# Claude Project Instructions

Follow the repository rules in `../CLAUDE.md` and `../AI_DATABASE_CHANGE_REQUIREMENTS.md`.

Mandatory requirements:

- Database schema changes must generate migrations by command, apply migrations by command, check migration status, and run build.
- Never hand-write schema migrations.
- Never use `synchronize: true`.
- New business modules must include DTOs, controller, repository, service layer, and module file.
- Split services by operation group when behavior is more than trivial: get/query, create, update, delete.
- Controllers must not access TypeORM directly.
- Avoid `any`; use explicit DTOs, interfaces, entity types, `unknown`, generics, or narrow union types.
