import dotenv from "dotenv";

dotenv.config();

export const {
  PORT: port,
  MONGODB_URL: mongoUrl,
  JWT_SECRET: secretWord,
  DEBUG: debug,
  SUPABASE_URL: supabaseUrl,
  SUPABASE_KEY: supabaseKey,
  SUPABASE_BUCKET_ID: supabaseBucketId,
} = process.env;
