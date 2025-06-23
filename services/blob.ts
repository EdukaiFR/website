import axios from "axios";

export interface BlobService {
    uploadFile: (file: File, fileType: string) => Promise<unknown>;
    getFileById: (fileId: string) => Promise<unknown>;
}

export function useBlobService() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const uploadFile = async (file: File, fileType: string) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileType", fileType);

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

            return response.data;
        } catch (error) {
            console.error("An error ocurred uploading the file", error);
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

    return { uploadFile, getFileById };
}
