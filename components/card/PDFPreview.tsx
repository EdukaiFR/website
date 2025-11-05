"use client";

import { useState, useEffect } from "react";
import { FileIcon, Loader2 } from "lucide-react";

interface PDFPreviewProps {
    fileId: string;
    fileName: string;
    contentType: string;
}

export const PDFPreview = ({ fileId, fileName, contentType }: PDFPreviewProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const generatePDFPreview = async () => {
            try {
                setLoading(true);
                setError(false);

                // Dynamically import pdfjs-dist only on client side
                const pdfjsLib = await import("pdfjs-dist");

                // Configure PDF.js worker
                pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

                // Fetch the PDF file
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/blob/files/${fileId}`, {
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch PDF");
                }

                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();

                // Load PDF with PDF.js
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                const page = await pdf.getPage(1); // Get first page

                // Set scale for better quality
                const scale = 1.5;
                const viewport = page.getViewport({ scale });

                // Create canvas
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                if (!context) {
                    throw new Error("Could not get canvas context");
                }

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render PDF page to canvas
                await page.render({
                    canvasContext: context,
                    viewport: viewport,
                    canvas: canvas,
                }).promise;

                // Convert canvas to image URL
                const imageUrl = canvas.toDataURL("image/png");
                setPreviewUrl(imageUrl);
                setLoading(false);
            } catch (err) {
                console.error("[PDFPreview] Error generating preview:", err);
                setError(true);
                setLoading(false);
            }
        };

        // Only generate preview for PDFs and only on client side
        if (typeof window !== "undefined" && contentType === "application/pdf") {
            generatePDFPreview();
        } else if (contentType !== "application/pdf") {
            setLoading(false);
        }
    }, [fileId, contentType]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-sm text-gray-500">Génération de l&apos;aperçu...</p>
            </div>
        );
    }

    if (error || !previewUrl) {
        // Fallback to file icon
        const extension = fileName.split(".").pop()?.toUpperCase() || "FILE";
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                    <FileIcon className="w-12 h-12 text-blue-600" />
                </div>
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-800 mb-1">
                        {extension}
                    </p>
                    <p className="text-xs text-gray-500">{contentType}</p>
                </div>
            </div>
        );
    }

    // Show PDF preview image
    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
                src={previewUrl}
                alt={`Preview of ${fileName}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
            />
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                PDF
            </div>
        </div>
    );
};
