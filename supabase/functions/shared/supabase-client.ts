
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

export function createSupabaseClient(useServiceRole: boolean = false) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  if (!supabaseUrl) throw new Error("SUPABASE_URL is not set");

  const supabaseKey = useServiceRole 
    ? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") 
    : Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseKey) throw new Error(useServiceRole ? "SUPABASE_SERVICE_ROLE_KEY is not set" : "SUPABASE_ANON_KEY is not set");
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
