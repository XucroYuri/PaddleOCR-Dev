# PaddleOCR-Dev — AI Agent Onboarding Instructions

## Project Identity
- **Name**: PaddleOCR-Dev
- **Type**: Fork of [PaddlePaddle/PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) — upstream tracks the original
- **Package**: `paddleocr` (dynamic version via setuptools_scm), CLI command: `paddleocr`
- **Stack**: Python 3.8-3.12 + PaddlePaddle ecosystem + paddlex[ocr-core]>=3.4.0
- **Remote**: `origin` = XucroYuri/PaddleOCR-Dev (fork), `upstream` = PaddlePaddle/PaddleOCR
- **License**: Apache 2.0
- **Domain**: OCR (Optical Character Recognition) & Document AI

## Quick Reference

```bash
pip install paddleocr                       # Install core package
pip install "paddleocr[all]"                # Full install (doc-parser, IE, translation)
paddleocr --version                         # Verify CLI works
paddleocr PaddleOCR --input demo.png        # Run OCR pipeline
paddleocr PPStructureV3 --input doc.pdf     # Document structure analysis
cd tests && python -m pytest -m "not resource_intensive"  # Run tests
```

## Project Summary

PaddleOCR is an industry-leading, production-ready OCR and document AI engine offering end-to-end solutions from text extraction to intelligent document understanding. Supports Linux/Windows/Mac, CPU/GPU/XPU/NPU. Detects, recognizes, and structures text in images and documents across 80+ languages.

## Architecture

```
CLI (paddleocr <pipeline> --input file.png)
  -> paddleocr/__main__.py (console_entry)
    -> paddleocr/_cli.py (argparse subcommand registration)
      -> pipeline/mode class .get_cli_subcommand_executor()
        -> paddlex inference engine (PaddlePaddle backend)
          -> PaddlePaddle / ONNX / GenAI server runtime

Python API:
  from paddleocr import PaddleOCR
  ocr = PaddleOCR(lang='en')
  result = ocr.ocr('image.png')
```

## Top-Level Directory Map

| Directory | Purpose |
|-----------|---------|
| `paddleocr/` | Main Python package — public API, CLI, models, pipelines |
| `paddleocr/_models/` | 14 model classes (TextDetection, TextRecognition, DocVLM, ChartParsing, etc.) |
| `paddleocr/_pipelines/` | 11 pipeline classes (PaddleOCR, PPStructureV3, PPChatOCRv4Doc, etc.) |
| `paddleocr/_utils/` | Logging, deprecation warnings, internal utilities |
| `ppocr/` | Legacy PaddleOCR library — losses, metrics, postprocess, modeling, data |
| `ppstructure/` | Document structure analysis — KIE, layout, table recognition, recovery |
| `configs/` | Model configuration YAML files organized by task (cls, det, rec, e2e, kie, sr, table) |
| `tools/` | Training/eval/inference scripts — program.py, eval.py, infer*.py, export_model.py |
| `tests/` | Pytest suite — models, pipelines, postprocess tests |
| `deploy/` | Deployment configurations and scripts |
| `doc/` | Documentation sources (fonts, etc.) |
| `docs/` | Documentation, images, banners |
| `benchmark/` | Performance benchmark data |
| `test_tipc/` | TIPC (Test Inference Precision Chain) framework |
| `mcp_server/` | MCP server for PaddleOCR |
| `skills/` | PaddleOCR skills directory |
| `applications/` | Application-level examples |
| `mkdocs.yml` | MkDocs documentation build config |

## Critical Files

