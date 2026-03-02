"use client";

import { memo, useCallback, useState } from "react";
import { Download, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getAttachmentKind } from "@/lib/utils/file-upload";
import type { TicketAttachment } from "@/lib/types/ticket";

interface AttachmentPreviewProps {
  attachment: TicketAttachment;
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function downloadAttachment(attachment: TicketAttachment) {
  const link = document.createElement("a");
  link.href = attachment.data;
  link.download = attachment.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Preview a ticket attachment as an image thumbnail or document card.
 * Images open in a lightbox dialog on click.
 */
export const AttachmentPreview = memo(function AttachmentPreview({
  attachment,
  className,
}: AttachmentPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const kind = getAttachmentKind(attachment.fileType);

  const handleDownload = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      downloadAttachment(attachment);
    },
    [attachment]
  );

  if (kind === "image") {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className={cn(
              "group relative max-w-[200px] rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors",
              className
            )}
          >
            <img
              src={attachment.data}
              alt={attachment.fileName}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl p-2">
          <div className="flex flex-col items-center gap-3">
            <img
              src={attachment.data}
              alt={attachment.fileName}
              className="max-h-[80vh] object-contain rounded-lg"
            />
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="truncate max-w-[300px]">
                {attachment.fileName}
              </span>
              <span>{formatFileSize(attachment.fileSize)}</span>
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Download className="h-3.5 w-3.5" />
                Télécharger
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50 max-w-[280px]",
        className
      )}
    >
      <div className="flex items-center justify-center h-9 w-9 shrink-0 rounded-lg bg-blue-100">
        <FileText className="h-4 w-4 text-blue-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-800 truncate">
          {attachment.fileName}
        </p>
        <p className="text-xs text-gray-500">
          {formatFileSize(attachment.fileSize)}
        </p>
      </div>
      <button
        type="button"
        onClick={handleDownload}
        className="shrink-0 p-1.5 rounded-md hover:bg-gray-200 transition-colors"
      >
        <Download className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
});
