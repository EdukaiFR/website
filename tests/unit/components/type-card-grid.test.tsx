import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TypeCardGrid } from "@/components/ticket/type-card-grid";
import type { TicketConfigValue } from "@/lib/types/ticket";

const mockTypes: TicketConfigValue[] = [
  { key: "bug", label: "Bug Report", icon: "bug", order: 1, isActive: true },
  { key: "feature_request", label: "Feature Request", icon: "lightbulb", order: 2, isActive: true },
  { key: "question", label: "Question", icon: "help_circle", order: 3, isActive: true },
];

describe("TypeCardGrid", () => {
  it("should render all type cards with French labels from config", () => {
    render(
      <TypeCardGrid
        types={mockTypes}
        selectedType=""
        onSelect={vi.fn()}
      />
    );

    // bug and question match TYPE_CONFIGS -> French labels
    expect(screen.getByText("Bug")).toBeInTheDocument();
    expect(screen.getByText("Question")).toBeInTheDocument();
    // feature_request matches TYPE_CONFIGS -> French label
    expect(screen.getByText("Nouvelle fonctionnalité")).toBeInTheDocument();
  });

  it("should call onSelect when a card is clicked", () => {
    const onSelect = vi.fn();
    render(
      <TypeCardGrid
        types={mockTypes}
        selectedType=""
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByText("Bug"));
    expect(onSelect).toHaveBeenCalledWith("bug");
  });

  it("should apply selected styling to the active card", () => {
    render(
      <TypeCardGrid
        types={mockTypes}
        selectedType="bug"
        onSelect={vi.fn()}
      />
    );

    const bugButton = screen.getByText("Bug").closest("button");
    // bug type uses red border + red background when selected
    expect(bugButton?.className).toContain("border-red-500");
    expect(bugButton?.className).toContain("bg-red-50");
  });

  it("should not apply selected styling to unselected cards", () => {
    render(
      <TypeCardGrid
        types={mockTypes}
        selectedType="bug"
        onSelect={vi.fn()}
      />
    );

    const questionButton = screen.getByText("Question").closest("button");
    expect(questionButton?.className).toContain("border-gray-200");
    expect(questionButton?.className).not.toContain("border-blue-500");
  });

  it("should render skeleton cards when loading", () => {
    const { container } = render(
      <TypeCardGrid
        types={[]}
        selectedType=""
        onSelect={vi.fn()}
        isLoading={true}
      />
    );

    const skeletons = container.querySelectorAll("[class*='animate-pulse']");
    expect(skeletons.length).toBe(3);
  });

  it("should render empty grid when no types and not loading", () => {
    render(
      <TypeCardGrid
        types={[]}
        selectedType=""
        onSelect={vi.fn()}
        isLoading={false}
      />
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should render cards as type=button to prevent form submission", () => {
    render(
      <TypeCardGrid
        types={mockTypes}
        selectedType=""
        onSelect={vi.fn()}
      />
    );

    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute("type", "button");
    });
  });

  it("should fall back to API label for unknown type keys", () => {
    const unknownTypes: TicketConfigValue[] = [
      { key: "custom_type", label: "Custom Type", order: 1, isActive: true },
    ];

    render(
      <TypeCardGrid
        types={unknownTypes}
        selectedType=""
        onSelect={vi.fn()}
      />
    );

    // Unknown keys fall back to the API-provided label
    expect(screen.getByText("Custom Type")).toBeInTheDocument();
  });
});
