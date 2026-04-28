# Traceability Log

This file records key technical decisions with dates and rationale.

## Format

```
### YYYY-MM-DD: [Decision Title]
- **Context**: What triggered this decision
- **Options Considered**: List of alternatives
- **Decision**: What was chosen
- **Rationale**: Why this option won
- **Consequences**: Trade-offs and follow-up actions
```

---

## Decisions

### 2025-03-22: ORM Selection
- **Context**: Need to select ORM for PostgreSQL database access
- **Options Considered**: Prisma, Drizzle, Kysely
- **Decision**: Drizzle ORM
- **Rationale**:
  - Lightweight, TypeScript-first with excellent type inference
  - Better serverless performance than Prisma (no heavy query engine)
  - SQL-like syntax, easier to reason about for complex queries
  - Smaller bundle size
  - Good migration support with drizzle-kit
- **Consequences**:
  - Less abstraction than Prisma, more SQL knowledge needed
  - Smaller community than Prisma
  - Follow-up: All 6 tables implemented with proper indexes and FKs

### 2024-XX-XX: DOCX Generation Method (Pending)
- **Context**: Need to generate DOCX from OCR markdown output
- **Options Considered**: Python subprocess CLI, HTTP internal service
- **Decision**: _To be decided_
- **Rationale**: _TBD_
- **Consequences**: _TBD_

### 2024-XX-XX: Queue Implementation (Pending)
- **Context**: Task queue for async processing
- **Options Considered**: DB polling, Redis queue
- **Decision**: DB polling for v0
- **Rationale**: Simplicity, no additional infrastructure
- **Consequences**: Higher DB load, polling latency

---

## References

- Architecture: [TECHNICAL_ARCHITECTURE.md](../TECHNICAL_ARCHITECTURE.md)
- Data Model: [DATA_MODEL_AND_STATE_MACHINE.md](../DATA_MODEL_AND_STATE_MACHINE.md)
