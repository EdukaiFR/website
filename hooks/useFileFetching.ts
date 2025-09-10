import { ProcessedFile } from "@/lib/types/file";
import { useEffect, useState } from "react";
import { useFileDecompression } from "./useFileDecompression";
import { base64ToBlob } from "@/lib/file-utils";

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

        const decodeAndUnzip = async (input: string | ArrayBuffer) => {
            let arrayBuffer: ArrayBuffer;

            if (typeof input === "string") {
                // Base64 path
                const blob = base64ToBlob(input);
                arrayBuffer = await blob.arrayBuffer();
            } else {
                // Raw binary path
                arrayBuffer = input;
            }

            return unzipFile(arrayBuffer, "course-files.zip");
        };

        try {
            const response = await fetch(
                `/api/courses/${courseId}/files?format=base64`
            );

            let extractedFiles;

            if (response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType?.includes("application/zip")) {
                    const buffer = await response.arrayBuffer();
                    extractedFiles = await decodeAndUnzip(buffer);
                } else {
                    const base64Data = await response.text();
                    extractedFiles = await decodeAndUnzip(base64Data);
                }
            } else {
                const originalResponse = (await getCourseFiles(
                    courseId
                )) as string;
                extractedFiles = await decodeAndUnzip(originalResponse);
            }

            setFiles(extractedFiles);
        } catch (error) {
            setError("Error fetching files.");
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
