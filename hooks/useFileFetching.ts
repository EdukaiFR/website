import { ProcessedFile } from "@/lib/types/file";
import { useEffect, useState } from "react";
import { useFileDecompression } from "./useFileDecompression";

interface UseFileFetchingProps {
    courseId: string;
    getCourseFiles: (courseId: string) => Promise<unknown>;
}

export const useFileFetching = ({
    courseId,
    getCourseFiles,
}: UseFileFetchingProps) => {
    const [files, setFiles] = useState<ProcessedFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { unzipFile } = useFileDecompression();

    const fetchFiles = async () => {
        if (!courseId) return;

        setLoading(true);
        setError(null);
        setFiles([]);

        try {
            console.log("🔄 Fetching files for course:", courseId);

            const response = await fetch(
                `/api/courses/${courseId}/files?format=base64`
            );

            if (!response.ok) {
                console.log(
                    "🔄 Base64 endpoint not available, trying original method..."
                );
                const originalResponse = await getCourseFiles(courseId);

                if (typeof originalResponse === "string") {
                    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
                    if (base64Regex.test(originalResponse.slice(0, 100))) {
                        const blob = await fetch(
                            `data:application/zip;base64,${originalResponse}`
                        ).then(r => r.blob());
                        const arrayBuffer = await blob.arrayBuffer();
                        const extractedFiles = await unzipFile(
                            arrayBuffer,
                            "course-files.zip"
                        );
                        setFiles(extractedFiles);
                    } else {
                        const bytes = new Uint8Array(originalResponse.length);
                        for (let i = 0; i < originalResponse.length; i++) {
                            bytes[i] = originalResponse.charCodeAt(i) & 0xff;
                        }
                        const extractedFiles = await unzipFile(
                            bytes.buffer,
                            "course-files.zip"
                        );
                        setFiles(extractedFiles);
                    }
                } else if (originalResponse instanceof ArrayBuffer) {
                    const extractedFiles = await unzipFile(
                        originalResponse,
                        "course-files.zip"
                    );
                    setFiles(extractedFiles);
                }
                return;
            }

            const base64Data = await response.text();
            const blob = await fetch(
                `data:application/zip;base64,${base64Data}`
            ).then(r => r.blob());
            const arrayBuffer = await blob.arrayBuffer();
            const extractedFiles = await unzipFile(
                arrayBuffer,
                "course-files.zip"
            );
            setFiles(extractedFiles);
        } catch (error) {
            console.error("❌ Error fetching files:", error);
            setError("Impossible de charger les fichiers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (courseId) {
            fetchFiles();
        }
    }, [courseId, getCourseFiles]);

    return { files, loading, error };
};
