export const formatFileSize = (sizeInBytes: number) => {
    const mb = sizeInBytes / (1024 * 1024);
    return mb < 1
        ? `${(sizeInBytes / 1024).toFixed(1)} KB`
        : `${mb.toFixed(1)} MB`;
};

export const getContentTypeFromFilename = (filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
        case "pdf":
            return "application/pdf";
        case "jpg":
        case "jpeg":
            return "image/jpeg";
        case "png":
            return "image/png";
        case "gif":
            return "image/gif";
        case "txt":
            return "text/plain";
        case "doc":
            return "application/msword";
        case "docx":
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        default:
            return "application/octet-stream";
    }
};

export const getFileIconType = (
    contentType: string,
    isZip?: boolean
): "archive" | "image" | "text" | "file" => {
    if (isZip) return "archive";
    if (contentType.includes("image")) return "image";
    if (contentType.includes("text") || contentType.includes("pdf"))
        return "text";
    return "file";
};

export const isImage = (contentType: string) => {
    return contentType.startsWith("image/");
};

export const downloadFile = (
    content: string,
    filename: string,
    contentType: string
) => {
    const bytes = new Uint8Array(
        atob(content)
            .split("")
            .map(c => c.charCodeAt(0))
    );
    const blob = new Blob([bytes], { type: contentType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const base64ToBlob = (base64: string): Blob => {
    const mimeType = "application/zip";
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes.buffer], { type: mimeType });
};
