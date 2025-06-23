import type { BlobService } from "@/services";
import { useState } from "react";

export function useBlob(blobService: BlobService) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileId, setFileId] = useState("");

    async function uploadFile(file: File, fileType: string) {
        setIsUploading(true);
        setError(null);

        try {
            const newFile = await blobService.uploadFile(file, fileType);
            const newFileId = newFile.items._id;
            setFileId(newFile.items._id);
            return { success: true, newFileId };
        } catch (error) {
            console.error("Error uploading file: ", error);
            setError("Failed to upload file. Please try again.");
        } finally {
            setIsUploading(false);
        }
    }

    return {
        uploadFile,
    };
}
