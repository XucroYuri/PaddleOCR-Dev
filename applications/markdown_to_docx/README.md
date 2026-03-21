# Markdown to DOCX

This reference application turns PaddleOCR Markdown outputs into styled `.docx`
documents without changing the core OCR pipeline.

## What it is for

- Use `PP-StructureV3` or `PaddleOCR-VL` to produce Markdown
- Feed that Markdown into a Word template
- Control fonts, sizes, paragraph spacing, and table styling with a JSON style profile
- Export a final `.docx` deliverable for downstream business workflows

## Supported blocks

- Headings (`#`, `##`, `###`)
- Paragraphs
- Bullet and numbered lists
- Pipe tables and HTML tables
- Block quotes
- Code blocks
- Inline or HTML image references when local files are available

## Quick start

Create a starter template:

```bash
python3 -m applications.markdown_to_docx init-template \
  --output /tmp/paddleocr-template.docx \
  --title "Structured Report Template"
```

Render a Markdown file directly:

```bash
python3 -m applications.markdown_to_docx render \
  --markdown output/doc.md \
  --output output/doc.docx \
  --template /tmp/paddleocr-template.docx \
  --style-profile applications/markdown_to_docx/examples/default_style_profile.json
```

Use a template catalog:

```bash
python3 -m applications.markdown_to_docx render \
  --markdown output/doc.md \
  --output output/doc.docx \
  --catalog applications/markdown_to_docx/examples/template_catalog.json \
  --template-id report
```

## Template behavior

The renderer looks for a paragraph whose full text matches
`{{PADDLEOCR_MARKDOWN}}`. That placeholder is removed and replaced with the
rendered Markdown content, while the rest of the template remains intact.

## Why this sits in `applications/`

This component is intentionally downstream of PaddleOCR itself:

`PaddleOCR Markdown -> Markdown to DOCX renderer -> final Word document`

That keeps OCR and final document formatting decoupled, which makes it easier to
swap templates, change business styles, or insert LLM post-processing later.

