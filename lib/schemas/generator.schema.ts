import { z } from "zod";

export const GeneratorFormSchema = z.object({
    title: z.string().min(1, { message: "Title is required." }),
    subject: z.string().min(1, { message: "Subject is required." }),
    level: z.string().min(1, { message: "Level is required." }),
    files: z.array(z.any()).min(1, { message: "Files are required." }),
});

export type GeneratorFormSchemaType = z.infer<typeof GeneratorFormSchema>;
