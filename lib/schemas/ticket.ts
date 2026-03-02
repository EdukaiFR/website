import * as z from "zod";

export const createTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Le titre doit contenir au moins 5 caractères")
    .max(200, "Le titre ne doit pas dépasser 200 caractères"),
  description: z
    .string()
    .min(20, "La description doit contenir au moins 20 caractères")
    .max(5000, "La description ne doit pas dépasser 5000 caractères"),
  type: z.string().min(1, "Le type est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  clientUrgency: z.string().min(1, "L'urgence est requise"),
  tags: z.array(z.string()).optional(),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;

export const createMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Le message ne peut pas être vide")
    .max(10000, "Le message ne doit pas dépasser 10 000 caractères"),
  visibility: z.enum(["public", "internal"]).default("public"),
});

export type CreateMessageFormValues = z.infer<typeof createMessageSchema>;
