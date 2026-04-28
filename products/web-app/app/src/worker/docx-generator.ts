/**
 * P8: DOCX Generation Module
 * Converts OCR markdown results to Word documents
 */

import { config } from "@/lib/config";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
  ExternalHyperlink,
  convertInchesToTwip,
  type ISectionOptions,
} from "docx";

/**
 * P8.1: Template mapping for document types
 */
const TEMPLATE_MAP: Record<string, DocxTemplateConfig> = {
  "exam-default": {
    name: "试卷",
    fontFamily: "SimSun",
    fontSize: 12,
    headingFont: "SimHei",
    titleSize: 18,
    margins: {
      top: convertInchesToTwip(1),
      right: convertInchesToTwip(1),
      bottom: convertInchesToTwip(1),
      left: convertInchesToTwip(1),
    },
  },
  "handout-default": {
    name: "讲义",
    fontFamily: "SimSun",
    fontSize: 11,
    headingFont: "SimHei",
    titleSize: 16,
    margins: {
      top: convertInchesToTwip(0.75),
      right: convertInchesToTwip(0.75),
      bottom: convertInchesToTwip(0.75),
      left: convertInchesToTwip(0.75),
    },
  },
  "homework-default": {
    name: "作业",
    fontFamily: "SimSun",
    fontSize: 11,
    headingFont: "SimHei",
    titleSize: 14,
    margins: {
      top: convertInchesToTwip(0.75),
      right: convertInchesToTwip(0.75),
      bottom: convertInchesToTwip(0.75),
      left: convertInchesToTwip(0.75),
    },
  },
};

interface DocxTemplateConfig {
  name: string;
  fontFamily: string;
  fontSize: number;
  headingFont: string;
  titleSize: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

/**
 * P8: Generate DOCX from markdown content
 */
export async function generateDocx(
  markdownText: string,
  options: {
    documentType: "exam" | "handout" | "homework";
    templateId: string;
    title?: string;
    assets?: Map<string, Buffer>;
  }
): Promise<Buffer> {
  const templateKey = options.templateId ?? `${options.documentType}-default`;
  const template = TEMPLATE_MAP[templateKey] ?? TEMPLATE_MAP[`${options.documentType}-default`];

  // Parse markdown to document sections
  const sections = parseMarkdownToSections(markdownText, template, options);

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: template.margins,
          },
        },
        children: sections,
      } as ISectionOptions,
    ],
    numbering: {
      config: [
        {
          reference: "default-numbering",
          levels: [
            {
              level: 0,
              format: "decimal",
              text: "%1.",
              alignment: AlignmentType.LEFT,
            },
          ],
        },
      ],
    },
  });

  // P8.1: Generate buffer
  const buffer = await Packer.toBuffer(doc);
  return buffer;
}

/**
 * Parse markdown content to document paragraphs
 */
function parseMarkdownToSections(
  markdown: string,
  template: DocxTemplateConfig,
  options: { title?: string; assets?: Map<string, Buffer> }
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Add title if provided
  if (options.title) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: options.title,
            bold: true,
            size: template.titleSize * 2, // docx uses half-points
            font: template.headingFont,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );
  }

  // Split into lines and process
  const lines = markdown.split("\n");
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let listItems: string[] = [];

  for (const line of lines) {
    // Code blocks
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        // End code block
        paragraphs.push(createCodeParagraph(codeBlockContent.join("\n"), template));
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        // Start code block
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Headers
    if (line.startsWith("# ")) {
      paragraphs.push(createHeading(line.slice(2), 1, template));
      continue;
    }
    if (line.startsWith("## ")) {
      paragraphs.push(createHeading(line.slice(3), 2, template));
      continue;
    }
    if (line.startsWith("### ")) {
      paragraphs.push(createHeading(line.slice(4), 3, template));
      continue;
    }

    // List items
    if (line.match(/^[-*+]\s/)) {
      listItems.push(line.replace(/^[-*+]\s/, ""));
      continue;
    } else if (listItems.length > 0) {
      // Flush accumulated list items
      paragraphs.push(...listItems.map((item) => createListItem(item, template)));
      listItems = [];
    }

    // Numbered list
    if (line.match(/^\d+\.\s/)) {
      paragraphs.push(createNumberedItem(line.replace(/^\d+\.\s/, ""), template));
      continue;
    }

    // Horizontal rule
    if (line.match(/^[-*_]{3,}$/)) {
      paragraphs.push(createHorizontalRule());
      continue;
    }

    // Image references (placeholder for now)
    if (line.match(/!\[.*?\]\(.*?\)/)) {
      paragraphs.push(createImagePlaceholder(line, template));
      continue;
    }

    // Regular paragraph
    if (line.trim()) {
      paragraphs.push(createParagraph(line, template));
    } else if (paragraphs.length > 0) {
      // Empty line - add spacing
      paragraphs.push(new Paragraph({ text: "" }));
    }
  }

  // Flush remaining list items
  if (listItems.length > 0) {
    paragraphs.push(...listItems.map((item) => createListItem(item, template)));
  }

  return paragraphs;
}

