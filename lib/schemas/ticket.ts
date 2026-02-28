import * as z from "zod";

export const createTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Le titre doit contenir au moins 5 caracteres")
    .max(200, "Le titre ne doit pas depasser 200 caracteres"),
  description: z
    .string()
    .min(20, "La description doit contenir au moins 20 caracteres")
    .max(5000, "La description ne doit pas depasser 5000 caracteres"),
  type: z.string().min(1, "Le type est requis"),
  category: z.string().min(1, "La categorie est requise"),
  clientUrgency: z.string().min(1, "L'urgence est requise"),
  tags: z.array(z.string()).optional(),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;

export const createMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Le message ne peut pas etre vide")
    .max(10000, "Le message ne doit pas depasser 10 000 caracteres"),
  visibility: z.enum(["public", "internal"]).default("public"),
});

export type CreateMessageFormValues = z.infer<typeof createMessageSchema>;
