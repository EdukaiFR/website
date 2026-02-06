import Tesseract from "tesseract.js";

const loadPdfJs = async () => {
    if (typeof window === "undefined") {
        throw new Error("PDF processing is only available on the client side");
    }

    const pdfjsLib = await import("pdfjs-dist");
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        try {
            const workerUrls = [
                "/pdf.worker.min.mjs",
                `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`,
                `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`,
            ];
            pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrls[0];
        } catch (error) {
            console.warn("Could not set PDF.js worker URL:", error);
        }
    }
    return pdfjsLib;
};

export interface ProcessingResult {
    text: string;
    images?: string[];
    type: "text" | "image" | "pdf";
    stats?: {
        originalLength: number;
        truncatedLength: number;
        pagesProcessed: number;
        tokensEstimate: number;
    };
}

export interface ProcessingProgress {
    stage: "reading" | "extracting" | "ocr" | "complete";
    progress: number;
    message: string;
}

const CONFIG = {
    MAX_CHARS_PER_PAGE: 3000,
    MAX_TOTAL_CHARS: 50000,
    MAX_PDF_PAGES: 100,
    CHARS_PER_TOKEN: 4,
};

export class FileProcessor {
    private static estimateTokens(text: string): number {
        return Math.ceil(text.length / CONFIG.CHARS_PER_TOKEN);
    }

    private static truncateText(text: string, maxChars: number): string {
        if (text.length <= maxChars) return text;

        const truncated = text.substring(0, maxChars);
        const lastPeriod = truncated.lastIndexOf(".");
        const lastExclamation = truncated.lastIndexOf("!");
        const lastQuestion = truncated.lastIndexOf("?");

        const lastSentenceEnd = Math.max(
            lastPeriod,
            lastExclamation,
            lastQuestion
        );

        if (lastSentenceEnd > maxChars * 0.8) {
            return truncated.substring(0, lastSentenceEnd + 1);
        }

        const lastSpace = truncated.lastIndexOf(" ");
        return lastSpace > 0
            ? truncated.substring(0, lastSpace) + "..."
            : truncated + "...";
    }

