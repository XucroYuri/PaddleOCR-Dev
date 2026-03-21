from __future__ import annotations

import argparse

from .core import (
    DEFAULT_TEMPLATE_ANCHOR,
    StyleProfile,
    TemplateCatalog,
    create_starter_template,
    render_markdown_to_docx,
)


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="python -m applications.markdown_to_docx",
        description="Render PaddleOCR Markdown outputs into styled DOCX files.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    init_parser = subparsers.add_parser("init-template")
    init_parser.add_argument("--output", required=True, help="Path to the starter template DOCX.")
    init_parser.add_argument("--title", default="PaddleOCR Markdown Template")

    render_parser = subparsers.add_parser("render")
    render_parser.add_argument("--markdown", required=True, help="Input Markdown file.")
    render_parser.add_argument("--output", required=True, help="Output DOCX path.")
    render_parser.add_argument("--template", help="Optional DOCX template path.")
    render_parser.add_argument("--anchor", help="Template anchor paragraph to replace.")
    render_parser.add_argument("--style-profile", help="Optional style profile JSON path.")
    render_parser.add_argument("--catalog", help="Optional template catalog JSON path.")
    render_parser.add_argument("--template-id", help="Template id inside the catalog.")

    return parser


def main(argv: list[str] | None = None) -> int:
    parser = _build_parser()
    args = parser.parse_args(argv)

    if args.command == "init-template":
        create_starter_template(args.output, title=args.title)
        return 0

    style_profile = None
    template_path = args.template
    anchor = args.anchor
    if args.catalog:
        if not args.template_id:
            parser.error("--template-id is required when --catalog is used.")
        resolved = TemplateCatalog.load(args.catalog).resolve(args.template_id)
        template_path = str(resolved.template_path)
        anchor = anchor or resolved.anchor
        if args.style_profile:
            style_profile = StyleProfile.load(args.style_profile)
        elif resolved.style_profile_path:
            style_profile = StyleProfile.load(resolved.style_profile_path)
    elif args.style_profile:
        style_profile = StyleProfile.load(args.style_profile)

    with open(args.markdown, "r", encoding="utf-8") as fp:
        markdown_text = fp.read()

    render_markdown_to_docx(
        markdown_text=markdown_text,
        output_path=args.output,
        template_path=template_path,
        anchor=anchor or DEFAULT_TEMPLATE_ANCHOR,
        style_profile=style_profile,
    )
    return 0
