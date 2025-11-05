import Tesseract from "tesseract.js";

// Dynamic import for PDF.js to avoid SSR issues
const loadPdfJs = async () => {
    if (typeof window === "undefined") {
        throw new Error("PDF processing is only available on the client side");
    }

    const pdfjsLib = await import("pdfjs-dist");
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        try {
            // Use local worker first, then fallback to CDNs
            const workerUrls = [
                "/pdf.worker.min.mjs", // Local worker
                `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`,
                `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`,
            ];

            // Use the first URL as default
            pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrls[0];
        } catch (error) {
            console.warn("Could not set PDF.js worker URL:", error);
        }
    }
    return pdfjsLib;
};

export interface ProcessingResult {
    text: string;
    images?: string[]; // Base64 images extracted from PDF
    type: "text" | "image" | "pdf";
}

export interface ProcessingProgress {
    stage: "reading" | "extracting" | "ocr" | "complete";
    progress: number;
    message: string;
}

export class FileProcessor {
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

        // Fallback to MIME type
        if (file.type.startsWith("image/")) return "image";
        if (file.type === "application/pdf") return "pdf";
        if (file.type.startsWith("text/")) return "text";

        // Default to image (for OCR)
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

        const text = await file.text();

        onProgress?.({
            stage: "complete",
            progress: 100,
            message: "Texte extrait avec succès!",
        });

        return {
            text,
            type: "text",
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

        onProgress?.({
            stage: "complete",
            progress: 100,
            message: "OCR terminé avec succès!",
        });

        return {
            text: result.data.text,
            type: "image",
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
        const numPages = pdf.numPages;

        let extractedText = "";
        const extractedImages: string[] = [];

        onProgress?.({
            stage: "extracting",
            progress: 20,
            message: `Extraction du contenu de ${numPages} page(s)...`,
        });

        // Extract text and images from each page
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);

            // Extract text
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: unknown) =>
                    typeof item === "object" && item !== null && "str" in item
                        ? (item as { str: string }).str
                        : ""
                )
                .filter(Boolean)
                .join(" ");

            if (pageText.trim()) {
                extractedText += `\n--- Page ${pageNum} ---\n${pageText}\n`;
            }

            // Convert page to image for OCR if no text was found
            if (!pageText.trim()) {
                try {
                    const viewport = page.getViewport({ scale: 2.0 });
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");

                    if (context) {
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        await page.render({
                            canvas: canvas,
                            viewport: viewport,
                        }).promise;

                        // Convert canvas to blob for OCR
                        const imageDataUrl = canvas.toDataURL("image/png");
                        extractedImages.push(imageDataUrl);

                        onProgress?.({
                            stage: "ocr",
                            progress: 20 + (pageNum / numPages) * 60,
                            message: `OCR page ${pageNum}/${numPages}...`,
                        });

                        // Perform OCR on the image
                        const blob = await fetch(imageDataUrl).then(r =>
                            r.blob()
                        );
                        const ocrResult = await Tesseract.recognize(
                            blob,
                            "fra"
                        );

                        if (ocrResult.data.text.trim()) {
                            extractedText += `\n--- Page ${pageNum} (OCR) ---\n${ocrResult.data.text}\n`;
                        }
                    }
                } catch {
                    // OCR failed for this page, continue with next page
                }
            }

            onProgress?.({
                stage: "extracting",
                progress: 20 + (pageNum / numPages) * 80,
                message: `Page ${pageNum}/${numPages} traitée`,
            });
        }

        onProgress?.({
            stage: "complete",
            progress: 100,
            message: "PDF traité avec succès!",
        });

        return {
            text: extractedText.trim() || "Aucun texte trouvé dans le PDF",
            images: extractedImages,
            type: "pdf",
        };
    }
}
