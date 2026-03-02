import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FileDropzone } from "@/components/ticket/file-dropzone";

vi.mock("@/lib/utils/file-upload", () => ({
  validateFile: vi.fn((file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, error: "File too large" };
    }
    if (!file.type.startsWith("image/") && file.type !== "application/pdf" && file.type !== "text/plain") {
      return { valid: false, error: "Unsupported file type" };
    }
    return { valid: true };
  }),
}));

vi.mock("@/lib/toast", () => ({
  showToast: {
    warning: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

function createFile(name: string, size: number, type: string): File {
  const buffer = new ArrayBuffer(size);
  return new File([buffer], name, { type });
}

describe("FileDropzone", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the drop zone with upload instructions", () => {
    render(
      <FileDropzone
        files={[]}
        onFilesChange={vi.fn()}
      />
    );

    expect(screen.getByText(/Glissez vos fichiers ici/)).toBeInTheDocument();
  });

  it("should not show file list when no files", () => {
    render(
      <FileDropzone
        files={[]}
        onFilesChange={vi.fn()}
      />
    );

    expect(screen.queryByText(/Fichiers sélectionnés/)).not.toBeInTheDocument();
  });

  it("should show file list with counter when files present", () => {
    const files = [createFile("test.png", 1024, "image/png")];
    render(
      <FileDropzone
        files={files}
        onFilesChange={vi.fn()}
      />
    );

    expect(screen.getByText("test.png")).toBeInTheDocument();
    expect(screen.getByText("1/5")).toBeInTheDocument();
  });

  it("should show file size in Ko", () => {
    const files = [createFile("doc.pdf", 2048, "application/pdf")];
    render(
      <FileDropzone
        files={files}
        onFilesChange={vi.fn()}
      />
    );

    expect(screen.getByText("2 Ko")).toBeInTheDocument();
  });

  it("should call onFilesChange when remove button is clicked", () => {
    const file1 = createFile("a.png", 100, "image/png");
    const file2 = createFile("b.png", 200, "image/png");
    const onFilesChange = vi.fn();

    render(
      <FileDropzone
        files={[file1, file2]}
        onFilesChange={onFilesChange}
      />
    );

    const removeButtons = screen.getAllByRole("button");
    fireEvent.click(removeButtons[0]);

    expect(onFilesChange).toHaveBeenCalledWith([file2]);
  });

  it("should display custom maxFiles counter", () => {
    const files = [createFile("test.png", 1024, "image/png")];
    render(
      <FileDropzone
        files={files}
        onFilesChange={vi.fn()}
        maxFiles={3}
      />
    );

    expect(screen.getByText("1/3")).toBeInTheDocument();
  });

  it("should apply disabled styling when disabled prop is true", () => {
    const { container } = render(
      <FileDropzone
        files={[]}
        onFilesChange={vi.fn()}
        disabled={true}
      />
    );

    const label = container.querySelector("label");
    expect(label?.className).toContain("cursor-not-allowed");
    expect(label?.className).toContain("opacity-50");
  });

  it("should disable file input when disabled", () => {
    render(
      <FileDropzone
        files={[]}
        onFilesChange={vi.fn()}
        disabled={true}
      />
    );

    const input = document.getElementById("ticket-file-input") as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});
