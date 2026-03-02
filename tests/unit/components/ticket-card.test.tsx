import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TicketCard } from "@/components/ticket/ticket-card";
import type { Ticket } from "@/lib/types/ticket";

function createMockTicket(overrides: Partial<Ticket> = {}): Ticket {
  return {
    _id: "1",
    reference: "EK-ABC123",
    author: "user1",
    type: "bug",
    category: "course_generation",
    tags: [],
    title: "Test ticket title",
    description: "This is a test ticket description for testing purposes.",
    attachments: [],
    clientUrgency: "medium",
    internalPriority: "medium",
    status: "open",
    statusHistory: [],
    reopenCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("TicketCard", () => {
  it("should render ticket reference", () => {
    const ticket = createMockTicket();
    render(<TicketCard ticket={ticket} onClick={vi.fn()} />);
    expect(screen.getByText("EK-ABC123")).toBeInTheDocument();
  });

  it("should render ticket title", () => {
    const ticket = createMockTicket({ title: "My important ticket" });
    render(<TicketCard ticket={ticket} onClick={vi.fn()} />);
    expect(screen.getByText("My important ticket")).toBeInTheDocument();
  });

  it("should render status badge", () => {
    const ticket = createMockTicket({ status: "open" });
    render(<TicketCard ticket={ticket} onClick={vi.fn()} />);
    expect(screen.getByText("Ouvert")).toBeInTheDocument();
  });

  it("should render French type label in meta row", () => {
    const ticket = createMockTicket({ type: "bug" });
    render(<TicketCard ticket={ticket} onClick={vi.fn()} />);
    expect(screen.getByText("Bug")).toBeInTheDocument();
  });

  it("should render French category label in meta row", () => {
    const ticket = createMockTicket({ category: "course_generation" });
    render(<TicketCard ticket={ticket} onClick={vi.fn()} />);
    expect(screen.getByText("Génération de cours")).toBeInTheDocument();
  });

  it("should render urgency badge", () => {
    const ticket = createMockTicket({ clientUrgency: "medium" });
    render(<TicketCard ticket={ticket} onClick={vi.fn()} />);
    expect(screen.getByText("Moyenne")).toBeInTheDocument();
  });

  it("should call onClick when card is clicked", () => {
    const ticket = createMockTicket();
    const onClick = vi.fn();
    render(<TicketCard ticket={ticket} onClick={onClick} />);

    fireEvent.click(screen.getByText("EK-ABC123"));
    expect(onClick).toHaveBeenCalledWith(ticket);
  });

  it("should render as a button element", () => {
    const ticket = createMockTicket();
    render(<TicketCard ticket={ticket} onClick={vi.fn()} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "button");
  });

  it("should render icon box for the type", () => {
    const ticket = createMockTicket({ type: "bug" });
    const { container } = render(
      <TicketCard ticket={ticket} onClick={vi.fn()} />
    );
    const iconBox = container.querySelector(".h-9.w-9.rounded-lg");
    expect(iconBox).toBeInTheDocument();
  });

  it("should fall back to raw key for unknown type", () => {
    const ticket = createMockTicket({ type: "custom_type" as Ticket["type"] });
    render(<TicketCard ticket={ticket} onClick={vi.fn()} />);
    expect(screen.getByText("custom_type")).toBeInTheDocument();
  });
});
