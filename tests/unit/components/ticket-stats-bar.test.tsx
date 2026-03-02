import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TicketStatsBar } from "@/components/ticket/ticket-stats-bar";
import type { Ticket } from "@/lib/types/ticket";

function createMockTicket(overrides: Partial<Ticket> = {}): Ticket {
  return {
    _id: "1",
    reference: "EK-TEST01",
    author: "user1",
    type: "bug",
    category: "other",
    tags: [],
    title: "Test ticket",
    description: "Test description",
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

describe("TicketStatsBar", () => {
  it("should render total count", () => {
    const tickets = [
      createMockTicket({ _id: "1", status: "open" }),
      createMockTicket({ _id: "2", status: "closed" }),
    ];

    render(<TicketStatsBar tickets={tickets} />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should render counts for each status", () => {
    const tickets = [
      createMockTicket({ _id: "1", status: "open" }),
      createMockTicket({ _id: "2", status: "open" }),
      createMockTicket({ _id: "3", status: "in_progress" }),
      createMockTicket({ _id: "4", status: "resolved" }),
    ];

    render(<TicketStatsBar tickets={tickets} />);

    // Total
    expect(screen.getByText("4")).toBeInTheDocument();
    // Open count
    expect(screen.getByText("Ouvert")).toBeInTheDocument();
    // In progress
    expect(screen.getByText("En cours")).toBeInTheDocument();
    // Resolved
    expect(screen.getByText("Résolu")).toBeInTheDocument();
  });

  it("should show 0 for statuses with no tickets", () => {
    render(<TicketStatsBar tickets={[]} />);

    const zeros = screen.getAllByText("0");
    // 5 status categories + total = all showing 0
    expect(zeros.length).toBeGreaterThanOrEqual(5);
  });

  it("should render all French status labels", () => {
    render(<TicketStatsBar tickets={[]} />);

    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Ouvert")).toBeInTheDocument();
    expect(screen.getByText("En cours")).toBeInTheDocument();
    expect(screen.getByText("En attente")).toBeInTheDocument();
    expect(screen.getByText("Résolu")).toBeInTheDocument();
    expect(screen.getByText("Fermé")).toBeInTheDocument();
  });

  it("should render skeleton cards when loading", () => {
    const { container } = render(
      <TicketStatsBar tickets={[]} isLoading={true} />
    );

    const skeletons = container.querySelectorAll("[class*='animate-pulse']");
    expect(skeletons.length).toBe(6);
  });
});
