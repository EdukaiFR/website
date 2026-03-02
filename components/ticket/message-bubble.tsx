"use client";

import { memo } from "react";
import { EyeOff } from "lucide-react";
import { formatMessageTime, resolveId } from "@/lib/utils/ticket-helpers";
import { cn } from "@/lib/utils";
import { AttachmentPreview } from "@/components/ticket/attachment-preview";
import type { TicketMessage } from "@/lib/types/ticket";

type BubbleVariant = "own" | "admin" | "internal" | "system";

function resolveBubbleVariant(
  message: TicketMessage,
  currentUserId: string
): BubbleVariant {
  if (message.senderRole === "system") return "system";
  if (message.visibility === "internal") return "internal";
  if (resolveId(message.senderId) === currentUserId) return "own";
  return "admin";
}

const VARIANT_STYLES: Record<
  BubbleVariant,
  { container: string; bubble: string; meta: string }
> = {
  own: {
    container: "flex justify-end",
    bubble:
      "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-2xl rounded-br-sm px-4 py-3 max-w-[75%]",
    meta: "text-blue-100",
  },
  admin: {
    container: "flex justify-start",
    bubble:
      "bg-white border border-gray-200 text-gray-900 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[75%]",
    meta: "text-gray-400",
  },
  internal: {
    container: "flex justify-start",
    bubble:
      "bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[75%]",
    meta: "text-amber-500",
  },
  system: {
    container: "flex justify-center",
    bubble:
      "bg-gray-100 text-gray-500 text-xs italic px-4 py-1.5 rounded-full max-w-[85%]",
    meta: "text-gray-400",
  },
};

interface MessageBubbleProps {
  message: TicketMessage;
  currentUserId: string;
  senderName?: string;
  className?: string;
}

/**
 * Render a single message bubble with variant-based styling.
 * Supports 4 visual styles: own, admin, internal note, and system.
 */
export const MessageBubble = memo(function MessageBubble({
  message,
  currentUserId,
  senderName,
  className,
}: MessageBubbleProps) {
  const variant = resolveBubbleVariant(message, currentUserId);
  const styles = VARIANT_STYLES[variant];
  const timestamp = formatMessageTime(message.createdAt);

  if (variant === "system") {
    return (
      <div className={cn(styles.container, className)}>
        <div className={styles.bubble}>{message.content}</div>
      </div>
    );
  }

  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.bubble}>
        {variant === "internal" && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <EyeOff className="h-3 w-3 text-amber-500" />
            <span className="text-xs font-medium text-amber-600">
              Note interne
            </span>
          </div>
        )}

        {senderName && variant !== "own" && (
          <p className={cn("text-xs font-medium mb-1", styles.meta)}>
            {senderName}
          </p>
        )}

        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>

        {message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.attachments.map((att, i) => (
              <AttachmentPreview
                key={`${att.fileName}-${i}`}
                attachment={att}
              />
            ))}
          </div>
        )}

        <p className={cn("text-xs mt-2", styles.meta)}>
          {timestamp}
          {message.editedAt && " (modifié)"}
        </p>
      </div>
    </div>
  );
});
