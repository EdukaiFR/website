import { 
    MAX_FILE_SIZE, 
    ALLOWED_MIME_TYPES, 
    AllowedMimeType,
    AttachmentKind,
    TicketAttachment
} from "@/lib/types/ticket";

export interface FileValidationResult {
    isValid: boolean;
    error?: string;
}

export interface FileUploadProgress {
    file: File;
    progress: number;
    status: 'uploading' | 'completed' | 'error';
    error?: string;
}

/**
 * Validate a file against our constraints
 */
export const validateFile = (file: File): FileValidationResult => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            isValid: false,
            error: `Le fichier "${file.name}" dépasse la limite de 5 MB (${(file.size / 1024 / 1024).toFixed(1)} MB)`
        };
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type as AllowedMimeType)) {
        return {
            isValid: false,
            error: `Le type de fichier "${file.type}" n'est pas supporté pour "${file.name}"`
        };
    }

    return { isValid: true };
};

/**
 * Convert a file to base64 string
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix (e.g., "data:image/png;base64,")
            const base64Data = result.split(',')[1];
            resolve(base64Data);
        };
        
        reader.onerror = (error) => {
            reject(new Error(`Erreur lors de la conversion du fichier "${file.name}": ${error}`));
        };
        
        reader.readAsDataURL(file);
    });
};

/**
 * Determine the attachment kind based on MIME type
 */
export const getAttachmentKind = (mimeType: string): AttachmentKind => {
    if (mimeType.startsWith('image/')) {
        return AttachmentKind.IMAGE;
    } else if (
        mimeType === 'text/plain' || 
        mimeType === 'text/csv' || 
        mimeType === 'application/json'
    ) {
        return AttachmentKind.DOCUMENT;
    } else {
        return AttachmentKind.OTHER;
    }
};

/**
 * Convert File objects to TicketAttachment format
 */
export const convertFilesToAttachments = async (files: File[]): Promise<TicketAttachment[]> => {
    const attachments: TicketAttachment[] = [];
    
    for (const file of files) {
        try {
            const validation = validateFile(file);
            if (!validation.isValid) {
                throw new Error(validation.error);
            }

            const base64Data = await convertFileToBase64(file);
            
            const attachment: TicketAttachment = {
                id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                filename: file.name,
                mimeType: file.type,
                size: file.size,
                kind: getAttachmentKind(file.type),
                url: base64Data, // Using base64 data as URL for now
                uploadedAt: new Date().toISOString()
            };
            
            attachments.push(attachment);
        } catch (error) {
            throw new Error(`Erreur lors du traitement du fichier "${file.name}": ${error instanceof Error ? error.message : error}`);
        }
    }
    
    return attachments;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Check if file is an image
 */
export const isImageFile = (mimeType: string): boolean => {
    return mimeType.startsWith('image/');
};

/**
 * Get a preview-friendly filename (truncated if too long)
 */
export const getDisplayFilename = (filename: string, maxLength: number = 30): string => {
    if (filename.length <= maxLength) {
        return filename;
    }
    
    const extension = getFileExtension(filename);
    const nameWithoutExt = filename.slice(0, filename.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.slice(0, maxLength - extension.length - 4) + '...';
    
    return `${truncatedName}.${extension}`;
};

/**
 * Create a file preview URL for images
 */
export const createFilePreview = (file: File): string => {
    return URL.createObjectURL(file);
};

/**
 * Cleanup file preview URL
 */
export const cleanupFilePreview = (url: string): void => {
    URL.revokeObjectURL(url);
};

/**
 * Get the maximum allowed file size for display
 */
export const getMaxFileSizeDisplay = (): string => {
    return formatFileSize(MAX_FILE_SIZE);
};

/**
 * Get allowed file types for display
 */
export const getAllowedFileTypesDisplay = (): string => {
    const imageTypes = ALLOWED_MIME_TYPES.filter(type => type.startsWith('image/')).length;
    const documentTypes = ALLOWED_MIME_TYPES.length - imageTypes;
    
    return `Images (${imageTypes} formats), Documents (${documentTypes} formats)`;
};