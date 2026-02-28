import { describe, expect, it, vi } from "vitest";
import {
  validateFile,
  convertFileToBase64,
  getAttachmentKind,
  compressImage,
} from "@/lib/utils/file-upload";

function createMockFile(
  name: string,
  size: number,
  type: string
): File {
  const buffer = new ArrayBuffer(size);
  return new File([buffer], name, { type });
}

describe("file-upload utilities", () => {
  describe("validateFile", () => {
    it("should accept a valid image file", () => {
      const file = createMockFile("photo.png", 1024, "image/png");
      const result = validateFile(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should accept a valid PDF file", () => {
      const file = createMockFile("doc.pdf", 2048, "application/pdf");
      const result = validateFile(file);

      expect(result.valid).toBe(true);
    });

    it("should reject a file exceeding MAX_FILE_SIZE", () => {
      const file = createMockFile("large.png", 6 * 1024 * 1024, "image/png");
      const result = validateFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain("large.png");
      expect(result.error).toContain("taille maximale");
    });

    it("should reject an unsupported MIME type", () => {
      const file = createMockFile("script.exe", 1024, "application/x-msdownload");
      const result = validateFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain("application/x-msdownload");
    });

    it("should reject a file with empty MIME type", () => {
      const file = createMockFile("unknown", 1024, "");
      const result = validateFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain("inconnu");
    });

    it("should accept all allowed MIME types", () => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      for (const type of allowedTypes) {
        const file = createMockFile("test", 1024, type);
        expect(validateFile(file).valid).toBe(true);
      }
    });
  });

  describe("getAttachmentKind", () => {
    it("should return 'image' for image MIME types", () => {
      expect(getAttachmentKind("image/png")).toBe("image");
      expect(getAttachmentKind("image/jpeg")).toBe("image");
      expect(getAttachmentKind("image/gif")).toBe("image");
      expect(getAttachmentKind("image/webp")).toBe("image");
    });

    it("should return 'text' for text/plain", () => {
      expect(getAttachmentKind("text/plain")).toBe("text");
    });

    it("should return 'document' for other types", () => {
      expect(getAttachmentKind("application/pdf")).toBe("document");
      expect(getAttachmentKind("application/msword")).toBe("document");
    });
  });

  describe("compressImage", () => {
    it("should return original file if below compression threshold", async () => {
      const file = createMockFile("small.png", 500 * 1024, "image/png");
      const result = await compressImage(file);

      expect(result).toBe(file);
    });
  });

  describe("convertFileToBase64", () => {
    it("should convert a file to base64 data URL", async () => {
      const content = "hello world";
      const file = new File([content], "test.txt", { type: "text/plain" });

      const result = await convertFileToBase64(file);

      expect(result).toMatch(/^data:text\/plain;base64,/);
    });

    it("should reject when FileReader errors", async () => {
      const originalFileReader = global.FileReader;

      const mockFileReader = {
        readAsDataURL: vi.fn(),
        onerror: null as (() => void) | null,
        error: new DOMException("Read failed"),
      };

      global.FileReader = vi.fn(() => mockFileReader) as unknown as typeof FileReader;

      const file = new File(["test"], "test.txt", { type: "text/plain" });
      const promise = convertFileToBase64(file);

      // Trigger the error callback
      if (mockFileReader.onerror) {
        mockFileReader.onerror();
      }

      await expect(promise).rejects.toThrow();

      global.FileReader = originalFileReader;
    });
  });
});
