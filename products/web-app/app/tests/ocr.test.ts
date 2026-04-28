/**
 * P6.3: OCR Result Normalization Tests
 * P10.1: Vitest OCR 归一化
 */

import { describe, it, expect } from "vitest";
import {
  normalizeOcrResult,
  OcrResultEnvelopeSchema,
  type OcrResultEnvelope,
} from "../src/lib/ocr";

describe("OCR Module", () => {
  describe("normalizeOcrResult", () => {
    it("should normalize PaddleOCR-VL-1.5 API response", () => {
      const rawResult = {
        markdown: {
          text: "# Test Document\n\nThis is a test.",
          images: [
            { key: "img1.png", url: "https://example.com/img1.png" },
          ],
        },
        structured: {
          title: "Test Document",
          pages: 1,
        },
        metadata: {
          page_count: 1,
          processing_time_ms: 1500,
          confidence: 0.95,
        },
      };

      const result = normalizeOcrResult(rawResult);

      expect(result.markdownText).toBe("# Test Document\n\nThis is a test.");
      expect(result.structuredJson).toEqual({
        title: "Test Document",
        pages: 1,
      });
      expect(result.assets).toHaveLength(1);
      expect(result.assets[0].type).toBe("image");
      expect(result.assets[0].key).toBe("img1.png");
      expect(result.metadata.pageCount).toBe(1);
      expect(result.metadata.processingTimeMs).toBe(1500);
      expect(result.metadata.confidence).toBe(0.95);
    });

    it("should handle empty results", () => {
      const rawResult = {};

      const result = normalizeOcrResult(rawResult);

      expect(result.markdownText).toBe("");
      expect(result.assets).toHaveLength(0);
    });

    it("should validate result against schema", () => {
      const validResult: OcrResultEnvelope = {
        markdownText: "Test",
        assets: [],
        metadata: {},
      };

      const parsed = OcrResultEnvelopeSchema.safeParse(validResult);
      expect(parsed.success).toBe(true);
    });
  });
});
