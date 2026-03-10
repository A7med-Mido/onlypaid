import z from "zod";

const env = z.object({
  DB_URL: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  NEXTAUTH_SECRET: z.string(),
  MAX_UPLOAD_FILE: z.string()
});

const envs = env.parse(process.env)

export default envs;