import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.string().default('4000'),
  DATABASE_URL: z.string(),
});

export type Env = z.infer<typeof envSchema>;
