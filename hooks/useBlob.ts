import type { BlobService } from "@/services";
import { useState } from "react";

export function useBlob(blobService: BlobService) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileId, setFileId] = useState("");

    console.log(fileId);
    console.log(isUploading);
    console.log(error);

    async function uploadFile(file: File, fileType: string) {
        setIsUploading(true);
        setError(null);

        try {
            const newFile = (await blobService.uploadFile(file, fileType)) as {
                items: { _id: string };
            };
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
