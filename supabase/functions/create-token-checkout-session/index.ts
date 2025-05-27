
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { stripe, corsHeaders } from "../shared/stripe-client.ts";
import { createSupabaseClient } from "../shared/supabase-client.ts";

interface CheckoutRequest {
  priceId: string; // Stripe Price ID
  quantity: number; // Number of items (usually 1 for these products)
  product_metadata?: Record<string, string | number | boolean>; // For webhook processing
  // For Stripe Connect (e.g., for tips, to be implemented later):
  // transfer_data_destination?: string; // Stripe Connect account ID
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createSupabaseClient(); // Anon key client for auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

    if (userError || !user) {
      console.error("User auth error:", userError);
      return new Response(JSON.stringify({ error: "Authentication failed" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { priceId, quantity, product_metadata } = await req.json() as CheckoutRequest;
    if (!priceId || !quantity ) {
        return new Response(JSON.stringify({ error: "Missing priceId or quantity" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Determine success and cancel URLs from origin
    const origin = req.headers.get("origin") || "http://localhost:5173"; // Fallback for local dev
    const successUrl = `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/profile`;


    const sessionParams: any = { // Use 'any' for flexibility with conditional properties
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: "payment", // Default to payment, subscriptions will override this
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: user.id, 
      customer_email: user.email,
      metadata: product_metadata || {}, // Pass metadata to Stripe session
    };

    // Check if the price ID indicates a subscription
    // These are your subscription Price IDs:
    // price_1ROy0pEEqiDDPmsd0ypbXsfx (Standard)
    // price_1ROy49EEqiDDPmsdufe3Hfc7 (Premium)
    if (priceId === "price_1ROy0pEEqiDDPmsd0ypbXsfx" || priceId === "price_1ROy49EEqiDDPmsdufe3Hfc7") {
      sessionParams.mode = "subscription";
      // For subscriptions, metadata can be added to subscription_data
      sessionParams.subscription_data = {
        metadata: product_metadata || {},
      };
      delete sessionParams.metadata; // Avoid redundant top-level metadata if subscription_data.metadata is used
    }

    // TODO: For Stripe Connect (e.g., tips), you would add 'transfer_data' here:
    // if (product_metadata?.product_type === 'tip' && transfer_data_destination) {
    //   sessionParams.payment_intent_data = {
    //     transfer_data: {
    //       destination: transfer_data_destination,
    //       // amount: calculateApplicationFee(sessionParams.line_items[0].price * quantity) // If you need to calculate app fee
    //     },
    //   };
    // }


    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Checkout session error:", error);
    // Ensure error.message is accessed safely
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

