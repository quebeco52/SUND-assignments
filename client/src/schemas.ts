import { z } from "zod";

    export const bookFormSchema = z.object({
      title: z.string().trim().min(1, "Title is required"),
      genre: z.string().trim().min(1, "Genre is required"),
      published_year: z.coerce
        .number()
        .int("Published year must be a whole number")
        .min(1, "Published year is required")
        .max(new Date().getFullYear(), "Year cannot be in the future"),
      author_id: z.coerce.number().int().positive("Choose an author"),
    });