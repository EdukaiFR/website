import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TicketEmptyState } from "@/components/ticket/ticket-empty-state";

describe("TicketEmptyState", () => {
  it("should show filter message when filters are active", () => {
    render(<TicketEmptyState hasFilters={true} />);
    expect(screen.getByText("Aucun ticket trouvé")).toBeInTheDocument();
    expect(
      screen.getByText(/Aucun ticket ne correspond/)
    ).toBeInTheDocument();
  });

  it("should show no-ticket message when no filters", () => {
    render(<TicketEmptyState hasFilters={false} />);
    expect(
      screen.getByText("Aucun ticket pour le moment")
    ).toBeInTheDocument();
  });

  it("should show create button when onCreateTicket is provided", () => {
    const onCreateTicket = vi.fn();
    render(
      <TicketEmptyState hasFilters={false} onCreateTicket={onCreateTicket} />
    );
    const button = screen.getByText("Créer un ticket");
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe("BUTTON");
  });

  it("should call onCreateTicket when button is clicked", () => {
    const onCreateTicket = vi.fn();
    render(
      <TicketEmptyState hasFilters={false} onCreateTicket={onCreateTicket} />
    );
    fireEvent.click(screen.getByText("Créer un ticket"));
    expect(onCreateTicket).toHaveBeenCalledTimes(1);
  });

  it("should not show create button when onCreateTicket is not provided", () => {
    render(<TicketEmptyState hasFilters={false} />);
    expect(screen.queryByText("Créer un ticket")).not.toBeInTheDocument();
  });

  it("should not show create button when filters are active", () => {
    render(<TicketEmptyState hasFilters={true} onCreateTicket={vi.fn()} />);
    expect(screen.queryByText("Créer un ticket")).not.toBeInTheDocument();
  });
});
