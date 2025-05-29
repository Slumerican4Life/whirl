
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../shared/stripe-client.ts";

// This function is now disabled since everything is free
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Everything is free now - no token spending required
  return new Response(JSON.stringify({ 
    success: true, 
    message: "All features are now free! No tokens required.",
    newBalance: "unlimited" 
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
