"use client";

import { validateFile } from "@/lib/utils/file-upload";
import { ALLOWED_MIME_TYPES } from "@/lib/types/ticket";
import { showToast } from "@/lib/toast";
import { CircleX, CloudUpload, FileText } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_MAX_FILES = 5;

interface FileDropzoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

/**
 * Drag-and-drop file upload zone with client-side validation.
 * Validates file size and MIME type, enforces max file count, and shows image previews.
 *
 * @param files - Currently selected files
 * @param onFilesChange - Callback when files are added or removed
 * @param maxFiles - Maximum number of files allowed (default: 5)
 * @param disabled - Disable interactions during submission
 */
export function FileDropzone({
  files,
  onFilesChange,
  maxFiles = DEFAULT_MAX_FILES,
  disabled = false,
}: FileDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptString = ALLOWED_MIME_TYPES.join(",");

  const objectUrls = useMemo(
    () =>
      files
        .filter((f) => f.type.startsWith("image/"))
        .map((f) => ({ name: f.name, url: URL.createObjectURL(f) })),
    [files]
  );

  useEffect(() => {
    return () => {
      objectUrls.forEach((o) => URL.revokeObjectURL(o.url));
    };
  }, [objectUrls]);

  function addFiles(incoming: File[]) {
    const remainingSlots = maxFiles - files.length;
    if (remainingSlots <= 0) {
      showToast.warning(
        `Vous ne pouvez pas ajouter plus de ${maxFiles} fichiers.`
      );
      return;
    }

    const capped = incoming.slice(0, remainingSlots);
    if (incoming.length > remainingSlots) {
      showToast.warning(
        `Seuls ${remainingSlots} fichier(s) peuvent être ajoutés (maximum ${maxFiles} fichiers).`
      );
    }

    const valid: File[] = [];
    for (const file of capped) {
      const result = validateFile(file);
      if (!result.valid) {
        showToast.warning(result.error ?? "Fichier invalide");
      } else {
        valid.push(file);
      }
    }

    if (valid.length > 0) {
      onFilesChange([...files, ...valid]);
    }
  }

  function removeFile(index: number) {
    onFilesChange(files.filter((_, i) => i !== index));
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    addFiles(selected);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!disabled) setIsDragActive(true);
  }

  function handleDragLeave() {
    setIsDragActive(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragActive(false);
    if (disabled) return;
    const dropped = Array.from(e.dataTransfer.files);
    addFiles(dropped);
  }

  function getPreviewUrl(file: File): string | undefined {
    return objectUrls.find((o) => o.name === file.name)?.url;
  }

  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor="ticket-file-input"
        aria-label="Sélectionner des fichiers"
        className={`block relative border-dashed border-2 rounded-xl p-8 text-center transition-all duration-200 ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        } ${
          isDragActive
            ? "border-blue-600 bg-blue-50 shadow-lg scale-[1.02]"
            : "border-blue-200/60 bg-white/50 hover:bg-blue-50/50 hover:border-blue-400 hover:shadow-md"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          id="ticket-file-input"
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept={acceptString}
          onChange={handleInputChange}
          disabled={disabled}
        />
        <div className="flex flex-col items-center justify-center">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl mb-4">
            <CloudUpload className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-semibold text-gray-800 mb-2">
            Glissez vos fichiers ici ou cliquez pour parcourir
          </p>
          <p className="text-sm text-blue-600 font-medium">
            PDF, TXT, PNG, JPG, GIF, WEBP, DOC, DOCX — 5 Mo max
          </p>
        </div>
      </label>

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800">
              Fichiers sélectionnés
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {files.length}/{maxFiles}
            </span>
          </div>
          {files.map((file, index) => {
            const previewUrl = getPreviewUrl(file);
            return (
              <div
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center justify-between p-3 border border-blue-200/60 rounded-xl bg-white/80 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={file.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {Math.round(file.size / 1024)} Ko
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  disabled={disabled}
                  className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                  <CircleX className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
