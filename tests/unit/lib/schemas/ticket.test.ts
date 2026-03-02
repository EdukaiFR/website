import { describe, expect, it } from "vitest";
import {
  createTicketSchema,
  createMessageSchema,
} from "@/lib/schemas/ticket";

describe("createTicketSchema", () => {
  const validInput = {
    title: "Valid ticket title",
    description: "A description that is at least twenty characters long for validation purposes",
    type: "bug",
    category: "general",
    clientUrgency: "medium",
  };

  it("should accept valid input", () => {
    const result = createTicketSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should reject title shorter than 5 characters", () => {
    const result = createTicketSchema.safeParse({ ...validInput, title: "Hi" });
    expect(result.success).toBe(false);
  });

  it("should reject title longer than 200 characters", () => {
    const result = createTicketSchema.safeParse({
      ...validInput,
      title: "A".repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it("should accept title at exactly 5 characters", () => {
    const result = createTicketSchema.safeParse({
      ...validInput,
      title: "Hello",
    });
    expect(result.success).toBe(true);
  });

  it("should accept title at exactly 200 characters", () => {
    const result = createTicketSchema.safeParse({
      ...validInput,
      title: "A".repeat(200),
    });
    expect(result.success).toBe(true);
  });

  it("should reject description shorter than 20 characters", () => {
    const result = createTicketSchema.safeParse({
      ...validInput,
      description: "Too short",
    });
    expect(result.success).toBe(false);
  });

  it("should reject description longer than 5000 characters", () => {
    const result = createTicketSchema.safeParse({
      ...validInput,
      description: "A".repeat(5001),
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing type", () => {
    const { type: _type, ...noType } = validInput;
    const result = createTicketSchema.safeParse(noType);
    expect(result.success).toBe(false);
  });

  it("should reject empty type string", () => {
    const result = createTicketSchema.safeParse({ ...validInput, type: "" });
    expect(result.success).toBe(false);
  });

  it("should reject missing category", () => {
    const { category: _category, ...noCat } = validInput;
    const result = createTicketSchema.safeParse(noCat);
    expect(result.success).toBe(false);
  });

  it("should reject empty category string", () => {
    const result = createTicketSchema.safeParse({ ...validInput, category: "" });
    expect(result.success).toBe(false);
  });

  it("should reject missing clientUrgency", () => {
    const { clientUrgency: _urgency, ...noUrg } = validInput;
    const result = createTicketSchema.safeParse(noUrg);
    expect(result.success).toBe(false);
  });

  it("should reject empty clientUrgency string", () => {
    const result = createTicketSchema.safeParse({
      ...validInput,
      clientUrgency: "",
    });
    expect(result.success).toBe(false);
  });

  it("should trim whitespace from title", () => {
    const result = createTicketSchema.safeParse({
      ...validInput,
      title: "  Trimmed title  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Trimmed title");
    }
  });

  it("should reject whitespace-only title after trim", () => {
    const result = createTicketSchema.safeParse({
      ...validInput,
      title: "     ",
    });
    expect(result.success).toBe(false);
  });

  it("should accept input with optional tags", () => {
    const result = createTicketSchema.safeParse({
      ...validInput,
      tags: ["ui", "bug"],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual(["ui", "bug"]);
    }
  });

  it("should accept input without tags", () => {
    const result = createTicketSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toBeUndefined();
    }
  });
});

describe("createMessageSchema", () => {
  it("should accept valid input with explicit visibility", () => {
    const result = createMessageSchema.safeParse({
      content: "Hello, I need help with this issue",
      visibility: "public",
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty content", () => {
    const result = createMessageSchema.safeParse({ content: "" });
    expect(result.success).toBe(false);
  });

  it("should reject content longer than 10000 characters", () => {
    const result = createMessageSchema.safeParse({
      content: "A".repeat(10001),
    });
    expect(result.success).toBe(false);
  });

  it("should accept content at exactly 10000 characters", () => {
    const result = createMessageSchema.safeParse({
      content: "A".repeat(10000),
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid visibility value", () => {
    const result = createMessageSchema.safeParse({
      content: "Hello",
      visibility: "private",
    });
    expect(result.success).toBe(false);
  });

  it("should default visibility to 'public' when omitted", () => {
    const result = createMessageSchema.safeParse({ content: "Hello" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.visibility).toBe("public");
    }
  });

  it("should accept 'internal' visibility", () => {
    const result = createMessageSchema.safeParse({
      content: "Internal note for admins",
      visibility: "internal",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.visibility).toBe("internal");
    }
  });

  it("should accept single character content", () => {
    const result = createMessageSchema.safeParse({ content: "." });
    expect(result.success).toBe(true);
  });
});
