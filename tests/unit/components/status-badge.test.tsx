import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "@/components/ticket/status-badge";
import type { TicketStatus } from "@/lib/types/ticket";

describe("StatusBadge", () => {
  it("should render French label for known status", () => {
    render(<StatusBadge status="open" />);
    expect(screen.getByText("Ouvert")).toBeInTheDocument();
  });

  it("should render French label for in_progress status", () => {
    render(<StatusBadge status="in_progress" />);
    expect(screen.getByText("En cours")).toBeInTheDocument();
  });

  it("should render French label for waiting_for_client status", () => {
    render(<StatusBadge status="waiting_for_client" />);
    expect(screen.getByText("En attente")).toBeInTheDocument();
  });

  it("should render French label for resolved status", () => {
    render(<StatusBadge status="resolved" />);
    expect(screen.getByText("Résolu")).toBeInTheDocument();
  });

  it("should render French label for closed status", () => {
    render(<StatusBadge status="closed" />);
    expect(screen.getByText("Fermé")).toBeInTheDocument();
  });

  it("should fall back to raw status key for unknown status", () => {
    render(<StatusBadge status={"custom_status" as TicketStatus} />);
    expect(screen.getByText("custom_status")).toBeInTheDocument();
  });

  it("should apply correct color classes for open status", () => {
    const { container } = render(<StatusBadge status="open" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-blue-50");
    expect(badge.className).toContain("text-blue-700");
  });

  it("should apply fallback gray colors for unknown status", () => {
    const { container } = render(<StatusBadge status={"unknown" as TicketStatus} />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-gray-100");
    expect(badge.className).toContain("text-gray-600");
  });

  it("should render a colored dot indicator", () => {
    const { container } = render(<StatusBadge status="open" />);
    const dots = container.querySelectorAll(".rounded-full");
    // First is the outer badge, second is the dot
    const dot = dots[1];
    expect(dot).toBeInTheDocument();
    expect(dot?.className).toContain("bg-blue-500");
  });

  it("should apply custom className", () => {
    const { container } = render(
      <StatusBadge status="open" className="ml-4" />
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("ml-4");
  });
});
