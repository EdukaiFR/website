"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Info, TicketX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AttachmentPreview,
  TicketHeader,
  MessageThread,
  MessageInput,
  TicketSidebar,
} from "@/components/ticket";
import { useSession, useIsAdmin, useTicket } from "@/hooks";
import { useTicketService } from "@/services/ticket";

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const ticketId = params.id;

  const session = useSession();
  const isAdmin = useIsAdmin();
  const ticketService = useTicketService();

  const {
    ticket,
    messages,
    isLoading,
    notFound,
    isReopening,
    handleMessageSent,
    handleTicketUpdate,
    handleReopen,
  } = useTicket(ticketId, ticketService);

  const currentUserId = session.user?._id ?? "";

  const senderNames = useMemo(() => {
    const names: Record<string, string> = {};
    if (session.user) {
      names[session.user._id] = "Vous";
    }
    return names;
  }, [session.user]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 px-4 lg:px-8 py-6 min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50">
        <div className="max-w-6xl mx-auto w-full flex gap-6">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="flex-1 min-h-[400px] rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
          <div className="hidden lg:block w-80 shrink-0">
            <Skeleton className="h-[500px] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50">
        <TicketX className="h-12 w-12 text-gray-300" />
        <h2 className="text-lg font-semibold text-gray-700">
          Ticket introuvable
        </h2>
        <p className="text-sm text-gray-500">
          Ce ticket n&apos;existe pas ou vous n&apos;y avez pas accès.
        </p>
        <Button asChild variant="outline">
          <Link href="/support">Retour au support</Link>
        </Button>
      </div>
    );
  }

  const isTicketClosed = ticket.status === "closed";

  return (
    <div className="flex flex-col px-4 lg:px-8 py-6 min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-6 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <TicketHeader
            ticket={ticket}
            onReopen={handleReopen}
            isReopening={isReopening}
            className="flex-1"
          />

          {/* Mobile sidebar trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden shrink-0 h-10 w-10"
              >
                <Info className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[340px] overflow-y-auto p-0">
              <SheetHeader className="p-4 pb-0">
                <SheetTitle>Détails du ticket</SheetTitle>
              </SheetHeader>
              <div className="p-4">
                <TicketSidebar ticket={ticket} isAdmin={isAdmin} onTicketUpdate={handleTicketUpdate} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Two-column layout — aligned at top */}
        <div className="flex gap-6 items-start flex-1">
          {/* Left column — conversation */}
          <div className="flex-1 flex flex-col min-w-0 gap-4">
            {/* Description + attachments */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                {ticket.description}
              </p>
              {ticket.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  {ticket.attachments.map((att, i) => (
                    <AttachmentPreview
                      key={`${att.fileName}-${i}`}
                      attachment={att}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Message thread */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <MessageThread
                messages={messages}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
                senderNames={senderNames}
                className="flex-1 overflow-y-auto max-h-[calc(100vh-28rem)]"
              />
            </div>

            {/* Message input */}
            <MessageInput
              ticketId={ticket._id}
              isTicketClosed={isTicketClosed}
              isAdmin={isAdmin}
              onMessageSent={handleMessageSent}
            />
          </div>

          {/* Right column — sidebar (desktop only) */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-6">
              <TicketSidebar ticket={ticket} isAdmin={isAdmin} onTicketUpdate={handleTicketUpdate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
