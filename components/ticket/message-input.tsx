"use client";

import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleX, Lock, Loader2, Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks";
import { useTicketService } from "@/services/ticket";
import { createMessageSchema } from "@/lib/schemas/ticket";
import type { CreateMessageFormValues } from "@/lib/schemas/ticket";
import { ticketToast } from "@/lib/toast";
import { isApiSuccess } from "@/lib/types/api";
import type { TicketMessage, TicketVisibility } from "@/lib/types/ticket";
import { validateFile } from "@/lib/utils/file-upload";
import { convertFilesToAttachments } from "@/lib/utils/file-upload";
import { showToast } from "@/lib/toast";

const MAX_ATTACHMENT_COUNT = 5;

interface MessageInputProps {
  ticketId: string;
  isTicketClosed: boolean;
  isAdmin: boolean;
  onMessageSent: (message: TicketMessage) => void;
  className?: string;
}

/**
 * Message input with auto-resize textarea, file attachments, and admin visibility toggle.
 * Disabled when the ticket is closed.
 */
export function MessageInput({
  ticketId,
  isTicketClosed,
  isAdmin,
  onMessageSent,
  className,
}: MessageInputProps) {
  const session = useSession();
  const ticketService = useTicketService();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [visibility, setVisibility] = useState<TicketVisibility>("public");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateMessageFormValues>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: { content: "", visibility: "public" },
  });

  const content = form.watch("content");

  const handleFileAdd = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const remaining = MAX_ATTACHMENT_COUNT - files.length;
      if (remaining <= 0) {
        showToast.warning(
          `Maximum ${MAX_ATTACHMENT_COUNT} fichiers autorisés.`
        );
        return;
      }

      const newFiles = Array.from(incoming).slice(0, remaining);
      const valid: File[] = [];
      for (const file of newFiles) {
        const result = validateFile(file);
        if (!result.valid) {
          showToast.warning(result.error ?? "Fichier invalide");
        } else {
          valid.push(file);
        }
      }

      if (valid.length > 0) {
        setFiles((prev) => [...prev, ...valid]);
      }
    },
    [files.length]
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(
    async (values: CreateMessageFormValues) => {
      setIsSubmitting(true);
      try {
        const processedAttachments = await convertFilesToAttachments(
          files,
          session.user?._id ?? ""
        );

        const result = await ticketService.createMessage(ticketId, {
          content: values.content,
          visibility,
          attachments: processedAttachments,
        });

        if (isApiSuccess(result) && result.data) {
          ticketToast.messageSuccess();
          form.reset();
          setFiles([]);
          setVisibility("public");
          onMessageSent(result.data);
        } else {
          ticketToast.messageError(result.message);
        }
      } catch (error: unknown) {
        const err = error as Error;
        ticketToast.messageError(err.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [files, session.user, ticketService, ticketId, visibility, form, onMessageSent]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        form.handleSubmit(handleSubmit)();
      }
    },
    [form, handleSubmit]
  );

  if (isTicketClosed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-500 text-sm",
          className
        )}
      >
        <Lock className="h-4 w-4" />
        Ce ticket est fermé. Vous ne pouvez plus envoyer de messages.
      </div>
    );
  }

  const isInternal = visibility === "internal";

  return (
    <div
      className={cn(
        "bg-white border rounded-2xl shadow-sm transition-colors",
        isInternal ? "border-amber-300" : "border-gray-200",
        className
      )}
    >
      {isAdmin && (
        <div className="flex gap-1 px-4 pt-3">
          <button
            type="button"
            onClick={() => setVisibility("public")}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-medium transition-colors",
              !isInternal
                ? "bg-blue-100 text-blue-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            )}
          >
            Réponse
          </button>
          <button
            type="button"
            onClick={() => setVisibility("internal")}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-medium transition-colors",
              isInternal
                ? "bg-amber-100 text-amber-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            )}
          >
            Note interne
          </button>
        </div>
      )}

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="p-4">
          <textarea
            placeholder={
              isInternal
                ? "Écrire une note interne..."
                : "Écrire un message..."
            }
            disabled={isSubmitting}
            className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none resize-none min-h-[44px] max-h-[200px] overflow-y-auto"
            onKeyDown={handleKeyDown}
            {...form.register("content", {
              onChange: () => {
                if (textareaRef.current) {
                  textareaRef.current.style.height = "auto";
                  textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                }
              },
            })}
            ref={(el) => {
              form.register("content").ref(el);
              (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
            }}
          />

          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {files.map((file, i) => (
                <div
                  key={`${file.name}-${i}`}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-xs text-gray-700"
                >
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <CircleX className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting || files.length >= MAX_ATTACHMENT_COUNT}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                handleFileAdd(e.target.files);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            />
            {files.length > 0 && (
              <span className="text-xs text-gray-400">
                {files.length}/{MAX_ATTACHMENT_COUNT}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:inline">
              ⌘+Enter
            </span>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !content.trim()}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg shadow-sm"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
