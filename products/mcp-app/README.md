# MCP Product Line

This directory is the independent product workspace for the future MCP-based
commercial product line.

## Purpose

- Serve OpenClaw, Codex, and other CLI / Agent toolchains
- Expose the same core document-processing backend through MCP-friendly access
- Keep the MCP product line isolated from the local-model development line

## Product Goal

Provide an agent-oriented entrypoint for:

`file input or file URL -> PaddleOCR-VL-1.5 API -> internal Markdown/JSON -> DOCX rendering -> task result + download link`

## Relationship to Other Product Lines

- `web`: human-facing Web/H5 product line
- `mcp`: agent-facing MCP/CLI product line
- shared backend: OCR orchestration, task management, billing primitives, DOCX rendering, storage and download delivery

## Directory Layout

- `docs/`: PRD, technical notes, branching and release rules, roadmap
- `app/`: reserved for future MCP gateway / adapter implementation

