import axios from "axios";

export interface BlobService {
    uploadFile: (file: File, fileType: string) => Promise<unknown>;
    getFileById: (fileId: string) => Promise<unknown>;
    deleteFile: (fileId: string) => Promise<unknown>;
}

export function useBlobService() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const uploadFile = async (file: File, fileType: string) => {
        console.log(`[BlobService] uploadFile called`);
        console.log(`[BlobService] API URL: ${apiUrl}`);
        console.log(`[BlobService] File name: ${file.name}`);
        console.log(`[BlobService] File type param: ${fileType}`);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileType", fileType);

            console.log(`[BlobService] Making POST request to: ${apiUrl}/blob/files`);
            const response = await axios.post(
                `${apiUrl}/blob/files`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log(`[BlobService] ✅ Upload successful. Response:`, response.data);
            return response.data;
        } catch (error) {
            console.error("[BlobService] ❌ Error uploading file:", error);
            if (axios.isAxiosError(error)) {
                console.error("[BlobService] Axios error details:", {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                });
            }
            throw error;
        }
    };

    const getFileById = async (fileId: string) => {
        try {
            const response = await axios.get(`${apiUrl}/blob/files/${fileId}`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error(`An error ocurred fetching the file`, error);
        }
    };

    const deleteFile = async (fileId: string) => {
        console.log(`[BlobService] deleteFile called`);
        console.log(`[BlobService] File ID: ${fileId}`);

        try {
            console.log(`[BlobService] Making DELETE request to: ${apiUrl}/blob/files/${fileId}`);
            const response = await axios.delete(
                `${apiUrl}/blob/files/${fileId}`,
                { withCredentials: true }
            );

            console.log(`[BlobService] ✅ File deleted successfully. Response:`, response.data);
            return response.data;
        } catch (error: any) {
            console.error("[BlobService] ❌ Error deleting file:", error);
            if (axios.isAxiosError(error)) {
                console.error("[BlobService] Axios error details:", {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                });
            }

            if (error?.response?.data) {
                return error.response.data;
            }

            return {
                status: "failure",
                message: "Une erreur est survenue lors de la suppression du fichier.",
            };
        }
    };

    return { uploadFile, getFileById, deleteFile };
}
