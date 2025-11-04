import { getContentTypeFromFilename } from "@/lib/file-utils";
import { ProcessedFile, UnzippedFile } from "@/lib/types/file";
import JSZip from "jszip";
import { useCallback } from "react";

export const useFileDecompression = () => {
    const unzipFile = useCallback(
        async (
            data: string | ArrayBuffer,
            filename: string
        ): Promise<ProcessedFile[]> => {
            try {
                const zip = await JSZip.loadAsync(
                    data,
                    typeof data === "string" ? { base64: true } : undefined
                );
                const unzippedFiles: UnzippedFile[] = [];

                for (const [relativePath, zipEntry] of Object.entries(
                    zip.files
                )) {
                    if (!zipEntry.dir) {
                        try {
                            const fileName =
                                zipEntry.name.split("/").pop() || zipEntry.name;
                            const contentType =
                                getContentTypeFromFilename(fileName);

                            const content =
                                contentType.startsWith("image/") ||
                                contentType.includes("pdf") ||
                                contentType.includes("zip") ||
                                contentType.includes("binary")
                                    ? await zipEntry.async("base64")
                                    : await zipEntry.async("string");

                            unzippedFiles.push({
                                name: fileName,
                                content:
                                    contentType.startsWith("image/") ||
                                    contentType.includes("pdf") ||
                                    contentType.includes("zip") ||
                                    contentType.includes("binary")
                                        ? content
                                        : btoa(content),
                                contentType,
                                size: content.length,
                            });
                        } catch (error) {
                            // Skip files that cannot be extracted
                        }
                    }
                }

                if (unzippedFiles.length > 0) {
                    return [
                        {
                            _id: `zip-${Date.now()}`,
                            name: filename,
                            contentType: "application/zip",
                            fileContent: "",
                            fileType: "zip",
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            isZip: true,
                            unzippedFiles,
                            decompressionSuccessful: true,
                        },
                    ];
                }

                return [];
            } catch (error) {
                throw error;
            }
        },
        []
    );

    return { unzipFile };
};
