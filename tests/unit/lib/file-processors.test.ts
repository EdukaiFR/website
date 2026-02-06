import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
    FileProcessor,
    type ProcessingProgress,
    type ProcessingResult,
} from "@/lib/file-processors";
import Tesseract from "tesseract.js";

// Store the logger callback for testing
let tesseractLoggerCallback:
    | ((m: { status: string; progress: number }) => void)
    | null = null;

// Mock tesseract.js
vi.mock("tesseract.js", () => ({
    default: {
        recognize: vi.fn().mockImplementation((_file, _lang, options) => {
            // Store the logger callback if provided
            if (options?.logger) {
                tesseractLoggerCallback = options.logger;
            }
            return Promise.resolve({
                data: { text: "Mocked OCR text from image" },
            });
        }),
    },
}));

// Mock pdfjs-dist with comprehensive implementation
const mockGetTextContent = vi.fn();
const mockGetViewport = vi.fn();
const mockRender = vi.fn();
const mockGetPage = vi.fn();
const mockGetDocument = vi.fn();

vi.mock("pdfjs-dist", () => ({
    GlobalWorkerOptions: { workerSrc: "" },
    version: "4.0.0",
    getDocument: (options: { data: ArrayBuffer }) => {
        mockGetDocument(options);
        return {
            promise: Promise.resolve({
                numPages: 2,
                getPage: mockGetPage,
            }),
        };
    },
}));

// Helper to create mock File with custom methods
function createMockFile(content: string, name: string, type: string): File {
    const file = new File([content], name, { type });

    // Override methods directly since vi.spyOn doesn't work on File methods in jsdom
    Object.defineProperty(file, "text", {
        value: () => Promise.resolve(content),
        writable: true,
    });
    Object.defineProperty(file, "arrayBuffer", {
        value: () => Promise.resolve(new ArrayBuffer(8)),
        writable: true,
    });

    return file;
}