| File | Role |
|------|------|
| `paddleocr/__init__.py` | Public API — exports all models, pipelines, logger, __version__ |
| `paddleocr/__main__.py` | CLI entry point — `console_entry()` with SIGPIPE handling |
| `paddleocr/_cli.py` (196 lines) | Argparse CLI — registers all pipeline/model subcommands dynamically |
| `paddleocr/_version.py` | Version string (dynamic via setuptools_scm) |
| `paddleocr/_common_args.py` | Shared CLI argument definitions |
| `paddleocr/_constants.py` | Package-wide constants |
| `paddleocr/_env.py` | Environment variable handling |
| `pyproject.toml` | Build config — setuptools, dependencies, pytest markers, entry points |
| `requirements.txt` | Runtime Python dependencies (shapely, numpy, opencv, Pillow, etc.) |
| `setup.py` | Legacy setup.py (likely wraps setuptools) |
| `tools/program.py` (34K) | Main training/eval program — largest single source file |
| `ppstructure/predict_system.py` (15K) | Document structure prediction system |

## Package Hierarchy

```
paddleocr (pypi: paddleocr)
  -> depends on paddlex[ocr-core]>=3.4.0
     -> PaddlePaddle inference engine
  
Optional extras:
  paddleocr[doc-parser] -> paddlex[ocr,genai-client]
  paddleocr[ie]         -> paddlex[ie] (information extraction)
  paddleocr[trans]      -> paddlex[trans] (translation)
  paddleocr[all]        -> all of the above
```

## Models (paddleocr/_models/)

14 model classes, each with CLI subcommand support:
- ChartParsing, DocImgOrientationClassification, DocVLM
- FormulaRecognition, LayoutDetection, SealTextDetection
- TableCellsDetection, TableClassification, TableStructureRecognition
- TextDetection, TextImageUnwarping, TextLineOrientationClassification
- TextRecognition

## Pipelines (paddleocr/_pipelines/)

11 pipeline classes providing high-level workflows:
- DocPreprocessor, DocUnderstanding
- FormulaRecognitionPipeline, PaddleOCR, PaddleOCRVL
- PPChatOCRv4Doc, PPDocTranslation, PPStructureV3
- SealRecognition, TableRecognitionPipelineV2

## Development Rules

1. **Python compatibility**: Target 3.8-3.12. No features from 3.13+.
2. **Fork sync**: Keep dev-specific changes isolated from upstream. Regularly sync `main` from `PaddlePaddle/PaddleOCR`.
3. **Branch strategy**: Create feature branches for all changes. PR to `main` after review.
4. **Test before commit**: Run `python -m pytest -m "not resource_intensive"` from the `tests/` directory before pushing.
5. **CLI patterns**: New models/pipelines register via `get_cli_subcommand_executor()` in `_cli.py`.
6. **Imports**: All public API goes through `paddleocr/__init__.py`. Internal modules use leading underscore (`_models`, `_pipelines`).
7. **Dependencies**: Core dependency is `paddlex[ocr-core]>=3.4.0`. Avoid direct PaddlePaddle imports in the public API.
8. **License**: All new files must include the Apache 2.0 copyright header (see existing files for template).

## Build & Test

```bash
# Install editable
pip install -e .

# Run tests (excluding resource-intensive)
cd tests && python -m pytest -m "not resource_intensive"

# Full test suite
cd tests && python -m pytest

# Verify CLI
paddleocr --version
paddleocr PaddleOCR --help
```

## Security Configuration

- `.claude/settings.json` enforces `acceptEdits` mode and Bash whitelist
- Deny rules block: `rm -rf`, `rm -r`, `sudo`, `chown`, system file redirection
- Do not weaken deny rules without review

## For AI Agents

- **Working directory**: Always run Python commands from the project root or `tests/` as appropriate
- **Testing**: Tests use pytest with a `resource_intensive` marker for slow tests
- **Patterns**: Each model/pipeline class has a `get_cli_subcommand_executor()` classmethod for CLI registration
- **Logging**: Use `from paddleocr._utils.logging import logger` for consistent logging
- **Version**: Accessed via `paddleocr.__version__` (dynamic from setuptools_scm)
- **Configuration**: YAML-based model configs in `configs/` directory

## Avoid

- Modifying `ppocr/` or `ppstructure/` legacy code unless explicitly asked
- Adding direct PaddlePaddle API calls in the public `paddleocr/` API
- Hardcoding file paths or credentials
- Pushing directly to `main` without a feature branch
- Using `rm -rf`, `sudo`, `chown` (blocked by deny rules)