    private static cleanText(text: string): string {
        return text
            .replace(/\s+/g, " ")
            .replace(/\n\s*\n\s*\n/g, "\n\n")
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean)
            .join("\n")
            .trim();
    }

    static getFileType(file: File): "text" | "image" | "pdf" {
        const extension = file.name.split(".").pop()?.toLowerCase();

        if (extension === "pdf") return "pdf";
        if (
            ["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(
                extension || ""
            )
        )
            return "image";
        if (["txt", "md", "csv"].includes(extension || "")) return "text";

        if (file.type.startsWith("image/")) return "image";
        if (file.type === "application/pdf") return "pdf";
        if (file.type.startsWith("text/")) return "text";

        return "image";
    }

    static async processFile(
        file: File,
        onProgress?: (progress: ProcessingProgress) => void
    ): Promise<ProcessingResult> {
        const fileType = this.getFileType(file);

        onProgress?.({
            stage: "reading",
            progress: 0,
            message: `Lecture du fichier ${file.name}...`,
        });

        switch (fileType) {
            case "text":
                return this.processTextFile(file, onProgress);
            case "image":
                return this.processImageFile(file, onProgress);
            case "pdf":
                return this.processPdfFile(file, onProgress);
            default:
                throw new Error(`Type de fichier non supporté: ${fileType}`);
        }
    }

    private static async processTextFile(
        file: File,
        onProgress?: (progress: ProcessingProgress) => void
    ): Promise<ProcessingResult> {
        onProgress?.({
            stage: "extracting",
            progress: 50,
            message: "Extraction du texte...",
        });

        const rawText = await file.text();
        const originalLength = rawText.length;

        const cleanedText = this.cleanText(rawText);
        const finalText = this.truncateText(
            cleanedText,
            CONFIG.MAX_TOTAL_CHARS
        );

        onProgress?.({
            stage: "complete",
            progress: 100,
            message: "Texte extrait avec succès!",
        });

        return {
            text: finalText,
            type: "text",
            stats: {
                originalLength,
                truncatedLength: finalText.length,
                pagesProcessed: 1,
                tokensEstimate: this.estimateTokens(finalText),
            },
        };
    }

    private static async processImageFile(
        file: File,
        onProgress?: (progress: ProcessingProgress) => void
    ): Promise<ProcessingResult> {
        onProgress?.({
            stage: "ocr",
            progress: 0,
            message: "Reconnaissance optique de caractères...",
        });

        const result = await Tesseract.recognize(file, "fra", {
            logger: m => {
                if (m.status === "recognizing text") {
                    const progressPercent = Math.round(m.progress * 100);
                    onProgress?.({
                        stage: "ocr",
                        progress: progressPercent,
                        message: "OCR en cours...",
                    });
                }
            },
        });

        const rawText = result.data.text;
        const originalLength = rawText.length;

        const cleanedText = this.cleanText(rawText);
        const finalText = this.truncateText(
            cleanedText,
            CONFIG.MAX_TOTAL_CHARS
        );

        onProgress?.({
            stage: "complete",
            progress: 100,
            message: "OCR terminé avec succès!",
        });

        return {
            text: finalText,
            type: "image",
            stats: {
                originalLength,
                truncatedLength: finalText.length,
                pagesProcessed: 1,
                tokensEstimate: this.estimateTokens(finalText),
            },
        };
    }

    private static async processPdfFile(
        file: File,
        onProgress?: (progress: ProcessingProgress) => void
    ): Promise<ProcessingResult> {
        const arrayBuffer = await file.arrayBuffer();

        onProgress?.({
            stage: "extracting",
            progress: 10,
            message: "Chargement du PDF...",
        });

        const pdfjsLib = await loadPdfJs();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = Math.min(pdf.numPages, CONFIG.MAX_PDF_PAGES);

        let extractedText = "";
        let totalCharsExtracted = 0;
        const extractedImages: string[] = [];

        onProgress?.({
            stage: "extracting",
            progress: 20,
            message: `Extraction du contenu de ${numPages} page(s)...`,
        });

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            if (totalCharsExtracted >= CONFIG.MAX_TOTAL_CHARS) {
                console.log(
                    `[FileProcessor] Limite atteinte à la page ${pageNum}/${numPages}`
                );
                extractedText += `\n\n... (Limite de ${CONFIG.MAX_TOTAL_CHARS} caractères atteinte. ${numPages - pageNum + 1} page(s) restante(s) non traitée(s))`;
                break;
            }

            const page = await pdf.getPage(pageNum);

            const textContent = await page.getTextContent();
            let pageText = textContent.items
                .map((item: unknown) =>
                    typeof item === "object" && item !== null && "str" in item
                        ? (item as { str: string }).str
                        : ""
                )
                .filter(Boolean)
                .join(" ");

            pageText = this.cleanText(pageText);

            const charsRemaining = CONFIG.MAX_TOTAL_CHARS - totalCharsExtracted;
            const maxCharsForThisPage = Math.min(
                CONFIG.MAX_CHARS_PER_PAGE,
                charsRemaining
            );

            if (pageText.trim()) {
                const truncatedPageText = this.truncateText(
                    pageText,
                    maxCharsForThisPage
                );
                extractedText += `\n--- Page ${pageNum} ---\n${truncatedPageText}\n`;
                totalCharsExtracted += truncatedPageText.length;
            } else if (totalCharsExtracted < CONFIG.MAX_TOTAL_CHARS * 0.8) {
                try {
                    const viewport = page.getViewport({ scale: 1.5 });
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");

                    if (context) {
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        await page.render({
                            canvas: canvas,
                            viewport: viewport,
                        }).promise;

                        const imageDataUrl = canvas.toDataURL("image/png");
                        extractedImages.push(imageDataUrl);

                        onProgress?.({
                            stage: "ocr",
                            progress: 20 + (pageNum / numPages) * 60,
                            message: `OCR page ${pageNum}/${numPages}...`,
                        });

                        const blob = await fetch(imageDataUrl).then(r =>
                            r.blob()
                        );
                        const ocrResult = await Tesseract.recognize(
                            blob,
                            "fra"
                        );

                        let ocrText = this.cleanText(ocrResult.data.text);

                        if (ocrText.trim()) {
                            const charsRemainingForOcr =
                                CONFIG.MAX_TOTAL_CHARS - totalCharsExtracted;
                            ocrText = this.truncateText(
                                ocrText,
                                Math.min(
                                    CONFIG.MAX_CHARS_PER_PAGE,
                                    charsRemainingForOcr
                                )
                            );
                            extractedText += `\n--- Page ${pageNum} (OCR) ---\n${ocrText}\n`;
                            totalCharsExtracted += ocrText.length;
                        }
                    }
                } catch (error) {
                    console.warn(`OCR failed for page ${pageNum}:`, error);
                }
            }

            onProgress?.({
                stage: "extracting",
                progress: 20 + (pageNum / numPages) * 80,
                message: `Page ${pageNum}/${numPages} traitée`,
            });
        }

        const finalText =
            extractedText.trim() || "Aucun texte trouvé dans le PDF";

        onProgress?.({
            stage: "complete",
            progress: 100,
            message: "PDF traité avec succès!",
        });

        return {
            text: finalText,
            images: extractedImages,
            type: "pdf",
            stats: {
                originalLength: totalCharsExtracted,
                truncatedLength: finalText.length,
                pagesProcessed: numPages,
                tokensEstimate: this.estimateTokens(finalText),
            },
        };
    }
}
