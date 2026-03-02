import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MessageBubble } from "@/components/ticket/message-bubble";
import type { TicketMessage } from "@/lib/types/ticket";

vi.mock("@/components/ticket/attachment-preview", () => ({
  AttachmentPreview: ({
    attachment,
  }: {
    attachment: { fileName: string };
  }) => <div data-testid="attachment">{attachment.fileName}</div>,
}));

vi.mock("@/lib/utils/ticket-helpers", () => ({
  formatMessageTime: () => "14:30",
  resolveId: (field: unknown) => {
    if (typeof field === "string") return field;
    if (field && typeof field === "object" && "_id" in field)
      return (field as { _id: string })._id;
    return "";
  },
}));

function createMockMessage(
  overrides: Partial<TicketMessage> = {}
): TicketMessage {
  return {
    _id: "msg1",
    ticketId: "t1",
    senderId: "user1",
    senderRole: "client",
    visibility: "public",
    content: "Test message content",
    attachments: [],
    readBy: [],
    createdAt: "2026-03-01T14:30:00Z",
    ...overrides,
  };
}

describe("MessageBubble", () => {
  describe("own message variant", () => {
    it("should render with right alignment", () => {
      const { container } = render(
        <MessageBubble
          message={createMockMessage({ senderId: "me" })}
          currentUserId="me"
        />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain("justify-end");
    });

    it("should not display sender name for own messages", () => {
      render(
        <MessageBubble
          message={createMockMessage({ senderId: "me" })}
          currentUserId="me"
          senderName="My Name"
        />
      );
      expect(screen.queryByText("My Name")).not.toBeInTheDocument();
    });
  });

  describe("admin message variant", () => {
    it("should render with left alignment", () => {
      const { container } = render(
        <MessageBubble
          message={createMockMessage({
            senderId: "admin1",
            senderRole: "admin",
          })}
          currentUserId="me"
        />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain("justify-start");
    });

    it("should display sender name when provided", () => {
      render(
        <MessageBubble
          message={createMockMessage({
            senderId: "admin1",
            senderRole: "admin",
          })}
          currentUserId="me"
          senderName="Admin User"
        />
      );
      expect(screen.getByText("Admin User")).toBeInTheDocument();
    });
  });

  describe("internal note variant", () => {
    it("should display 'Note interne' label", () => {
      render(
        <MessageBubble
          message={createMockMessage({
            visibility: "internal",
            senderId: "admin1",
            senderRole: "admin",
          })}
          currentUserId="me"
        />
      );
      expect(screen.getByText("Note interne")).toBeInTheDocument();
    });

    it("should render with amber styling", () => {
      const { container } = render(
        <MessageBubble
          message={createMockMessage({
            visibility: "internal",
            senderId: "admin1",
            senderRole: "admin",
          })}
          currentUserId="me"
        />
      );
      const bubble = container.querySelector("[class*='amber']");
      expect(bubble).not.toBeNull();
    });
  });

  describe("system message variant", () => {
    it("should render centered", () => {
      const { container } = render(
        <MessageBubble
          message={createMockMessage({
            senderRole: "system",
            senderId: "system",
          })}
          currentUserId="me"
        />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain("justify-center");
    });

    it("should render content without timestamp", () => {
      render(
        <MessageBubble
          message={createMockMessage({
            senderRole: "system",
            senderId: "system",
            content: "Status changed to resolved",
          })}
          currentUserId="me"
        />
      );
      expect(
        screen.getByText("Status changed to resolved")
      ).toBeInTheDocument();
      // System variant early-returns without rendering the meta line
      expect(screen.queryByText("14:30")).not.toBeInTheDocument();
    });
  });

  describe("timestamp rendering", () => {
    it("should display formatted time for non-system messages", () => {
      render(
        <MessageBubble
          message={createMockMessage({ senderId: "other" })}
          currentUserId="me"
        />
      );
      expect(screen.getByText("14:30")).toBeInTheDocument();
    });
  });

  describe("edit indicator", () => {
    it("should display '(modifié)' when editedAt exists", () => {
      render(
        <MessageBubble
          message={createMockMessage({
            senderId: "other",
            editedAt: "2026-03-01T15:00:00Z",
          })}
          currentUserId="me"
        />
      );
      expect(screen.getByText(/modifié/)).toBeInTheDocument();
    });

    it("should not display edit indicator when editedAt is undefined", () => {
      render(
        <MessageBubble
          message={createMockMessage({ senderId: "other" })}
          currentUserId="me"
        />
      );
      expect(screen.queryByText(/modifié/)).not.toBeInTheDocument();
    });
  });

  describe("attachments", () => {
    it("should render AttachmentPreview for each attachment", () => {
      const msg = createMockMessage({
        senderId: "other",
        attachments: [
          {
            fileName: "file1.png",
            fileType: "image/png",
            fileSize: 1024,
            data: "base64data",
            uploadedBy: "u1",
            uploadedAt: "2026-03-01T14:30:00Z",
          },
          {
            fileName: "file2.pdf",
            fileType: "application/pdf",
            fileSize: 2048,
            data: "base64data",
            uploadedBy: "u1",
            uploadedAt: "2026-03-01T14:30:00Z",
          },
        ],
      });
      render(<MessageBubble message={msg} currentUserId="me" />);
      const attachments = screen.getAllByTestId("attachment");
      expect(attachments).toHaveLength(2);
    });

    it("should not render attachment section when empty", () => {
      render(
        <MessageBubble
          message={createMockMessage({ senderId: "other" })}
          currentUserId="me"
        />
      );
      expect(screen.queryByTestId("attachment")).not.toBeInTheDocument();
    });
  });

  it("should render message content", () => {
    render(
      <MessageBubble
        message={createMockMessage({
          senderId: "other",
          content: "Hello world",
        })}
        currentUserId="me"
      />
    );
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });
});