describe("FileProcessor", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        tesseractLoggerCallback = null;

        // Default mock implementations
        mockGetTextContent.mockResolvedValue({
            items: [{ str: "PDF text content page" }],
        });
        mockGetViewport.mockReturnValue({ width: 100, height: 100 });
        mockRender.mockReturnValue({ promise: Promise.resolve() });
        mockGetPage.mockResolvedValue({
            getTextContent: mockGetTextContent,
            getViewport: mockGetViewport,
            render: mockRender,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("getFileType", () => {
        it("should identify PDF files by extension", () => {
            const file = new File(["content"], "document.pdf", {
                type: "application/pdf",
            });
            expect(FileProcessor.getFileType(file)).toBe("pdf");
        });

        it("should identify image files by extension - png", () => {
            const file = new File(["content"], "image.png", {
                type: "image/png",
            });
            expect(FileProcessor.getFileType(file)).toBe("image");
        });

        it("should identify image files by extension - jpg", () => {
            const file = new File(["content"], "photo.jpg", {
                type: "image/jpeg",
            });
            expect(FileProcessor.getFileType(file)).toBe("image");
        });

        it("should identify image files by extension - jpeg", () => {
            const file = new File(["content"], "photo.jpeg", {
                type: "image/jpeg",
            });
            expect(FileProcessor.getFileType(file)).toBe("image");
        });

        it("should identify image files by extension - gif", () => {
            const file = new File(["content"], "animation.gif", {
                type: "image/gif",
            });
            expect(FileProcessor.getFileType(file)).toBe("image");
        });

        it("should identify image files by extension - webp", () => {
            const file = new File(["content"], "modern.webp", {
                type: "image/webp",
            });
            expect(FileProcessor.getFileType(file)).toBe("image");
        });

        it("should identify image files by extension - bmp", () => {
            const file = new File(["content"], "bitmap.bmp", {
                type: "image/bmp",
            });
            expect(FileProcessor.getFileType(file)).toBe("image");
        });

        it("should identify text files by extension - txt", () => {
            const file = new File(["content"], "notes.txt", {
                type: "text/plain",
            });
            expect(FileProcessor.getFileType(file)).toBe("text");
        });

        it("should identify text files by extension - md", () => {
            const file = new File(["content"], "readme.md", {
                type: "text/markdown",
            });
            expect(FileProcessor.getFileType(file)).toBe("text");
        });

        it("should identify text files by extension - csv", () => {
            const file = new File(["content"], "data.csv", {
                type: "text/csv",
            });
            expect(FileProcessor.getFileType(file)).toBe("text");
        });

        it("should fallback to MIME type for image files", () => {
            const file = new File(["content"], "unknown", {
                type: "image/tiff",
            });
            expect(FileProcessor.getFileType(file)).toBe("image");
        });

        it("should fallback to MIME type for PDF files", () => {
            const file = new File(["content"], "unknown", {
                type: "application/pdf",
            });
            expect(FileProcessor.getFileType(file)).toBe("pdf");
        });

        it("should fallback to MIME type for text files", () => {
            const file = new File(["content"], "unknown", {
                type: "text/html",
            });
            expect(FileProcessor.getFileType(file)).toBe("text");
        });

        it("should default to image for unknown types", () => {
            const file = new File(["content"], "unknown.xyz", {
                type: "application/octet-stream",
            });
            expect(FileProcessor.getFileType(file)).toBe("image");
        });

        it("should handle files without extension", () => {
            const file = new File(["content"], "noextension", { type: "" });
            expect(FileProcessor.getFileType(file)).toBe("image");
        });

        it("should handle uppercase extensions", () => {
            const file = new File(["content"], "DOCUMENT.PDF", {
                type: "application/pdf",
            });
            expect(FileProcessor.getFileType(file)).toBe("pdf");
        });

        it("should handle mixed case extensions", () => {
            const file = new File(["content"], "Image.JpEg", {
                type: "image/jpeg",
            });
            expect(FileProcessor.getFileType(file)).toBe("image");
        });
    });

    describe("processFile - Text Files", () => {
        it("should process text files successfully", async () => {
            const mockTextContent = "This is test content";
            const file = createMockFile(
                mockTextContent,
                "document.txt",
                "text/plain"
            );

            const result = await FileProcessor.processFile(file);

            expect(result.type).toBe("text");
            expect(result.text).toBe(mockTextContent);
        });

        it("should call onProgress with reading stage first", async () => {
            const onProgress = vi.fn();
            const file = createMockFile("content", "test.txt", "text/plain");

            await FileProcessor.processFile(file, onProgress);

            expect(onProgress).toHaveBeenCalledWith({
                stage: "reading",
                progress: 0,
                message: expect.stringContaining("test.txt"),
            });
        });

        it("should call onProgress with extracting stage", async () => {
            const onProgress = vi.fn();
            const file = createMockFile("content", "test.txt", "text/plain");

            await FileProcessor.processFile(file, onProgress);

            expect(onProgress).toHaveBeenCalledWith({
                stage: "extracting",
                progress: 50,
                message: "Extraction du texte...",
            });
        });

        it("should call onProgress with complete stage at end", async () => {
            const onProgress = vi.fn();
            const file = createMockFile("content", "test.txt", "text/plain");

            await FileProcessor.processFile(file, onProgress);

            const lastCall =
                onProgress.mock.calls[onProgress.mock.calls.length - 1];
            expect(lastCall[0]).toEqual({
                stage: "complete",
                progress: 100,
                message: "Texte extrait avec succès!",
            });
        });

        it("should work without onProgress callback", async () => {
            const file = createMockFile(
                "content without callback",
                "test.txt",
                "text/plain"
            );

            const result = await FileProcessor.processFile(file);

            expect(result.type).toBe("text");
            expect(result.text).toBe("content without callback");
        });

        it("should handle markdown files", async () => {
            const mdContent = "# Heading\n\nSome **bold** text";
            const file = createMockFile(
                mdContent,
                "readme.md",
                "text/markdown"
            );

            const result = await FileProcessor.processFile(file);

            expect(result.type).toBe("text");
            expect(result.text).toBe(mdContent);
        });

        it("should handle CSV files", async () => {
            const csvContent = "name,age\nJohn,30\nJane,25";
            const file = createMockFile(csvContent, "data.csv", "text/csv");

            const result = await FileProcessor.processFile(file);

            expect(result.type).toBe("text");
            expect(result.text).toBe(csvContent);
        });
    });

    describe("processFile - Image Files (OCR)", () => {
        it("should process image files with OCR", async () => {
            const file = createMockFile("", "photo.png", "image/png");

            const result = await FileProcessor.processFile(file);

            expect(result.type).toBe("image");
            expect(result.text).toBe("Mocked OCR text from image");
            expect(Tesseract.recognize).toHaveBeenCalledWith(
                file,
                "fra",
                expect.objectContaining({ logger: expect.any(Function) })
            );
        });

        it("should call onProgress with ocr stage for images", async () => {
            const onProgress = vi.fn();
            const file = createMockFile("", "image.jpg", "image/jpeg");

            await FileProcessor.processFile(file, onProgress);

            expect(onProgress).toHaveBeenCalledWith({
                stage: "ocr",
                progress: 0,
                message: "Reconnaissance optique de caractères...",
            });
        });

        it("should call onProgress with complete stage after OCR", async () => {
            const onProgress = vi.fn();
            const file = createMockFile("", "image.jpg", "image/jpeg");

            await FileProcessor.processFile(file, onProgress);

            expect(onProgress).toHaveBeenCalledWith({
                stage: "complete",
                progress: 100,
                message: "OCR terminé avec succès!",
            });
        });

        it("should handle OCR progress updates via logger", async () => {
            const onProgress = vi.fn();
            const file = createMockFile("", "scan.png", "image/png");

            // Start processing (this will set up the logger)
            const resultPromise = FileProcessor.processFile(file, onProgress);

            // Wait a tick for the mock to be called
            await Promise.resolve();

            // Simulate OCR progress via the logger callback
            if (tesseractLoggerCallback) {
                tesseractLoggerCallback({
                    status: "recognizing text",
                    progress: 0.5,
                });
            }

            await resultPromise;

            // Check that progress was reported during OCR
            const ocrProgressCalls = onProgress.mock.calls.filter(
                (call: [ProcessingProgress]) =>
                    call[0].stage === "ocr" && call[0].progress === 50
            );
            expect(ocrProgressCalls.length).toBeGreaterThanOrEqual(1);
        });

        it("should ignore non-recognizing status in logger", async () => {
            const onProgress = vi.fn();
            const file = createMockFile("", "scan.png", "image/png");

            const resultPromise = FileProcessor.processFile(file, onProgress);

            await Promise.resolve();

            // Simulate non-recognizing status
            if (tesseractLoggerCallback) {
                tesseractLoggerCallback({ status: "loading", progress: 0.3 });
            }

            await resultPromise;

            // Should not have called onProgress with 30% during loading
            const loadingCalls = onProgress.mock.calls.filter(
                (call: [ProcessingProgress]) => call[0].progress === 30
            );
            expect(loadingCalls.length).toBe(0);
        });

        it("should work without onProgress for images", async () => {
            const file = createMockFile("", "image.gif", "image/gif");

            const result = await FileProcessor.processFile(file);

            expect(result.type).toBe("image");
            expect(result.text).toBe("Mocked OCR text from image");
        });
    });

    describe("processFile - PDF Files", () => {
        it("should process PDF files with text extraction", async () => {
            const file = createMockFile("", "document.pdf", "application/pdf");

            const result = await FileProcessor.processFile(file);

            expect(result.type).toBe("pdf");
            expect(result.text).toContain("PDF text content page");
        });

        it("should call onProgress with extracting stages for PDF", async () => {
            const onProgress = vi.fn();
            const file = createMockFile("", "document.pdf", "application/pdf");

            await FileProcessor.processFile(file, onProgress);

            // Should have loading stage
            expect(onProgress).toHaveBeenCalledWith({
                stage: "extracting",
                progress: 10,
                message: "Chargement du PDF...",
            });

            // Should have extraction stage with page count
            expect(onProgress).toHaveBeenCalledWith({
                stage: "extracting",
                progress: 20,
                message: expect.stringContaining("2 page(s)"),
            });
        });

        it("should call onProgress with complete stage after PDF processing", async () => {
            const onProgress = vi.fn();
            const file = createMockFile("", "document.pdf", "application/pdf");

            await FileProcessor.processFile(file, onProgress);

            expect(onProgress).toHaveBeenCalledWith({
                stage: "complete",
                progress: 100,
                message: "PDF traité avec succès!",
            });
        });

        it("should handle PDF pages with text", async () => {
            mockGetTextContent.mockResolvedValue({
                items: [{ str: "Hello" }, { str: " " }, { str: "World" }],
            });

            const file = createMockFile("", "doc.pdf", "application/pdf");
            const result = await FileProcessor.processFile(file);

            expect(result.text).toContain("Hello");
            expect(result.text).toContain("World");
        });

        it("should handle PDF with mixed item types", async () => {
            mockGetTextContent.mockResolvedValue({
                items: [
                    { str: "Text item" },
                    null,
                    { notStr: "Invalid" },
                    { str: "" },
                    { str: "Another text" },
                ],
            });

            const file = createMockFile("", "doc.pdf", "application/pdf");
            const result = await FileProcessor.processFile(file);

            expect(result.text).toContain("Text item");
            expect(result.text).toContain("Another text");
        });

        it("should include page numbers in extracted text", async () => {
            const file = createMockFile("", "doc.pdf", "application/pdf");
            const result = await FileProcessor.processFile(file);

            expect(result.text).toContain("--- Page 1 ---");
            expect(result.text).toContain("--- Page 2 ---");
        });

        it("should report progress for each page", async () => {
            const onProgress = vi.fn();
            const file = createMockFile("", "doc.pdf", "application/pdf");

            await FileProcessor.processFile(file, onProgress);

            // Should have progress updates for each page
            const pageProgressCalls = onProgress.mock.calls.filter(
                (call: [ProcessingProgress]) =>
                    call[0].message.includes("Page") &&
                    call[0].message.includes("traitée")
            );
            expect(pageProgressCalls.length).toBe(2); // 2 pages
        });

        it("should return default message when no text found", async () => {
            mockGetTextContent.mockResolvedValue({ items: [] });

            // Also need to mock canvas for OCR path, but we'll skip OCR by making it fail
            const originalCreateElement = document.createElement.bind(document);
            vi.spyOn(document, "createElement").mockImplementation(
                (tag: string) => {
                    if (tag === "canvas") {
                        const canvas = originalCreateElement(
                            "canvas"
                        ) as HTMLCanvasElement;
                        vi.spyOn(canvas, "getContext").mockReturnValue(null);
                        return canvas;
                    }
                    return originalCreateElement(tag);
                }
            );

            const file = createMockFile("", "empty.pdf", "application/pdf");
            const result = await FileProcessor.processFile(file);

            expect(result.text).toBe("Aucun texte trouvé dans le PDF");

            vi.restoreAllMocks();
        });

        it("should work without onProgress for PDF", async () => {
            const file = createMockFile("", "doc.pdf", "application/pdf");

            const result = await FileProcessor.processFile(file);

            expect(result.type).toBe("pdf");
        });
    });

    describe("ProcessingResult interface", () => {
        it("should return correct structure for text files", async () => {
            const file = createMockFile(
                "Test content",
                "test.txt",
                "text/plain"
            );
            const result: ProcessingResult =
                await FileProcessor.processFile(file);

            expect(result).toHaveProperty("text");
            expect(result).toHaveProperty("type");
            expect(result.type).toBe("text");
            expect(typeof result.text).toBe("string");
        });

        it("should return correct structure for image files", async () => {
            const file = createMockFile("", "image.png", "image/png");
            const result: ProcessingResult =
                await FileProcessor.processFile(file);

            expect(result).toHaveProperty("text");
            expect(result).toHaveProperty("type");
            expect(result.type).toBe("image");
        });

        it("should return correct structure for PDF files", async () => {
            const file = createMockFile("", "doc.pdf", "application/pdf");
            const result: ProcessingResult =
                await FileProcessor.processFile(file);

            expect(result).toHaveProperty("text");
            expect(result).toHaveProperty("type");
            expect(result.type).toBe("pdf");
        });
    });

    describe("ProcessingProgress interface", () => {
        it("should have valid stage values", () => {
            const validStages: ProcessingProgress["stage"][] = [
                "reading",
                "extracting",
                "ocr",
                "complete",
            ];

            validStages.forEach(stage => {
                const progress: ProcessingProgress = {
                    stage,
                    progress: 50,
                    message: "Test message",
                };
                expect(progress.stage).toBe(stage);
            });
        });

        it("should have progress as number", () => {
            const progress: ProcessingProgress = {
                stage: "reading",
                progress: 75,
                message: "Test",
            };
            expect(typeof progress.progress).toBe("number");
        });

        it("should have message as string", () => {
            const progress: ProcessingProgress = {
                stage: "complete",
                progress: 100,
                message: "Done!",
            };
            expect(typeof progress.message).toBe("string");
        });
    });
});
