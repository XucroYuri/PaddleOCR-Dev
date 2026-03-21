# Web Product Line

This directory is the independent product workspace for the API-only Web
application built on top of PaddleOCR-VL-1.5 cloud APIs.

## Purpose

- Serve the commercial Web/H5 product line
- Keep Web product assets isolated from the local-model development line
- Host product docs, architecture notes, and future application code

## Branching Context

- `local`: current repository's local capability line
- `web`: product development line for this directory
- `production`: empty receiving branch for staged promotion from `web`

## Product Goal

Turn teaching materials such as exams, handouts, and homework into editable
Word documents through the following flow:

`anonymous session -> payment / top-up -> upload -> PaddleOCR-VL-1.5 API -> internal Markdown/JSON -> DOCX rendering -> file download`

## Directory Layout

- `docs/`: PRD, technical notes, branching and release rules, roadmap
- `app/`: reserved for future frontend/backend/worker implementation

