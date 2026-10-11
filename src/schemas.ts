import { z } from "zod";

export const bookSchema = z.object({
    title: z
        .string({ error: "A book needs a title" })
        .min(1, "A book needs a title"),
    genre: z.string(),
    published_year: z.number(),
    author_id: z.number(),
});

export type Book = z.infer<typeof bookSchema> & { id: number };

export const bookPatchSchema = bookSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided",
    });

export type BookPatch = z.infer<typeof bookPatchSchema>;




export const idParamSchema = z.object({
    id: z.coerce.number().int().positive(),
});
export type IDParam = z.infer<typeof idParamSchema>;


export const bookQuerySchema = z.object({
    genre: z.string().optional(),
    sort: z.enum(["title", "published_year", "genre"]).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(10),
});

export type BookQuery = z.infer<typeof bookQuerySchema>;

