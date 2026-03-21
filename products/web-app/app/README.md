# Web Application Workspace

This directory now contains the initial Next.js + TypeScript skeleton for the
`web` product line.

## Included in this v0 skeleton

- App Router pages for:
  - home
  - upload
  - wallet
  - task list
  - task detail
- Minimal API route placeholders for:
  - anonymous session creation
  - task listing
  - task detail
  - wallet metadata
- Domain primitives for:
  - anonymous sessions
  - task state transitions
  - primary navigation

## Commands

```bash
npm install
npm run dev
npm test
```

## Important constraint

The application must stay fully API-only and must not depend on local
PaddleOCR model execution as its primary runtime path.
