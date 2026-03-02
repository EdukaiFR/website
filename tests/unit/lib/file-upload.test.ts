import { describe, expect, it, vi } from "vitest";
import {
  validateFile,
  convertFileToBase64,
  convertFilesToAttachments,
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

    it("should compress image above threshold using canvas", async () => {
      const file = createMockFile("large.jpg", 2 * 1024 * 1024, "image/jpeg");

      const mockBitmap = { width: 3840, height: 2160, close: vi.fn() };
      const mockCreateImageBitmap = vi.fn().mockResolvedValue(mockBitmap);
      vi.stubGlobal("createImageBitmap", mockCreateImageBitmap);

      const mockCtx = { drawImage: vi.fn() };
      const mockBlob = new Blob(["compressed"], { type: "image/jpeg" });
      const mockCanvas = {
        getContext: vi.fn().mockReturnValue(mockCtx),
        convertToBlob: vi.fn().mockResolvedValue(mockBlob),
      };
      vi.stubGlobal(
        "OffscreenCanvas",
        function OffscreenCanvas() {
          return mockCanvas;
        }
      );

      const result = await compressImage(file);

      expect(result).not.toBe(file);
      expect(result.type).toBe("image/jpeg");
      expect(mockCreateImageBitmap).toHaveBeenCalledWith(file);
      expect(mockBitmap.close).toHaveBeenCalled();
      expect(mockCanvas.getContext).toHaveBeenCalledWith("2d");

      vi.unstubAllGlobals();
    });

    it("should return original file if canvas context is null", async () => {
      const file = createMockFile("large.jpg", 2 * 1024 * 1024, "image/jpeg");

      vi.stubGlobal(
        "createImageBitmap",
        vi.fn().mockResolvedValue({ width: 1000, height: 500, close: vi.fn() })
      );
      vi.stubGlobal(
        "OffscreenCanvas",
        function OffscreenCanvas() {
          return { getContext: vi.fn().mockReturnValue(null) };
        }
      );

      const result = await compressImage(file);
      expect(result).toBe(file);

      vi.unstubAllGlobals();
    });

    it("should return original file if compression throws", async () => {
      const file = createMockFile("large.jpg", 2 * 1024 * 1024, "image/jpeg");
      vi.stubGlobal(
        "createImageBitmap",
        vi.fn().mockRejectedValue(new Error("bitmap failed"))
      );

      const result = await compressImage(file);
      expect(result).toBe(file);

      vi.unstubAllGlobals();
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

  describe("convertFilesToAttachments", () => {
    it("should process multiple files into attachments", async () => {
      const textFile = new File(["hello world content"], "doc.txt", {
        type: "text/plain",
      });
      const imgFile = new File(["image data"], "photo.png", {
        type: "image/png",
      });

      const result = await convertFilesToAttachments(
        [textFile, imgFile],
        "user123"
      );

      expect(result).toHaveLength(2);
      expect(result[0].fileName).toBe("doc.txt");
      expect(result[0].fileType).toBe("text/plain");
      expect(result[0].uploadedBy).toBe("user123");
      expect(result[0].data).toMatch(/^data:text\/plain;base64,/);
      expect(result[1].fileName).toBe("photo.png");
      expect(result[1].fileType).toBe("image/png");
    });

    it("should throw on invalid file in batch", async () => {
      const invalidFile = createMockFile(
        "bad.exe",
        1024,
        "application/x-msdownload"
      );

      await expect(
        convertFilesToAttachments([invalidFile], "user123")
      ).rejects.toThrow("application/x-msdownload");
    });

    it("should return empty array for empty input", async () => {
      const result = await convertFilesToAttachments([], "user123");
      expect(result).toHaveLength(0);
    });

    it("should set correct uploadedAt timestamp", async () => {
      const file = new File(["content"], "test.txt", { type: "text/plain" });

      const result = await convertFilesToAttachments([file], "user123");

      expect(result[0].uploadedAt).toBeDefined();
      // Verify it parses as a valid ISO date
      expect(new Date(result[0].uploadedAt).toISOString()).toBe(
        result[0].uploadedAt
      );
    });
  });
});
