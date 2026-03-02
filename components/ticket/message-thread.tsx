"use client";

import { useEffect, useMemo, useRef } from "react";
import { MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageBubble } from "@/components/ticket/message-bubble";
import type { TicketMessage } from "@/lib/types/ticket";

interface MessageThreadProps {
  messages: TicketMessage[];
  currentUserId: string;
  isAdmin: boolean;
  senderNames?: Record<string, string>;
  isLoading?: boolean;
  className?: string;
}

function isSameDay(a: string, b: string): boolean {
  return (
    format(new Date(a), "yyyy-MM-dd") === format(new Date(b), "yyyy-MM-dd")
  );
}

function DateSeparator({ date }: { date: string }) {
  return (
    <div className="flex items-center justify-center py-3">
      <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
        {format(new Date(date), "d MMMM yyyy", { locale: fr })}
      </span>
    </div>
  );
}

const SKELETON_COUNT = 3;

/**
 * Scrollable message thread with date separators and auto-scroll.
 * Filters internal messages for non-admin users.
 */
export function MessageThread({
  messages,
  currentUserId,
  isAdmin,
  senderNames = {},
  isLoading = false,
  className,
}: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const visibleMessages = useMemo(() => {
    if (isAdmin) return messages;
    return messages.filter((m) => m.visibility !== "internal");
  }, [messages, isAdmin]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages]);

  if (isLoading) {
    return (
      <div className={className}>
        <div className="flex flex-col gap-4 p-4">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
            >
              <Skeleton
                className={`h-16 rounded-2xl ${i % 2 === 0 ? "w-[60%] rounded-bl-sm" : "w-[50%] rounded-br-sm"}`}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (visibleMessages.length === 0) {
    return (
      <div className={className}>
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <MessageSquare className="h-10 w-10 mb-3" />
          <p className="text-sm font-medium">
            Aucun message pour le moment
          </p>
          <p className="text-xs mt-1">
            Envoyez le premier message ci-dessous.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-3 p-4">
        {visibleMessages.map((message, index) => {
          const showDateSep =
            index === 0 ||
            !isSameDay(
              visibleMessages[index - 1].createdAt,
              message.createdAt
            );

          return (
            <div key={message._id}>
              {showDateSep && <DateSeparator date={message.createdAt} />}
              <MessageBubble
                message={message}
                currentUserId={currentUserId}
                senderName={senderNames[message.senderId]}
              />
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