/**
 * Create heading paragraph
 */
function createHeading(
  text: string,
  level: 1 | 2 | 3,
  template: DocxTemplateConfig
): Paragraph {
  const headingLevelMap = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
  };

  const sizeMap = {
    1: 16,
    2: 14,
    3: 12,
  };

  return new Paragraph({
    text,
    heading: headingLevelMap[level],
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: sizeMap[level] * 2,
        font: template.headingFont,
      }),
    ],
  });
}

/**
 * Create regular paragraph with formatting
 */
function createParagraph(text: string, template: DocxTemplateConfig): Paragraph {
  // Handle inline formatting: **bold**, *italic*, `code`
  const children: TextRun[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        children.push(
          new TextRun({
            text: remaining.slice(0, boldMatch.index),
            size: template.fontSize * 2,
            font: template.fontFamily,
          })
        );
      }
      children.push(
        new TextRun({
          text: boldMatch[1],
          bold: true,
          size: template.fontSize * 2,
          font: template.fontFamily,
        })
      );
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      continue;
    }

    // Italic
    const italicMatch = remaining.match(/\*(.+?)\*/);
    if (italicMatch && italicMatch.index !== undefined) {
      if (italicMatch.index > 0) {
        children.push(
          new TextRun({
            text: remaining.slice(0, italicMatch.index),
            size: template.fontSize * 2,
            font: template.fontFamily,
          })
        );
      }
      children.push(
        new TextRun({
          text: italicMatch[1],
          italics: true,
          size: template.fontSize * 2,
          font: template.fontFamily,
        })
      );
      remaining = remaining.slice(italicMatch.index + italicMatch[0].length);
      continue;
    }

    // Code
    const codeMatch = remaining.match(/`(.+?)`/);
    if (codeMatch && codeMatch.index !== undefined) {
      if (codeMatch.index > 0) {
        children.push(
          new TextRun({
            text: remaining.slice(0, codeMatch.index),
            size: template.fontSize * 2,
            font: template.fontFamily,
          })
        );
      }
      children.push(
        new TextRun({
          text: codeMatch[1],
          font: "Courier New",
          size: template.fontSize * 2,
        })
      );
      remaining = remaining.slice(codeMatch.index + codeMatch[0].length);
      continue;
    }

    // No more formatting - add rest as plain text
    children.push(
      new TextRun({
        text: remaining,
        size: template.fontSize * 2,
        font: template.fontFamily,
      })
    );
    break;
  }

  return new Paragraph({
    children,
    spacing: { after: 120 },
  });
}

/**
 * Create list item paragraph
 */
function createListItem(text: string, template: DocxTemplateConfig): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `• ${text}`,
        size: template.fontSize * 2,
        font: template.fontFamily,
      }),
    ],
    indent: { left: convertInchesToTwip(0.25) },
    spacing: { after: 60 },
  });
}

/**
 * Create numbered list item
 */
function createNumberedItem(
  text: string,
  template: DocxTemplateConfig
): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: template.fontSize * 2,
        font: template.fontFamily,
      }),
    ],
    numbering: { reference: "default-numbering", level: 0 },
    spacing: { after: 60 },
  });
}

/**
 * Create code block paragraph
 */
function createCodeParagraph(
  code: string,
  template: DocxTemplateConfig
): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: code,
        font: "Courier New",
        size: (template.fontSize - 1) * 2,
      }),
    ],
    shading: { fill: "F5F5F5" },
    spacing: { before: 120, after: 120 },
  });
}

/**
 * Create horizontal rule
 */
function createHorizontalRule(): Paragraph {
  return new Paragraph({
    border: {
      bottom: { color: "CCCCCC", size: 6, style: "single" },
    },
    spacing: { before: 120, after: 120 },
  });
}

/**
 * Create image placeholder (actual images would need more processing)
 */
function createImagePlaceholder(
  line: string,
  template: DocxTemplateConfig
): Paragraph {
  const altMatch = line.match(/!\[(.*?)\]/);
  const altText = altMatch ? altMatch[1] : "Image";

  return new Paragraph({
    children: [
      new TextRun({
        text: `[图片: ${altText}]`,
        italics: true,
        size: template.fontSize * 2,
        font: template.fontFamily,
        color: "666666",
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 120 },
  });
}
