export type Options = "pictures" | "files";

export type GeneratorForm = {
  option: Options;
  title: string;
  subject: string;
  level: string;
  files: File[];
};

export type GenerationStep = 0 | 1 | 2 | 3 | 4;

export type FileProcessingState = Record<string, boolean>;
