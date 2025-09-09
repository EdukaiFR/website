/**
 * Utilities for handling profile pictures (URL vs Base64)
 */

/**
 * Checks if a string is a base64 encoded image
 */
export function isBase64Image(str: string): boolean {
    if (!str) return false;

    const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
    return base64Regex.test(str);
}

/**
 * Checks if a string is a valid URL
 */
export function isUrl(str: string): boolean {
    if (!str) return false;

    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
}

/**
 * Converts a File to base64 data URL
 */
export function convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith("image/")) {
            reject(new Error("Le fichier doit être une image"));
            return;
        }

        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            reject(new Error("L'image ne peut pas dépasser 2MB"));
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
            } else {
                reject(new Error("Erreur lors de la lecture du fichier"));
            }
        };

        reader.onerror = () => {
            reject(new Error("Erreur lors de la lecture du fichier"));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Returns the appropriate src attribute for an image
 */
export function getImageDisplaySrc(
    profilePic?: string | null
): string | undefined {
    if (!profilePic) return undefined;

    if (isBase64Image(profilePic)) {
        return profilePic;
    }

    if (isUrl(profilePic)) {
        return profilePic;
    }

    return undefined;
}

/**
 * Validates image file type
 */
export function isValidImageType(file: File): boolean {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type);
}

/**
 * Gets file extension from MIME type
 */
export function getImageExtension(file: File): string {
    switch (file.type) {
        case "image/jpeg":
        case "image/jpg":
            return "jpg";
        case "image/png":
            return "png";
        default:
            return "jpg";
    }
}
