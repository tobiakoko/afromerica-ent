import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/utils/supabase/types";

let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function createClient() {
  // Singleton pattern to prevent multiple client instances
  if (client) {
    return client;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check your .env.local file."
    );
  }

  // Create a supabase client on the browser with project's credentials
  client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
    global: {
      headers: {
        "x-application-name": "afromerica-ent",
      },
    },
  });

  return client;
}