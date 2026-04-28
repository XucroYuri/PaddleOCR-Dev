# Plan Context Index

This directory contains implementation planning artifacts for the web-app product.

## Files

| File | Purpose |
|------|---------|
| `00_TRACEABILITY.md` | Technical decision records with dates |
| `13_TODO_BACKLOG_EXPANDED.md` | Full backlog with checkboxes (SSOT for task status) |
| `14_UI_UX_SHADCN.md` | UI/UX guidelines, shadcn patterns, responsive design |

## Relationship to Other Docs

- **Hub**: `../DEVELOPMENT_PLAN.md` (if exists)
- **Architecture**: `../TECHNICAL_ARCHITECTURE.md`
- **Data Model**: `../DATA_MODEL_AND_STATE_MACHINE.md`
- **API**: `../API_INTEGRATION.md`
- **Payment**: `../PAYMENT_FLOW.md`
- **Branching**: `../BRANCHING_AND_RELEASE.md`

## SSOT Maintenance Workflow

1. Update `13_TODO_BACKLOG_EXPANDED.md` first (check/uncheck, add id mapping)
2. Sync to Cursor plan YAML or other tracking tools
3. Record decisions in `00_TRACEABILITY.md`

## ID Mapping Convention

Task IDs follow pattern: `p{phase}-{seq}-{slug}`

- `p0`: Process/infra setup
- `p1`: Database/ORM
- `p2`: Session management
- `p3`: Wallet/Payment
- `p4`: Object storage
- `p5`: Tasks API
- `p6`: OCR integration
- `p7`: Worker
- `p8`: DOCX generation
- `p9`: UI/Frontend
- `p10`: Testing/Deployment
