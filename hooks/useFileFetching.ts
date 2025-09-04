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

        const decodeAndUnzip = async (base64String: string) => {
            const blob = base64ToBlob(base64String);
            const arrayBuffer = await blob.arrayBuffer();
            return unzipFile(arrayBuffer, "course-files.zip");
        };

        try {
            console.log("🔄 Fetching files for course:", courseId);

            const response = await fetch(
                `/api/courses/${courseId}/files?format=base64`
            );

            if (!response.ok) {
                console.log(
                    "🔄 Base64 endpoint not available, trying original method..."
                );
                const originalResponse = (await getCourseFiles(
                    courseId
                )) as string;
                const extractedFiles = await decodeAndUnzip(originalResponse);
                setFiles(extractedFiles);
                return;
            }

            const base64Data = await response.text();
            const extractedFiles = await decodeAndUnzip(base64Data);
            setFiles(extractedFiles);
        } catch (error) {
            console.error("Error fetching files:", error);
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
