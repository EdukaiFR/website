import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  type TicketAttachment,
} from "@/lib/types/ticket";
import { formatFileSize } from "@/lib/file-utils";

interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate a file against size and MIME type constraints.
 * @param file - The file to validate
 * @returns Validation result with an optional error message
 */
export function validateFile(file: File): FileValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Le fichier "${file.name}" dépasse la taille maximale de ${formatFileSize(MAX_FILE_SIZE)}`,
    };
  }

  const allowed: readonly string[] = ALLOWED_MIME_TYPES;
  if (!allowed.includes(file.type)) {
    return {
      valid: false,
      error: `Le type de fichier "${file.type || "inconnu"}" n'est pas supporté`,
    };
  }

  return { valid: true };
}

const MAX_IMAGE_WIDTH = 1920;
const JPEG_QUALITY = 0.8;
/** 1 MB */
const COMPRESSION_THRESHOLD = 1024 * 1024;

/**
 * Compress an image file using OffscreenCanvas.
 * Only compresses if the file exceeds 1 MB.
 * Resizes to max 1920px width and outputs as JPEG at 0.8 quality.
 * @param file - The image file to compress
 * @returns The compressed file, or the original if below threshold
 */
export async function compressImage(file: File): Promise<File> {
  if (file.size <= COMPRESSION_THRESHOLD) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const ratio = Math.min(1, MAX_IMAGE_WIDTH / bitmap.width);
    const width = Math.round(bitmap.width * ratio);
    const height = Math.round(bitmap.height * ratio);

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await canvas.convertToBlob({
      type: "image/jpeg",
      quality: JPEG_QUALITY,
    });

    return new File([blob], file.name, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[compressImage] Compression failed, using original:", error);
    }
    return file;
  }
}

/**
 * Convert a File to a Base64 data URL string.
 * @param file - The file to convert
 * @returns The Base64-encoded data URL
 */
export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("FileReader did not return a string"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Process an array of files through the full pipeline:
 * validate -> compress (if image > 1MB) -> convert to Base64.
 * @param files - The files to process
 * @param uploadedBy - The user ID of the uploader
 * @returns An array of TicketAttachment ready for the API
 * @throws Error if any file fails validation
 */
export async function convertFilesToAttachments(
  files: File[],
  uploadedBy: string
): Promise<TicketAttachment[]> {
  const attachments: TicketAttachment[] = [];

  for (const file of files) {
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const isImage = file.type.startsWith("image/");
    const processed = isImage ? await compressImage(file) : file;
    const data = await convertFileToBase64(processed);

    attachments.push({
      fileName: file.name,
      fileType: processed.type,
      fileSize: processed.size,
      data,
      uploadedBy,
      uploadedAt: new Date().toISOString(),
    });
  }

  return attachments;
}

/**
 * Return the display category for a given MIME type.
 * @param mimeType - The MIME type to categorize
 * @returns The attachment kind for UI rendering
 */
export function getAttachmentKind(
  mimeType: string
): "image" | "document" | "text" {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "text/plain") return "text";
  return "document";
}
