import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    DB_USER: z.string(),
    DB_HOST: z.string(),
    DB_DATABASE: z.string(),
    DB_PASSWORD: z.string(),
    DB_PORT: z.coerce.number().default(5432),
    PORT: z.coerce.number().default(3000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid environment variables:", z.treeifyError(parsed.error));
    process.exit(1);
}

export const env = parsed.data;
export const {
    DB_USER,
    DB_HOST,
    DB_DATABASE,
    DB_PASSWORD,
    DB_PORT,
    PORT,
} = parsed.data;

export default env;
