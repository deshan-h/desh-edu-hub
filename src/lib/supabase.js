import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "Warning: Supabase credentials are not fully set in environment variables."
    );
  }
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "");

