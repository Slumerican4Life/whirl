
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { stripe, corsHeaders } from "../shared/stripe-client.ts";
import { createSupabaseClient } from "../shared/supabase-client.ts";

interface TokenPurchaseRequest {
  priceId: string; // Stripe Price ID
  quantity: number; // Number of token packages (usually 1)
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createSupabaseClient();
    const authHeader = req.headers.get("Authorization")!;
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

    if (userError || !user) {
      console.error("User auth error:", userError);
      return new Response(JSON.stringify({ error: "Authentication failed" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { priceId, quantity } = await req.json() as TokenPurchaseRequest;
    if (!priceId || !quantity ) {
        return new Response(JSON.stringify({ error: "Missing priceId or quantity" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/profile`, // Redirect to profile on cancel
      client_reference_id: user.id, // Store user_id for webhook or success page
      customer_email: user.email, // Pre-fill email
    });

    return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Checkout session error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
